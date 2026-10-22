#!/usr/bin/env node
/*
 * Gera as páginas estáticas do site a partir de js/dados.js, js/i18n.js e index.html:
 *   en/index.html                  — página inicial em inglês (texto já traduzido, bom para o Google)
 *   produto/<slug>.html            — página de cada produto em português  (/produto/<slug>)
 *   en/product/<slug>.html         — página de cada produto em inglês    (/en/product/<slug>)
 *   sitemap.xml
 * Também atualiza o bloco de SEO do <head> do index.html.
 *
 * Rode sempre que mudar produtos, textos ou o index.html:   node tools/gerar.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (f, s) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, f), s);
};

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(read("js/dados.js"), ctx);
vm.runInContext(read("js/i18n.js"), ctx);
const D = ctx.window.DANA;
const I18N = ctx.window.I18N;
const SITE = D.siteUrl.replace(/\/$/, "");
const S = { pt: Object.assign({}, I18N.pt), en: Object.assign({}, I18N.pt, I18N.en) };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tr = (v, l) => (v == null ? "" : typeof v === "string" ? v : v[l] || v.pt || "");
const HTML_LANG = { pt: "pt-BR", en: "en" };
const OG_LOCALE = { pt: "pt_BR", en: "en_US" };
const HOME = { pt: "/", en: "/en" };
const PROD = { pt: (s) => "/produto/" + s, en: (s) => "/en/product/" + s };
const other = (l) => (l === "pt" ? "en" : "pt");

const produtos = D.produtos.filter((p) => p.ativo !== false && (D.mostrarExemplos || !p.exemplo));
const loja = (p) => D.lojas[p.loja] || D.lojas.outra;
const lojaNome = (p, l) => (p.lojaNome ? tr(p.lojaNome, l) : tr(loja(p).nome, l));
const mercado = (p) => p.mercado || loja(p).mercado || "us";
const BANDEIRA = { us: "🇺🇸", br: "🇧🇷" };
const catNome = (id, l) => tr((D.categorias.find((c) => c.id === id) || {}).nome, l);

/* ---------- <head>: bloco de SEO ---------- */
function seoBlock({ lang, urls, title, desc, image, imageAlt, ld, noindex }) {
  const img = SITE + (image || "/assets/img/og-image.jpg");
  return [
    "<!-- seo:start (gerado por tools/gerar.js) -->",
    noindex ? '<meta name="robots" content="noindex, follow">' : "",
    `<link rel="canonical" href="${SITE}${urls[lang]}">`,
    `<link rel="alternate" hreflang="pt-BR" href="${SITE}${urls.pt}">`,
    `<link rel="alternate" hreflang="en" href="${SITE}${urls.en}">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}${urls.en}">`,
    `<meta name="description" content="${esc(desc)}">`,
    '<meta property="og:site_name" content="Escolhas da Dana">',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${SITE}${urls[lang]}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    `<meta property="og:locale:alternate" content="${OG_LOCALE[other(lang)]}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:alt" content="${esc(imageAlt || title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${img}">`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    "<!-- seo:end -->"
  ].filter(Boolean).join("\n  ");
}
const replaceSeo = (html, block) => html.replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, block);

const pessoa = { "@type": "Person", name: "Danielly Matos Dana", sameAs: [D.instagram].concat(Object.values(D.redes || {}).filter(Boolean)) };

/* ---------- Página inicial (pt e en) ---------- */
function homeSeo(lang) {
  return seoBlock({
    lang,
    urls: HOME,
    title: lang === "pt" ? "Escolhas da Dana · @onlydaninha30" : S.en.metaTitle,
    desc: lang === "pt"
      ? "Moda, beleza, viagens e momentos da rotina: uma seleção de indicações de Danielly Matos Dana, do Instagram @onlydaninha30."
      : S.en.metaDesc,
    imageAlt: lang === "pt" ? "Dana dentro de um arco dourado, com o título Escolhas da Dana" : "Dana inside a golden arch with the title Escolhas da Dana",
    ld: {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", name: "Escolhas da Dana", url: SITE + HOME[lang], inLanguage: HTML_LANG[lang], author: pessoa },
        Object.assign({ url: SITE + "/" }, pessoa)
      ]
    }
  });
}

