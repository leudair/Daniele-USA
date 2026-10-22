/* Páginas de produto: medição de cliques e memória do idioma escolhido. */
(function () {
  "use strict";
  var D = window.DANA || {};
  var lang = document.documentElement.getAttribute("data-lang") || "pt";

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

  document.addEventListener("click", function (e) {
    var l = e.target.closest("[data-lang-link]");
    if (l) { try { localStorage.setItem("dana-lang", l.getAttribute("data-lang-link")); } catch (err) {} }
    var a = e.target.closest("a[data-track]");
    if (!a) return;
    var data = { produto: a.getAttribute("data-produto") || "", loja: a.getAttribute("data-loja") || "", idioma: lang };
    try { if (window.va) window.va("event", { name: a.getAttribute("data-track"), data: data }); } catch (err) {}
    try { if (window.gtag) window.gtag("event", a.getAttribute("data-track"), data); } catch (err) {}
  });
})();
