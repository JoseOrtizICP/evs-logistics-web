// GitHub Pages SPA fallback (parte 2).
// Reconstruye la URL limpia (/jose-ortiz) a partir del /?/jose-ortiz
// que dejó 404.html, antes de que arranque React Router.
// Va en un archivo externo (no inline) para cumplir el CSP del sitio.
(function (l) {
  if (l.search[1] === '/') {
    var decoded = l.search
      .slice(1)
      .split('&')
      .map(function (s) { return s.replace(/~and~/g, '&') })
      .join('?')
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
  }
})(window.location)
