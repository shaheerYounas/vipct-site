(function () {
  const WA_NUMBER = "420775091730";
  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  const text = window.VIPCT_TEXT || {};
  const lang = document.documentElement.lang || "en";
  const thankYouUrl = form.dataset.thankyou || "thankyou.html";
  const whatsappBtn = document.getElementById("whatsappBtn");
  const overlay = document.getElementById("waModalOverlay");
  const preview = document.getElementById("waPreview");
  const closeButtons = document.querySelectorAll("[data-wa-close]");
  const sendButton = document.getElementById("waSend");
  const returnFields = document.getElementById("returnFields");
  const tripType = document.getElementById("trip_type");
  const pickupDate = document.getElementById("pickup_date");
  const returnDate = document.getElementById("return_date");
  const vehicle = document.getElementById("vehicle");
  const passengers = document.getElementById("passengers");

  const fields = [
    "trip_type", "pickup_date", "pickup_time", "return_date", "return_time",
    "pickup", "dropoff", "passengers", "luggage", "vehicle",
    "name", "phone", "email", "notes"
  ];

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function get(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function label(value, fallback) {
    return value || fallback || "-";
  }

  function setReturnState() {
    const isRoundTrip = tripType.value === "roundtrip";
    returnFields.hidden = !isRoundTrip;
    ["return_date", "return_time"].forEach((id) => {
      const el = document.getElementById(id);
      el.disabled = !isRoundTrip;
      el.required = isRoundTrip;
    });
  }

  function syncReturnMin() {
    if (pickupDate.value) {
      returnDate.min = pickupDate.value;
      if (returnDate.value && returnDate.value < pickupDate.value) returnDate.value = "";
    }
  }

  function recommendVehicle() {
    const count = Number(passengers.value || 0);
    if (!count || vehicle.dataset.touched === "true") return;
    if (count <= 3) vehicle.value = "Sedan";
    else if (count <= 7) vehicle.value = "Mercedes V-Class";
    else if (count <= 20) vehicle.value = "Luxury Minibus";
    else vehicle.value = "Executive Coach";
  }

  function requiredComplete() {
    const required = ["trip_type", "pickup_date", "pickup_time", "pickup", "dropoff", "passengers", "name", "phone", "email"];
    if (tripType.value === "roundtrip") required.push("return_date", "return_time");
    return required.every((id) => get(id));
  }

  function utmLine() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const parts = keys.filter((key) => params.get(key)).map((key) => `${key}=${params.get(key)}`);
    return parts.length ? parts.join(" | ") : "-";
  }

  function collectBooking() {
    const booking = {};
    fields.forEach((id) => { booking[id] = get(id); });
    booking.language = lang;
    booking.page = window.location.pathname;
    booking.utm = utmLine();
    booking.trip_label = tripType.options[tripType.selectedIndex]?.textContent || booking.trip_type;
    return booking;
  }

  function buildMessage(booking) {
    const lines = [
      "VIP Coach Transfers Booking Request",
      "",
      `Language: ${booking.language}`,
      `Source page: ${booking.page}`,
      `UTM: ${booking.utm}`,
      "",
      `Trip type: ${label(booking.trip_label)}`,
      `Pickup date: ${label(booking.pickup_date)}`,
      `Pickup time: ${label(booking.pickup_time)}`,
      `Pickup: ${label(booking.pickup)}`,
      `Drop-off: ${label(booking.dropoff)}`,
      `Return date: ${booking.trip_type === "roundtrip" ? label(booking.return_date) : "-"}`,
      `Return time: ${booking.trip_type === "roundtrip" ? label(booking.return_time) : "-"}`,
      "",
      `Passengers: ${label(booking.passengers)}`,
      `Luggage: ${label(booking.luggage)}`,
      `Vehicle: ${label(booking.vehicle)}`,
      "",
      `Name: ${label(booking.name)}`,
      `Phone: ${label(booking.phone)}`,
      `Email: ${label(booking.email)}`,
      `Notes: ${label(booking.notes)}`
    ];
    return lines.join("\n");
  }

  function updateButton() {
    whatsappBtn.disabled = !requiredComplete();
  }

  function openModal(message) {
    preview.textContent = message;
    overlay.classList.add("active");
    sendButton.disabled = false;
  }

  function closeModal() {
    overlay.classList.remove("active");
  }

  form.addEventListener("input", () => {
    recommendVehicle();
    updateButton();
  });
  form.addEventListener("change", (event) => {
    if (event.target === vehicle) vehicle.dataset.touched = "true";
    setReturnState();
    syncReturnMin();
    recommendVehicle();
    updateButton();
  });

  whatsappBtn.addEventListener("click", () => {
    if (!requiredComplete()) return;
    const booking = collectBooking();
    const message = buildMessage(booking);
    sessionStorage.setItem("vipct_booking", JSON.stringify(booking));
    sessionStorage.setItem("vipct_wa_message", message);
    openModal(message);
  });

  sendButton.addEventListener("click", () => {
    const message = sessionStorage.getItem("vipct_wa_message") || "";
    sendButton.disabled = true;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    window.setTimeout(() => {
      window.location.href = thankYouUrl;
    }, 600);
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  pickupDate.min = today();
  returnDate.min = today();
  setReturnState();
  syncReturnMin();
  updateButton();

  if (text.ready) {
    form.setAttribute("aria-label", text.ready);
  }
})();
