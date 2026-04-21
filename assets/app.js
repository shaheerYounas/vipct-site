(function () {
  const WA_NUMBER = "420775091730";

  function setWhatsAppLinks() {
    document.querySelectorAll("[data-wa]").forEach((link) => {
      const text = link.getAttribute("data-wa-text");
      const url = text
        ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
        : `https://wa.me/${WA_NUMBER}`;
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });
  }

  function setActiveNav() {
    const current = (document.body.dataset.page || "home").toLowerCase();
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === current);
    });
  }

  function rememberLanguage() {
    const lang = document.documentElement.lang || "en";
    try {
      localStorage.setItem("vipct_lang", lang);
    } catch (error) {
      // Storage can be blocked in private modes; direct language links still work.
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setWhatsAppLinks();
    setActiveNav();
    rememberLanguage();
  });
})();
