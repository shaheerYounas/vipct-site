(function () {
  const WA_NUMBER = "420775091730";
  const box = document.getElementById("summaryBox");
  const rows = document.querySelectorAll("[data-summary]");
  const wa = document.getElementById("waFallback");
  if (!box || !wa) return;

  let booking = null;
  try {
    booking = JSON.parse(sessionStorage.getItem("vipct_booking") || "null");
  } catch (error) {
    booking = null;
  }

  if (booking) {
    box.hidden = false;
    rows.forEach((row) => {
      const key = row.dataset.summary;
      row.textContent = booking[key] || "-";
    });
  }

  wa.addEventListener("click", () => {
    const message = sessionStorage.getItem("vipct_wa_message") || "";
    const url = message
      ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${WA_NUMBER}`;
    window.open(url, "_blank");
  });
})();