function traduzir(html, St) {
  // troca o conteúdo dos elementos com data-i18n pelo texto em inglês
  html = html.replace(/(<(\w+)\b[^>]*\sdata-i18n="([\w-]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (m, open, tag, key, inner, close) => (St[key] ? open + St[key] + close : m));
  html = html.replace(/<(\w+)\b[^>]*\sdata-i18n-(alt|aria)="([\w-]+)"[^>]*>/g, (m, tag, kind, key) => {
    if (!St[key]) return m;
    const attr = kind === "alt" ? "alt" : "aria-label";
    return m.replace(new RegExp(`\\s${attr}="[^"]*"`), ` ${attr}="${esc(St[key])}"`);
  });
  return html;
}

let index = read("index.html");
index = replaceSeo(index, homeSeo("pt"));
write("index.html", index);

let en = index
  .replace('<html lang="pt-BR" data-lang="pt">', '<html lang="en" data-lang="en">')
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(S.en.metaTitle)}</title>`)
  .replace('aria-label="Principal"', `aria-label="${esc(S.en.ariaNav)}"`);
en = replaceSeo(en, homeSeo("en"));
en = traduzir(en, S.en);
write("en/index.html", en);

/* ---------- Página de produto ---------- */
function headerHtml(lang, urls) {
  const St = S[lang];
  return `<header class="site-header">
    <a class="wordmark" href="${HOME[lang]}" aria-label="${esc(St.ariaHome)}">Escolhas <em>da</em> Dana</a>
    <nav class="site-nav" aria-label="${esc(St.ariaNav)}">
      <a href="${HOME[lang]}#indicacoes">${esc(St.navIndicacoes || "Indicações")}</a>
      <a href="${HOME[lang]}#lifestyle">Lifestyle</a>
      <a class="nav-ig" href="${esc(D.instagram)}" target="_blank" rel="noopener">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor"/></svg>
        <span class="nav-ig-label">@onlydaninha30</span>
      </a>
      <div class="lang-switch" role="group" aria-label="${esc(St.ariaIdioma)}">
        <a href="${urls.pt}" data-lang-link="pt" aria-current="${lang === "pt"}" lang="pt-BR" hreflang="pt-BR">PT</a>
        <a href="${urls.en}" data-lang-link="en" aria-current="${lang === "en"}" lang="en" hreflang="en">EN</a>
      </div>
    </nav>
  </header>`;
}

function footerHtml(lang) {
  const St = S[lang];
  return `<footer class="site-footer">
    <p class="footer-mark">Escolhas <em>da</em> Dana</p>
    <p class="ornament" aria-hidden="true">✦</p>
    <p>${St.rodapeAviso || "Alguns links são de afiliados. Compras, pagamentos, entregas e trocas são feitos diretamente nas lojas parceiras."}</p>
    ${D.amazonAssociate ? `<p class="amazon-note">${esc(St.amazonAviso)}</p>` : ""}
    <p class="footer-links">
      <a href="/privacidade.html?lang=${lang}">${esc(St.rodapePrivacidade || "Privacidade")}</a>
      <a href="/termos.html?lang=${lang}">${esc(St.rodapeTermos || "Termos")}</a>
      <a href="${HOME[lang]}#parcerias">${esc(St.rodapeParcerias || "Parcerias")}</a>
    </p>
    <p class="footer-copy">© ${new Date().getFullYear()} Danielly Matos Dana</p>
  </footer>`;
}

function fotoHtml(p, lang, sizes) {
  const nome = tr(p.nome, lang);
  if (!p.imagem) {
    return `<div class="ph"><span class="ph-mark">${esc(nome.charAt(0))}</span><span class="ph-label">${esc(S[lang].fotoProduto)}</span></div>`;
  }
  const set = /\.webp$/.test(p.imagem) ? ` srcset="${esc(p.imagem.replace(/\.webp$/, "-640.webp"))} 640w, ${esc(p.imagem)} 1400w" sizes="${sizes}"` : "";
  return `<img src="${esc(p.imagem)}"${set} alt="${esc(nome)}" decoding="async">`;
}

function paginaProduto(p, lang) {
  const St = S[lang];
  const urls = { pt: PROD.pt(p.slug), en: PROD.en(p.slug) };
  const nome = tr(p.nome, lang);
  const frase = tr(p.frase, lang);
  const cat = catNome(p.categoria, lang);
  const title = `${nome} · Escolhas da Dana`;
  const desc = `${frase} ${lang === "pt" ? "Indicação de" : "Picked by"} Danielly Matos Dana (@onlydaninha30).`;
  const botao = p.link
    ? `<a class="btn btn-gold produto-buy" href="${esc(p.link)}" target="_blank" rel="sponsored noopener" data-track="affiliate_click" data-produto="${esc(p.slug)}" data-loja="${esc(p.loja)}">${esc(tr(loja(p).botao, lang))} <span aria-hidden="true">→</span><span class="sr-only"> ${esc(St.abreNovaAba)}</span></a>`
    : `<span class="btn btn-gold produto-buy is-disabled" aria-disabled="true">${esc(St.linkEmBreve)}</span>`;

  const mesmos = produtos.filter((o) => o.slug !== p.slug && o.categoria === p.categoria);
  const outros = produtos.filter((o) => o.slug !== p.slug && o.categoria !== p.categoria);
  const relacionados = mesmos.concat(outros).slice(0, 4);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Escolhas da Dana", item: SITE + HOME[lang] },
          { "@type": "ListItem", position: 2, name: cat || St.navIndicacoes, item: SITE + HOME[lang] + "#indicacoes" },
          { "@type": "ListItem", position: 3, name: nome, item: SITE + urls[lang] }
        ]
      },
      { "@type": "WebPage", name: title, description: desc, url: SITE + urls[lang], inLanguage: HTML_LANG[lang], author: pessoa }
    ]
  };

  return `<!doctype html>
<html lang="${HTML_LANG[lang]}" data-lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="theme-color" content="#FBF6F2">
  <meta property="og:type" content="product">
  ${seoBlock({ lang, urls, title, desc, image: p.imagem && /\.(jpe?g|png)$/i.test(p.imagem) ? p.imagem : null, imageAlt: nome, ld, noindex: !!p.exemplo })}
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2232%22 fill=%22%2324121B%22/%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2227%22 fill=%22none%22 stroke=%22%23D9BC8A%22 stroke-width=%221.5%22/%3E%3Ctext x=%2232%22 y=%2243%22 font-family=%22Georgia,serif%22 font-style=%22italic%22 font-size=%2232%22 fill=%22%23E9D3A8%22 text-anchor=%22middle%22%3ED%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Jost:wght@300;400;500;600&family=Pinyon+Script&display=swap">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="pagina-produto">
  <div class="page-frame" aria-hidden="true"></div>
  ${headerHtml(lang, urls)}

  <main class="produto-page">
    <nav class="breadcrumb" aria-label="${lang === "pt" ? "Você está em" : "You are here"}">
      <a href="${HOME[lang]}">${lang === "pt" ? "Início" : "Home"}</a> <span aria-hidden="true">›</span>
      <a href="${HOME[lang]}#indicacoes">${esc(cat || St.navIndicacoes)}</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(nome)}</span>
    </nav>

    <article class="produto-main">
      <div class="produto-visual">
        <figure class="produto-photo">${fotoHtml(p, lang, "(min-width: 900px) 46vw, 92vw")}
          ${p.exemplo ? `<span class="badge">${esc(St.exemplo)}</span>` : ""}
        </figure>
      </div>
      <div class="produto-info">
        <p class="eyebrow"><span>${esc(cat)}</span></p>
        <h1>${esc(nome)}</h1>
        <p class="produto-store"><span class="flag" aria-hidden="true">${BANDEIRA[mercado(p)]}</span> ${esc(lojaNome(p, lang))}</p>
        <p class="produto-frase">${esc(frase)}</p>
        <div class="produto-actions">
          ${botao}
          <a class="link-line" href="${HOME[lang]}#indicacoes">${lang === "pt" ? "Ver todas as indicações" : "See all picks"}</a>
        </div>
        <p class="produto-aviso">${lang === "pt"
          ? "Link de afiliado: posso receber comissão se você comprar por ele, sem custo extra para você. Preço, entrega e trocas são da loja."
          : "Affiliate link: I may earn a commission if you buy through it, at no extra cost to you. Price, shipping and returns are handled by the store."}</p>
      </div>
    </article>

    ${relacionados.length ? `<section class="produto-rel" aria-labelledby="rel-title">
      <h2 id="rel-title">${lang === "pt" ? "Você também pode <em>gostar</em>" : "You may also <em>like</em>"}</h2>
      <ul class="rel-list">
        ${relacionados.map((o) => `<li><a class="rel-card" href="${PROD[lang](o.slug)}">
          <figure class="rel-photo">${fotoHtml(o, lang, "(min-width: 900px) 20vw, 44vw")}</figure>
          <span class="rel-store">${esc(lojaNome(o, lang))}</span>
          <span class="rel-name">${esc(tr(o.nome, lang))}</span>
        </a></li>`).join("\n        ")}
      </ul>
    </section>` : ""}
  </main>

  ${footerHtml(lang)}

  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script src="/js/dados.js"></script>
  <script src="/js/pagina.js"></script>
