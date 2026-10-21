(function () {
  "use strict";

  var D = window.DANA;
  /* Idioma: ?lang= na URL > escolha salva > idioma do navegador > português */
  var LANGS = ["pt", "en"];
  var params = new URLSearchParams(location.search);
  var saved = null;
  try { saved = localStorage.getItem("dana-lang"); } catch (e) {}
  var browser = (navigator.language || "").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  var lang = [params.get("lang"), saved, browser].filter(function (l) { return LANGS.indexOf(l) > -1; })[0] || "pt";
  var S = Object.assign({}, window.I18N.pt, window.I18N[lang] || {});

  function t(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] || v.pt || "";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function $(sel) { return document.querySelector(sel); }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Idioma ---------- */
  if (lang !== "pt") {
    document.documentElement.lang = lang === "en" ? "en" : lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (S[key]) el.innerHTML = S[key];
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (S[key]) el.setAttribute("alt", S[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (S[key]) el.setAttribute("aria-label", S[key]);
    });
    if (S.metaTitle) document.title = S.metaTitle;
    var md = document.querySelector('meta[name="description"]');
    if (md && S.metaDesc) md.setAttribute("content", S.metaDesc);
  }

  // Botão PT | EN: salva a escolha e recarrega no idioma escolhido, mantendo a posição (#)
  document.querySelectorAll("[data-set-lang]").forEach(function (b) {
    var l = b.getAttribute("data-set-lang");
    b.setAttribute("aria-pressed", String(l === lang));
    b.addEventListener("click", function () {
      if (l === lang) return;
      try { localStorage.setItem("dana-lang", l); } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.set("lang", l);
      location.href = u.toString();
    });
  });
  document.querySelectorAll('a[href="privacidade.html"], a[href="termos.html"]').forEach(function (a) {
    a.href = a.getAttribute("href") + "?lang=" + lang;
  });

  /* ---------- Medição de cliques (Vercel Analytics e, se configurado, Google Analytics 4) ---------- */
  if (D.ga4Id) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(D.ga4Id);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", D.ga4Id);
  }
  function track(name, data) {
    try { if (window.va) window.va("event", { name: name, data: data }); } catch (e) {}
    try { if (window.gtag) window.gtag("event", name, data); } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-track]");
    if (!a) return;
    track(a.getAttribute("data-track"), {
      produto: a.getAttribute("data-produto") || "",
      loja: a.getAttribute("data-loja") || "",
      idioma: lang
    });
  });

  /* ---------- Dados ---------- */
  var produtos = D.produtos.filter(function (p) {
    return p.ativo !== false && (D.mostrarExemplos || !p.exemplo);
  });
  var bySlug = {};
  produtos.forEach(function (p) { bySlug[p.slug] = p; });

  var catNome = {};
  D.categorias.forEach(function (c) { catNome[c.id] = t(c.nome); });

  function lojaNome(p) {
    if (p.lojaNome) return t(p.lojaNome);
    var l = D.lojas[p.loja] || D.lojas.outra;
    return t(l.nome);
  }

  function lojaBotao(p) {
    var l = D.lojas[p.loja] || D.lojas.outra;
    return t(l.botao);
  }

  function mercado(p) {
    return p.mercado || (D.lojas[p.loja] || D.lojas.outra).mercado || "us";
  }
  var BANDEIRA = { us: "🇺🇸", br: "🇧🇷" };

  function placeholder(label, mark) {
    return '<div class="ph"><span class="ph-mark">' + esc(mark || "") + '</span><span class="ph-label">' + esc(label) + "</span></div>";
  }

  // Para "foto.webp", usa também "foto-640.webp" no celular (gerada junto).
  function img(src, alt, eager, sizes) {
    var set = /\.webp$/.test(src) && !/-640\.webp$/.test(src)
      ? ' srcset="' + esc(src.replace(/\.webp$/, "-640.webp")) + ' 640w, ' + esc(src) + ' 1400w" sizes="' + (sizes || "(min-width: 900px) 50vw, 100vw") + '"'
      : "";
    return '<img src="' + esc(src) + '"' + set + ' alt="' + esc(alt) + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }

  function buyButton(p, label, variant) {
    var cls = "btn " + (variant || "btn-primary");
    if (!p.link) {
      return '<span class="' + cls + ' is-disabled" aria-disabled="true">' + esc(S.linkEmBreve) + "</span>";
    }
    return '<a class="' + cls + '" href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener"' +
      ' data-track="affiliate_click" data-produto="' + esc(p.slug) + '" data-loja="' + esc(p.loja) + '">' +
      esc(label) + '<span class="sr-only"> ' + esc(S.abreNovaAba) + "</span></a>";
  }

  /* ---------- Links do Instagram e fotos fixas ---------- */
  document.querySelectorAll("[data-ig]").forEach(function (a) { a.href = D.instagram; });
  $("#ano").textContent = new Date().getFullYear();

  document.querySelectorAll("[data-foto]").forEach(function (fig) {
    var key = fig.getAttribute("data-foto");
    var src = D.fotos[key];
    fig.innerHTML = src ? img(src, t(D.fotosAlt[key]), key === "hero") : placeholder(S.fotoDana, "D");
  });

  var temExemplo = produtos.some(function (p) { return p.exemplo; });
  if (temExemplo) {
    var bar = $("#preview-bar");
    bar.textContent = S.previa;
    bar.hidden = false;
  }

  /* ---------- Vitrine ---------- */
  var track = $("#track");
  var vitrine = $("#indicacoes");
  var filtersEl = $("#filters");
  var prevBtn = $("#prev");
  var nextBtn = $("#next");
  var toggleBtn = $("#toggle-grid");
  var filtroAtivo = "todos";

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  track.innerHTML = produtos.map(function (p, i) {
    var foto = p.imagem ? img(p.imagem, t(p.nome)) : placeholder(S.fotoProduto, t(p.nome).charAt(0));
    return '<li class="card" id="produto-' + esc(p.slug) + '" data-cat="' + esc(p.categoria) + '" data-mkt="' + mercado(p) +
      '" data-cols="' + esc((p.colecoes || []).join(" ")) + '" tabindex="-1">' +
      '<div class="card-frame">' +
      '<figure class="card-photo corners">' + foto +
      (p.exemplo ? '<span class="badge">' + esc(S.exemplo) + "</span>" : "") + "</figure>" +
      '<div class="card-body">' +
      '<p class="card-meta"><span class="card-n">Nº ' + pad2(i + 1) + '</span><span class="card-store">' +
      '<span class="flag" aria-hidden="true">' + BANDEIRA[mercado(p)] + "</span> " + esc(lojaNome(p)) + "</span></p>" +
      '<h3 class="card-name">' + esc(t(p.nome)) + "</h3>" +
      (catNome[p.categoria] ? '<p class="card-cat">' + esc(catNome[p.categoria]) + "</p>" : "") +
      '<p class="card-text">' + esc(t(p.frase)) + "</p>" +
      buyButton(p, lojaBotao(p), "btn-outline btn-card") +
      '<a class="card-aff" href="#como-comprar">' + esc(S.linkAfiliado) + "</a>" +
      "</div></div></li>";
  }).join("");

  var catsComProduto = D.categorias.filter(function (c) {
    return produtos.some(function (p) { return p.categoria === c.id; });
  });
  var chips = [{ id: "todos", nome: S.todos, imagem: D.imagemTodos }].concat(catsComProduto.map(function (c) {
    return { id: c.id, nome: t(c.nome), imagem: c.imagem };
  }));
  filtersEl.innerHTML = chips.map(function (c) {
    return '<button type="button" class="chip" data-filter="' + esc(c.id) + '" aria-pressed="' +
      (c.id === "todos") + '">' +
      '<span class="chip-photo corners">' + (c.imagem ? img(c.imagem, "", false, "(min-width: 900px) 18vw, 40vw") : placeholder("", c.nome.charAt(0))) + "</span>" +
      '<span class="chip-name">' + esc(c.nome) + "</span></button>";
  }).join("");

  /* Coleções (guias) e "onde comprar" (EUA / Brasil) */
  var colecaoAtiva = "";
  var mercadoAtivo = "todos";
  var colecoesEl = $("#collections");
  var cols = (D.colecoes || []).filter(function (c) {
    return produtos.some(function (p) { return (p.colecoes || []).indexOf(c.id) > -1; });
  });
  if (cols.length) {
    colecoesEl.innerHTML = cols.map(function (c) {
      return '<button type="button" class="pill" data-col="' + esc(c.id) + '" aria-pressed="false">' + esc(t(c.nome)) + "</button>";
    }).join("");
  } else {
    $("#collections-wrap").hidden = true;
  }
  var mercadoEl = $("#market");
  var temUS = produtos.some(function (p) { return mercado(p) === "us"; });
  var temBR = produtos.some(function (p) { return mercado(p) === "br"; });
  if (temUS && temBR) {
    mercadoEl.innerHTML = [["todos", S.mercadoTodos], ["us", S.mercadoUS], ["br", S.mercadoBR]].map(function (m) {
      return '<button type="button" class="pill" data-mkt="' + m[0] + '" aria-pressed="' + (m[0] === "todos") + '">' + esc(m[1]) + "</button>";
    }).join("");
  } else {
    $("#market-wrap").hidden = true;
  }

  function aplicarFiltros() {
    var visiveis = 0;
    track.querySelectorAll(".card").forEach(function (card) {
      var ok = (filtroAtivo === "todos" || card.getAttribute("data-cat") === filtroAtivo) &&
        (!colecaoAtiva || (" " + card.getAttribute("data-cols") + " ").indexOf(" " + colecaoAtiva + " ") > -1) &&
        (mercadoAtivo === "todos" || card.getAttribute("data-mkt") === mercadoAtivo);
      card.hidden = !ok;
      if (ok) visiveis++;
    });
    $("#empty-note").hidden = visiveis > 0;
    track.scrollLeft = 0;
    updateArrows();
  }

  function setFiltro(id) {
    filtroAtivo = id;
    filtersEl.querySelectorAll(".chip").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
    });
    aplicarFiltros();
  }

  function limparFiltros() {
    colecaoAtiva = "";
    mercadoAtivo = "todos";
    colecoesEl.querySelectorAll(".pill").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    mercadoEl.querySelectorAll(".pill").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mkt") === "todos"));
    });
    setFiltro("todos");
  }

  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) setFiltro(b.getAttribute("data-filter"));
  });
  colecoesEl.addEventListener("click", function (e) {
    var b = e.target.closest(".pill");
    if (!b) return;
    var id = b.getAttribute("data-col");
    colecaoAtiva = colecaoAtiva === id ? "" : id;
    colecoesEl.querySelectorAll(".pill").forEach(function (x) {
      x.setAttribute("aria-pressed", String(x.getAttribute("data-col") === colecaoAtiva));
    });
    aplicarFiltros();
  });
  mercadoEl.addEventListener("click", function (e) {
    var b = e.target.closest(".pill");
    if (!b) return;
    mercadoAtivo = b.getAttribute("data-mkt");
    mercadoEl.querySelectorAll(".pill").forEach(function (x) {
      x.setAttribute("aria-pressed", String(x === b));
    });
    aplicarFiltros();
  });

  function cardStep() {
    var card = track.querySelector(".card:not([hidden])");
    if (!card) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function scrollTrack(dir, page) {
    var step = cardStep();
    var amount = page ? Math.max(step, Math.floor(track.clientWidth / step) * step) : step;
    track.scrollBy({ left: dir * amount, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function updateArrows() {
    var max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= max - 2;
  }

  prevBtn.addEventListener("click", function () { scrollTrack(-1, true); });
  nextBtn.addEventListener("click", function () { scrollTrack(1, true); });
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);

  track.addEventListener("keydown", function (e) {
    if (vitrine.classList.contains("is-grid")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); scrollTrack(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); scrollTrack(-1); }
  });

  function setGrid(on) {
    vitrine.classList.toggle("is-grid", on);
    toggleBtn.textContent = on ? S.verCarrossel : S.verTodos;
    toggleBtn.setAttribute("aria-expanded", String(on));
    updateArrows();
  }
  toggleBtn.textContent = S.verTodos;
  toggleBtn.addEventListener("click", function () {
    setGrid(!vitrine.classList.contains("is-grid"));
  });

  /* ---------- Endereço direto: #produto/<slug> ---------- */
  function abrirProduto(slug) {
    var card = document.getElementById("produto-" + slug);
    if (!card) return;
    if (card.hidden) limparFiltros();

    vitrine.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (!vitrine.classList.contains("is-grid")) {
      var pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({ left: card.offsetLeft - pad, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
    card.focus({ preventScroll: true });
    card.classList.remove("is-highlight");
    void card.offsetWidth;
    card.classList.add("is-highlight");
    setTimeout(function () { card.classList.remove("is-highlight"); }, 2600);
  }

  function lerHash() {
    var m = location.hash.match(/^#produto\/([\w-]+)$/);
    if (m) abrirProduto(m[1]);
  }
  window.addEventListener("hashchange", lerHash);

  /* ---------- Banner: botão leva à vitrine já filtrada ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-goto-cat]");
    if (!a) return;
    e.preventDefault();
    limparFiltros();
    var cat = a.getAttribute("data-goto-cat");
    if (filtersEl.querySelector('[data-filter="' + cat + '"]')) setFiltro(cat);
    vitrine.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  /* ---------- Do Instagram para cá ---------- */
  var posts = (D.instagramPosts || []).filter(function (p) {
    return D.mostrarExemplos || !p.exemplo;
  }).slice(0, 3);
  var instaList = $("#insta-list");
  if (!posts.length) {
    instaList.closest("section").hidden = true;
  } else {
    instaList.innerHTML = posts.map(function (p) {
      var link = p.link || D.instagram;
      var look = (p.produtos || (p.produto ? [p.produto] : [])).map(function (s) { return bySlug[s]; }).filter(Boolean);
      return '<li class="post"><div class="post-card">' +
        '<a class="post-photo" href="' + esc(link) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
        (p.capa ? img(p.capa, t(p.legenda), false, "(min-width: 900px) 28vw, 78vw") : placeholder(S.capaPost, "")) +
        (p.exemplo ? '<span class="badge">' + esc(S.exemplo) + "</span>" : "") + "</a>" +
        '<p class="post-caption">' + esc(t(p.legenda)) + "</p>" +
        '<a class="btn btn-gold post-btn" href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(S.verInstagram) +
        '<span class="sr-only">: ' + esc(t(p.legenda)) + " " + esc(S.abreNovaAba) + "</span></a>" +
        "</div>" +
        (look.length ? '<div class="post-look"><p class="post-look-title">' + esc(look.length > 1 ? S.compreLook : S.encontrarProduto) + "</p>" +
          '<ul>' + look.map(function (pr) {
            return '<li><a href="#produto/' + esc(pr.slug) + '">' + esc(t(pr.nome)) + ' <span>· ' + esc(lojaNome(pr)) + "</span></a></li>";
          }).join("") + "</ul></div>" : "") +
        "</li>";
    }).join("");
  }

  /* ---------- Lifestyle ---------- */
  var life = D.lifestyle || {};
  var momentos = life.momentos || [];
  var lifeList = $("#lifestyle-list");
  if (!momentos.length) {
    lifeList.closest("section").hidden = true;
  } else {
    var catComProduto = {};
    catsComProduto.forEach(function (c) { catComProduto[c.id] = true; });
    lifeList.innerHTML = momentos.map(function (m, i) {
      var titulo = t(m.titulo);
      var link = m.categoria && catComProduto[m.categoria]
        ? '<a class="link-line lifestyle-link" href="#indicacoes" data-life-cat="' + esc(m.categoria) + '">' + esc(S.verIndicacoesDe) +
          '<span class="sr-only">: ' + esc(catNome[m.categoria] || titulo) + "</span></a>"
        : "";
      return '<li class="lifestyle-item reveal">' +
        '<figure class="lifestyle-photo">' + img(m.foto, titulo, false, "(min-width: 900px) 24vw, 72vw") + "</figure>" +
        '<p class="lifestyle-num">' + esc(S.momento) + " " + pad2(i + 1) + "</p>" +
        "<h3>" + esc(titulo) + "</h3>" +
        "<p>" + esc(t(m.texto)) + "</p>" + link + "</li>";
    }).join("");
    if (life.frase) $("#lifestyle-quote").textContent = t(life.frase);
    lifeList.addEventListener("click", function (e) {
      var a = e.target.closest("[data-life-cat]");
      if (!a) return;
      e.preventDefault();
      limparFiltros();
      setFiltro(a.getAttribute("data-life-cat"));
      vitrine.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ---------- Vitrines completas (Amazon Storefront, LTK, ShopMy) ---------- */
  var vitrines = (D.vitrines || []).filter(function (v) { return v.url || D.mostrarExemplos; });
  if (vitrines.length) {
    $("#vitrines").hidden = false;
    $("#vitrines-list").innerHTML = vitrines.map(function (v) {
      var btn = v.url
        ? '<a class="btn btn-gold" href="' + esc(v.url) + '" target="_blank" rel="sponsored noopener" data-track="storefront_click" data-loja="' + esc(v.id) + '">' + esc(S.vitrineBtn) + "</a>"
        : '<span class="btn btn-gold is-disabled" aria-disabled="true">' + esc(S.emBreve) + "</span>";
      return '<li class="storefront"><span class="storefront-flag" aria-hidden="true">' + (BANDEIRA[v.mercado] || "") + "</span>" +
        '<h3>' + esc(v.nome) + "</h3>" + btn + "</li>";
    }).join("");
  }

  /* ---------- Parcerias, redes e aviso da Amazon ---------- */
  var acoes = '<a class="btn btn-gold" href="' + esc(D.instagram) + '" target="_blank" rel="noopener">' + esc(S.parceriasDm) + "</a>";
  if (D.emailParcerias) {
    acoes += '<a class="link-line" href="mailto:' + esc(D.emailParcerias) + '">' + esc(S.parceriasEmail) + "</a>";
  }
  $("#parcerias-actions").innerHTML = acoes;

  // Ícones das redes no rodapé. Sem link, o ícone aparece apagado como "em breve".
  var ICONES = {"Instagram": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"17.4\" cy=\"6.6\" r=\"1\" fill=\"currentColor\"/></svg>", "TikTok": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\"><path d=\"M14.5 3c.4 2.3 1.9 3.9 4.5 4.2v3.1c-1.6 0-3.1-.5-4.4-1.4v6.1c0 3.3-2.6 5.5-5.6 5.5-3 0-5.4-2.4-5.4-5.4 0-3.2 2.8-5.7 6.2-5.3v3.2c-1.5-.4-3 .6-3 2.1 0 1.2 1 2.2 2.2 2.2 1.3 0 2.3-1 2.3-2.4V3h3.2z\" fill=\"currentColor\"/></svg>", "Pinterest": "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\"><path d=\"M12 2.5a9.5 9.5 0 0 0-3.5 18.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4.1 0-3.3 2.4-6.4 7-6.4 3.7 0 6.5 2.6 6.5 6.1 0 3.7-2.3 6.6-5.5 6.6-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9.5 9.5 0 1 0 12 2.5z\" fill=\"currentColor\"/></svg>"};
  var redes = [["Instagram", D.instagram], ["TikTok", (D.redes || {}).tiktok], ["Pinterest", (D.redes || {}).pinterest]];
  $("#footer-social").innerHTML = redes.map(function (r) {
    if (r[1]) {
      return '<a class="social" href="' + esc(r[1]) + '" target="_blank" rel="noopener" aria-label="' + r[0] + '">' + ICONES[r[0]] + "</a>";
    }
    return '<span class="social is-soon" title="' + r[0] + " · " + esc(S.emBreve) + '" aria-label="' + r[0] + " (" + esc(S.emBreve) + ')" role="img">' + ICONES[r[0]] + "</span>";
  }).join("");

  if (D.amazonAssociate) {
    var an = $("#amazon-note");
    an.textContent = S.amazonAviso;
    an.hidden = false;
    var av = document.querySelector('[data-i18n="avisoCompleto"]');
    if (av) av.textContent += " " + S.amazonAviso;
  }

  /* ---------- Vídeo da abertura (versão de computador ou de celular) ---------- */
  var heroVideo = $("#hero-video");
  if (heroVideo) {
    var desktopMq = window.matchMedia("(min-width: 900px)");
    var setHeroVideo = function () {
      var v = desktopMq.matches ? "desktop" : "mobile";
      if (heroVideo.dataset.current === v) return;
      heroVideo.dataset.current = v;
      heroVideo.poster = heroVideo.getAttribute("data-poster-" + v);
      if (reduceMotion) return; // só a imagem parada
      var mp4 = heroVideo.getAttribute("data-src-" + v);
      // MP4 (H.264) na maioria dos navegadores; WebM como reserva.
      heroVideo.src = heroVideo.canPlayType('video/mp4; codecs="avc1.640028"') ? mp4 : mp4.replace(/\.mp4$/, ".webm");
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    };
    setHeroVideo();
    if (desktopMq.addEventListener) desktopMq.addEventListener("change", setHeroVideo);
  }

  /* ---------- Peça interativa (thrine.app): carrega só quando a seção chega perto da tela ---------- */
  var showcase = $("#showcase-embed");
  if (showcase) {
    var carregarEmbed = function () {
      if (showcase.dataset.loaded) return;
      showcase.dataset.loaded = "1";
      var s = document.createElement("script");
      s.type = "module";
      s.src = "https://thrine.app/embed/v1.js";
      document.head.appendChild(s);
      var el = document.createElement("model-embed");
      el.setAttribute("project", showcase.getAttribute("data-project"));
      el.setAttribute("style", "display:block;width:100%;aspect-ratio:1092/774");
      showcase.appendChild(el);
    };
    if ("IntersectionObserver" in window) {
      var embedIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { carregarEmbed(); embedIo.disconnect(); }
      }, { rootMargin: "600px 0px" });
      embedIo.observe(showcase);
    } else {
      carregarEmbed();
    }
  }

  /* ---------- Malha dourada interativa na abertura (WebGL) ---------- */
  // Hexágonos dourados aparecem perto do cursor e em ondas a cada clique/toque.
  // Sem WebGL2 ou com "reduzir movimento" ativado, o site segue igual, sem o efeito.
  var ffCanvas = $("#hero-forcefield");
  if (ffCanvas && window.createForceField && !reduceMotion) {
    try {
      window.createForceField({ source: null, content: ffCanvas.parentElement, output: ffCanvas }, {
        shape: "hexagon",
        color: [0.80, 0.63, 0.34],      // dourado da marca
        edgeColor: [0.95, 0.85, 0.62],
        opacity: 0.9,
        cellScale: 11,
        lineWidth: 0.025,
        gridOpacity: 0,
        gridReveal: "both",
        gridRevealStrength: 1.4,
        gridRevealRadius: 220,
        gridFade: 0.6,
        flashIntensity: 0,
        flowIntensity: 0,
        edgeGlow: 0,
        rippleSpeed: 0.6,
        rippleDuration: 1.8,
        rippleIntensity: 0.45,
        refraction: 0,
        aberration: 0,
        haze: 0,
        tint: 0,
        hoverGlow: 0.04,
        hoverRadius: 260,
        hoverCharge: 0.9,
        bloom: 0.35,
        bloomThreshold: 0.35,
        grain: 0
      });
    } catch (e) {}
  }

  /* ---------- Entrada suave das seções ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Início ---------- */
  updateArrows();
  if (location.hash.indexOf("#produto/") === 0) {
    // espera fontes/layout para calcular a posição correta do card
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      requestAnimationFrame(lerHash);
    });
  }
})();
