(function () {
  const WA_NUMBER = "420775091730";

  function track(eventName, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...detail });
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props: detail });
    }
  }

  function setWhatsAppLinks() {
    document.querySelectorAll("[data-wa]").forEach((link) => {
      const text = link.getAttribute("data-wa-text");
      const url = text
        ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
        : `https://wa.me/${WA_NUMBER}`;
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
      link.addEventListener("click", () => {
        track("whatsapp_click", {
          page: document.body.dataset.page || "unknown",
          location: link.dataset.waLocation || "global",
          href: window.location.pathname
        });
      });
    });
  }

  function setActiveNav() {
    const current = (document.body.dataset.page || "home").toLowerCase();
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === current);
    });
  }

  function setTrackedLinks() {
    document.querySelectorAll("[data-track]").forEach((link) => {
      link.addEventListener("click", () => {
        track(link.dataset.track, {
          key: link.dataset.trackKey || "",
          page: document.body.dataset.page || "unknown",
          href: link.getAttribute("href") || ""
        });
      });
    });
  }

  function rememberLanguage() {
    const lang = document.documentElement.lang || "en";
    try {
      localStorage.setItem("vipct_lang", lang);
    } catch (error) {
      // Storage can be blocked in private modes; direct language links still work.
    }
    track("language_view", { language: lang, page: document.body.dataset.page || "unknown" });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setWhatsAppLinks();
    setActiveNav();
    setTrackedLinks();
    rememberLanguage();
  });
})();