</body>
</html>
`;
}

// limpa páginas antigas e gera de novo
for (const dir of ["produto", "en/product"]) {
  const abs = path.join(ROOT, dir);
  if (fs.existsSync(abs)) fs.readdirSync(abs).filter((f) => f.endsWith(".html")).forEach((f) => fs.unlinkSync(path.join(abs, f)));
}
for (const p of produtos) {
  write(`produto/${p.slug}.html`, paginaProduto(p, "pt"));
  write(`en/product/${p.slug}.html`, paginaProduto(p, "en"));
}

/* ---------- sitemap.xml (itens "Exemplo" ficam de fora) ---------- */
const hoje = new Date().toISOString().slice(0, 10);
const urlXml = (urls) => ["pt", "en"].map((l) => `  <url>
    <loc>${SITE}${urls[l]}</loc>
    <lastmod>${hoje}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}${urls.pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${urls.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${urls.en}"/>
  </url>`).join("\n");
const reais = produtos.filter((p) => !p.exemplo);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlXml(HOME)}
${reais.map((p) => urlXml({ pt: PROD.pt(p.slug), en: PROD.en(p.slug) })).join("\n")}
  <url><loc>${SITE}/privacidade.html</loc></url>
  <url><loc>${SITE}/termos.html</loc></url>
</urlset>
`);

console.log(`ok: en/index.html, ${produtos.length * 2} páginas de produto, sitemap com ${2 + reais.length * 2} páginas`);
