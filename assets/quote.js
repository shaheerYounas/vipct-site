(function () {
  const WA_NUMBER = "420775091730";
  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  const text = window.VIPCT_TEXT || {};
  const publicConfig = window.VIPCT_CONFIG || {};
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
  const liveSummary = document.querySelectorAll("[data-live-summary]");
  let fallbackSubmission = false;
  let submitInFlight = false;

  const fields = [
    "trip_type", "pickup_date", "pickup_time", "return_date", "return_time",
    "pickup", "dropoff", "passengers", "luggage", "vehicle",
    "flight_number", "child_seats", "name", "phone", "email", "notes"
  ];

  const routePresets = {
    airport: {
      pickup: { en: "Prague Airport (PRG)", cs: "Letiste Praha (PRG)", ar: "مطار براغ (PRG)" },
      dropoff: { en: "Prague city center / hotel", cs: "Centrum Prahy / hotel", ar: "وسط براغ / الفندق" }
    },
    chauffeur: {
      pickup: { en: "Prague", cs: "Praha", ar: "براغ" },
      dropoff: { en: "Hourly or full-day chauffeur service", cs: "Hodinova nebo celodenni sluzba ridice", ar: "خدمة سائق بالساعة أو ليوم كامل" }
    },
    europe: {
      pickup: { en: "Prague", cs: "Praha", ar: "براغ" },
      dropoff: { en: "Europe transfer destination", cs: "Cil transferu v Evrope", ar: "وجهة النقل داخل أوروبا" }
    },
    vienna: {
      pickup: { en: "Prague", cs: "Praha", ar: "براغ" },
      dropoff: { en: "Vienna", cs: "Viden", ar: "فيينا" }
    },
    dresden: {
      pickup: { en: "Prague", cs: "Praha", ar: "براغ" },
      dropoff: { en: "Dresden", cs: "Drazdany", ar: "دريسدن" }
    },
    cesky: {
      pickup: { en: "Prague", cs: "Praha", ar: "براغ" },
      dropoff: { en: "Cesky Krumlov", cs: "Cesky Krumlov", ar: "تشيسكي كروملوف" }
    }
  };

  const programPresets = {
    cesky: "Cesky Krumlov",
    karlovy: "Karlovy Vary",
    dresden: "Dresden",
    spindl: "Spindleruv Mlyn",
    dolni: "Dolni Morava",
    adventure: "Adventure Prague"
  };

  function track(eventName, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...detail });
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props: detail });
    }
  }

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

  function requiredComplete(channel) {
    const required = ["trip_type", "pickup_date", "pickup_time", "pickup", "dropoff", "passengers", "name", "phone"];
    if (channel !== "whatsapp") required.push("email");
    if (tripType.value === "roundtrip") required.push("return_date", "return_time");
    return required.every((id) => get(id));
  }

  function utmLine() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const parts = keys.filter((key) => params.get(key)).map((key) => `${key}=${params.get(key)}`);
    return parts.length ? parts.join(" | ") : "-";
  }

  function selectedParam(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function setHidden(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value || "";
  }

  function localText(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || "";
  }

  function setIfEmpty(id, value) {
    const el = document.getElementById(id);
    if (el && value && !el.value) el.value = value;
  }

  function applyPrefill() {
    const params = new URLSearchParams(window.location.search);
    const route = params.get("route");
    const program = params.get("program");

    if (route && routePresets[route]) {
      setIfEmpty("pickup", localText(routePresets[route].pickup));
      setIfEmpty("dropoff", localText(routePresets[route].dropoff));
    }

    if (program && programPresets[program]) {
      setIfEmpty("pickup", lang === "ar" ? "براغ" : lang === "cs" ? "Praha" : "Prague");
      setIfEmpty("dropoff", programPresets[program]);
      setIfEmpty("notes", `Program request: ${programPresets[program]}`);
    }

    ["pickup", "dropoff", "pickup_date", "pickup_time", "return_date", "return_time", "passengers", "luggage", "vehicle", "flight_number", "child_seats", "notes"].forEach((id) => {
      setIfEmpty(id, params.get(id));
    });

    if (params.get("trip_type") === "roundtrip") tripType.value = "roundtrip";
    if (params.get("vehicle")) {
      vehicle.dataset.touched = "true";
      vehicle.value = params.get("vehicle");
    }
    if (params.toString()) {
      track("quote_prefill", {
        route: route || "-",
        service: params.get("service") || "-",
        program: program || "-",
        vehicle: params.get("vehicle") || "-"
      });
    }
  }

  function collectBooking() {
    const booking = {};
    fields.forEach((id) => { booking[id] = get(id); });
    booking.language = lang;
    booking.page = window.location.pathname;
    booking.url = window.location.href;
    booking.utm = utmLine();
    booking.route = selectedParam("route");
    booking.service = selectedParam("service");
    booking.program = selectedParam("program");
    booking.source_page = selectedParam("source") || document.referrer || window.location.pathname;
    booking.trip_label = tripType.options[tripType.selectedIndex]?.textContent || booking.trip_type;
    return booking;
  }

  function syncHiddenFields(booking) {
    setHidden("lead_language", booking.language);
    setHidden("lead_page", booking.page);
    setHidden("lead_url", booking.url);
    setHidden("lead_source_page", booking.source_page);
    setHidden("lead_utm", booking.utm);
    setHidden("lead_route", booking.route);
    setHidden("lead_service", booking.service);
    setHidden("lead_program", booking.program);
    setHidden("lead_payload", JSON.stringify(booking));
  }

  function bookingRpcConfig() {
    const supabase = publicConfig.supabase;
    if (!supabase || !supabase.url || !supabase.anonKey) return null;
    return {
      url: String(supabase.url).replace(/\/+$/, ""),
      anonKey: supabase.anonKey,
      bookingRpc: supabase.bookingRpc || "submit_booking_request"
    };
  }

  async function submitViaSupabase(booking) {
    const supabase = bookingRpcConfig();
    if (!supabase) return null;

    const response = await fetch(`${supabase.url}/rest/v1/rpc/${supabase.bookingRpc}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabase.anonKey,
        Authorization: `Bearer ${supabase.anonKey}`
      },
      body: JSON.stringify({ payload: booking })
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      const detail = typeof body === "string"
        ? body
        : body?.message || body?.error || `Supabase RPC ${supabase.bookingRpc} failed with ${response.status}`;
      throw new Error(detail);
    }

    return body;
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
      `Route key: ${label(booking.route)}`,
      `Service key: ${label(booking.service)}`,
      `Program key: ${label(booking.program)}`,
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
      `Flight number: ${label(booking.flight_number)}`,
      `Child seats: ${label(booking.child_seats)}`,
      "",
      `Name: ${label(booking.name)}`,
      `Phone: ${label(booking.phone)}`,
      `Email: ${label(booking.email)}`,
      `Notes: ${label(booking.notes)}`
    ];
    return lines.join("\n");
  }

  function updateButton() {
    whatsappBtn.disabled = !requiredComplete("whatsapp");
  }

  function updateLiveSummary() {
    const booking = collectBooking();
    syncHiddenFields(booking);
    liveSummary.forEach((node) => {
      const key = node.dataset.liveSummary;
      node.textContent = booking[key] || "-";
    });
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
    updateLiveSummary();
  });
  form.addEventListener("change", (event) => {
    if (event.target === vehicle) vehicle.dataset.touched = "true";
    setReturnState();
    syncReturnMin();
    recommendVehicle();
    updateButton();
    updateLiveSummary();
  });

  whatsappBtn.addEventListener("click", () => {
    if (!requiredComplete("whatsapp")) return;
    const booking = collectBooking();
    syncHiddenFields(booking);
    const message = buildMessage(booking);
    sessionStorage.setItem("vipct_booking", JSON.stringify(booking));
    sessionStorage.setItem("vipct_wa_message", message);
    track("quote_submit", { channel: "whatsapp_preview", route: booking.route || "-", service: booking.service || "-", program: booking.program || "-" });
    openModal(message);
  });

  sendButton.addEventListener("click", () => {
    const message = sessionStorage.getItem("vipct_wa_message") || "";
    sendButton.disabled = true;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    track("whatsapp_send", { page: window.location.pathname });
    window.setTimeout(() => {
      window.location.href = thankYouUrl;
    }, 600);
  });

  form.addEventListener("submit", async (event) => {
    if (fallbackSubmission) return;

    const booking = collectBooking();
    syncHiddenFields(booking);
    sessionStorage.setItem("vipct_booking", JSON.stringify(booking));
    sessionStorage.removeItem("vipct_booking_receipt");

    if (get("company_website")) {
      event.preventDefault();
      window.location.href = thankYouUrl;
      return;
    }

    const supabase = bookingRpcConfig();
    if (!supabase) {
      track("quote_submit", { channel: "email", route: booking.route || "-", service: booking.service || "-", program: booking.program || "-" });
      return;
    }

    if (submitInFlight) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    submitInFlight = true;

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const receipt = await submitViaSupabase(booking);
      sessionStorage.setItem("vipct_booking_receipt", JSON.stringify(receipt || {}));
      track("quote_submit", { channel: "supabase", route: booking.route || "-", service: booking.service || "-", program: booking.program || "-" });
      window.location.href = thankYouUrl;
    } catch (error) {
      console.warn("Supabase booking submission failed, falling back to the email form.", error);
      track("quote_submit", { channel: "email_fallback", route: booking.route || "-", service: booking.service || "-", program: booking.program || "-" });
      fallbackSubmission = true;
      submitInFlight = false;
      if (submitButton) submitButton.disabled = false;
      form.submit();
    }
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  pickupDate.min = today();
  returnDate.min = today();
  applyPrefill();
  setReturnState();
  syncReturnMin();
  recommendVehicle();
  updateButton();
  updateLiveSummary();

  if (text.ready) {
    form.setAttribute("aria-label", text.ready);
  }
})();
