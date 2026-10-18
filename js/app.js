(function () {
  "use strict";

  var D = window.DANA;
  var params = new URLSearchParams(location.search);
  var lang = params.get("lang") || "pt";
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
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (S[key]) el.innerHTML = S[key];
    });
  }

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
    return '<a class="' + cls + '" href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener">' +
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
    return '<li class="card" id="produto-' + esc(p.slug) + '" data-cat="' + esc(p.categoria) + '" tabindex="-1">' +
      '<div class="card-frame">' +
      '<figure class="card-photo corners">' + foto +
      (p.exemplo ? '<span class="badge">' + esc(S.exemplo) + "</span>" : "") + "</figure>" +
      '<div class="card-body">' +
      '<p class="card-meta"><span class="card-n">Nº ' + pad2(i + 1) + '</span><span class="card-store">' + esc(lojaNome(p)) + "</span></p>" +
      '<h3 class="card-name">' + esc(t(p.nome)) + "</h3>" +
      (catNome[p.categoria] ? '<p class="card-cat">' + esc(catNome[p.categoria]) + "</p>" : "") +
      '<p class="card-text">' + esc(t(p.frase)) + "</p>" +
      buyButton(p, lojaBotao(p), "btn-outline btn-card") +
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

  function setFiltro(id) {
    filtroAtivo = id;
    filtersEl.querySelectorAll(".chip").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
    });
    track.querySelectorAll(".card").forEach(function (card) {
      card.hidden = !(id === "todos" || card.getAttribute("data-cat") === id);
    });
    track.scrollLeft = 0;
    updateArrows();
  }

  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) setFiltro(b.getAttribute("data-filter"));
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
    if (card.hidden) setFiltro("todos");

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

  /* ---------- Destaque da vez ---------- */
  var destaque = bySlug[D.destaque] || produtos[0];
  var destaqueSec = $("#destaque");
  if (!destaque) {
    destaqueSec.hidden = true;
  } else {
    var dSrc = D.fotos.destaque || destaque.imagem;
    $("#destaque-photo").innerHTML = dSrc
      ? img(dSrc, D.fotos.destaque ? t(D.fotosAlt.destaque) : t(destaque.nome))
      : placeholder(S.fotoProduto, t(destaque.nome).charAt(0));
    $("#destaque-loja").textContent = lojaNome(destaque);
    $("#destaque-nome").textContent = t(destaque.nome) + (destaque.exemplo ? " (" + S.exemplo + ")" : "");
    $("#destaque-frase").textContent = t(destaque.frase);
    $("#destaque-actions").innerHTML = buyButton(destaque, S.destaqueCta, "btn-gold") +
      '<a class="link-line link-light" href="#produto/' + esc(destaque.slug) + '">' + esc(S.verNaVitrine) + "</a>";
  }

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
      var prod = p.produto && bySlug[p.produto];
      return '<li class="post"><div class="post-card">' +
        '<a class="post-photo" href="' + esc(link) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
        (p.capa ? img(p.capa, t(p.legenda), false, "(min-width: 900px) 28vw, 78vw") : placeholder(S.capaPost, "")) +
        (p.exemplo ? '<span class="badge">' + esc(S.exemplo) + "</span>" : "") + "</a>" +
        '<p class="post-caption">' + esc(t(p.legenda)) + "</p>" +
        '<a class="btn btn-gold post-btn" href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(S.verInstagram) +
        '<span class="sr-only">: ' + esc(t(p.legenda)) + " " + esc(S.abreNovaAba) + "</span></a>" +
        "</div>" +
        (prod ? '<a class="link-line post-find" href="#produto/' + esc(prod.slug) + '">' + esc(S.encontrarProduto) + "</a>" : "") +
        "</li>";
    }).join("");
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
