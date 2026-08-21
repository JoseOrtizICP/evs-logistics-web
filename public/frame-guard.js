// Anti-clickjacking: si el sitio se carga dentro de un iframe de otro origen,
// lo saca del marco. GitHub Pages no permite enviar X-Frame-Options, así que
// esta protección va del lado del cliente.
(function () {
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location.href
    } catch (e) {
      document.documentElement.style.display = 'none'
    }
  }
})();
