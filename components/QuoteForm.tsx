"use client";

import { useMemo, useState } from "react";
import { company } from "@/lib/site-data";
import type { Language, PublicCmsData } from "@/lib/types";

interface QuoteFormProps {
  lang: Language;
  data: PublicCmsData;
  rootCompat?: boolean;
}

const routePresets: Record<string, { pickup: Record<Language, string>; dropoff: Record<Language, string> }> = {
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
  vienna: { pickup: { en: "Prague", cs: "Praha", ar: "براغ" }, dropoff: { en: "Vienna", cs: "Viden", ar: "فيينا" } },
  dresden: { pickup: { en: "Prague", cs: "Praha", ar: "براغ" }, dropoff: { en: "Dresden", cs: "Drazdany", ar: "دريسدن" } },
  cesky: { pickup: { en: "Prague", cs: "Praha", ar: "براغ" }, dropoff: { en: "Cesky Krumlov", cs: "Cesky Krumlov", ar: "تشيسكي كروملوف" } }
};

export function QuoteForm({ lang, data, rootCompat = false }: QuoteFormProps) {
  const q = data.copy.quote;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [summary, setSummary] = useState<Record<string, string>>({});

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function updateSummary(form: HTMLFormElement) {
    const formData = new FormData(form);
    setSummary({
      pickup: String(formData.get("pickup") || "-"),
      dropoff: String(formData.get("dropoff") || "-"),
      pickup_date: String(formData.get("pickup_date") || "-"),
      pickup_time: String(formData.get("pickup_time") || "-"),
      vehicle: String(formData.get("vehicle") || "-"),
      name: String(formData.get("name") || "-")
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = Object.fromEntries(formData.entries());
    Object.assign(payload, {
      language: lang,
      page: window.location.pathname,
      url: window.location.href,
      route: params.get("route") || "",
      service: params.get("service") || "",
      program: params.get("program") || "",
      source_page: params.get("source") || document.referrer || window.location.pathname,
      utm: ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
        .map((key) => (params.get(key) ? `${key}=${params.get(key)}` : ""))
        .filter(Boolean)
        .join(" | ")
    });

    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(body.error || "The request could not be sent. Please contact us on WhatsApp.");
      return;
    }

    sessionStorage.setItem("vipct_booking", JSON.stringify(payload));
    setStatus("sent");
    window.location.href = rootCompat ? "/thankyou.html" : `/${lang}/thankyou.html`;
  }

  function prefillRoute(routeKey: string) {
    const preset = routePresets[routeKey];
    if (!preset) return;
    const pickup = document.getElementById("pickup") as HTMLInputElement | null;
    const dropoff = document.getElementById("dropoff") as HTMLInputElement | null;
    if (pickup) pickup.value = preset.pickup[lang];
    if (dropoff) dropoff.value = preset.dropoff[lang];
    const url = new URL(window.location.href);
    url.searchParams.set("route", routeKey);
    url.searchParams.set("source", "quote_preset");
    window.history.replaceState({}, "", url);
    const form = document.querySelector("[data-quote-form]") as HTMLFormElement | null;
    if (form) updateSummary(form);
  }

  return (
    <>
      <section className="section tight">
        <div className="container">
          <div className="section-head">
            <h2>{q.presetsTitle}</h2>
            <p>{q.presetsText}</p>
          </div>
          <div className="route-grid">
            {data.routes.map((route) => (
              <button className="route-card" type="button" key={route.key} onClick={() => prefillRoute(route.key)}>
                <span>{route.label}</span>
                <strong>{route.title}</strong>
                <span>{route.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container form-shell">
          <form
            className="form"
            data-quote-form
            onSubmit={submit}
            onInput={(event) => updateSummary(event.currentTarget)}
            onChange={(event) => updateSummary(event.currentTarget)}
          >
            <input className="visually-hidden" name="honeypot" tabIndex={-1} autoComplete="off" />
            <section className="form-section">
              <h2>{q.trip}</h2>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="trip_type">{q.type}</label>
                  <select id="trip_type" name="trip_type" value={tripType} onChange={(event) => setTripType(event.target.value)} required>
                    <option value="oneway">{q.oneWay}</option>
                    <option value="roundtrip">{q.roundTrip}</option>
                  </select>
                </div>
                <Input id="pickup_date" label={q.pickupDate} type="date" required min={today} />
                <Input id="pickup_time" label={q.pickupTime} type="time" required />
                <Input id="pickup" label={q.pickup} required placeholder="Airport / hotel / address" />
                <Input id="dropoff" label={q.dropoff} required placeholder="City / address" />
                {tripType === "roundtrip" ? (
                  <div className="field full">
                    <div className="field-grid">
                      <Input id="return_date" label={q.returnDate} type="date" required min={today} />
                      <Input id="return_time" label={q.returnTime} type="time" required />
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
            <section className="form-section">
              <h2>{data.copy.sections.fleetTitle}</h2>
              <div className="field-grid">
                <Input id="passengers" label={q.passengers} type="number" min="1" max="60" required />
                <Input id="luggage" label={q.luggage} placeholder="4 suitcases + 2 backpacks" />
                <div className="field full">
                  <label htmlFor="vehicle">{q.vehicle}</label>
                  <select id="vehicle" name="vehicle" required defaultValue="Sedan">
                    <option value="Sedan">Sedan</option>
                    <option value="Mercedes V-Class">Mercedes V-Class</option>
                    <option value="Luxury Minibus">Luxury Minibus</option>
                    <option value="Executive Coach">Executive Coach</option>
                  </select>
                </div>
              </div>
            </section>
            <section className="form-section">
              <h2>{data.copy.trust[2][0]}</h2>
              <div className="field-grid">
                <Input id="flight_number" label={q.flightNumber} placeholder="OK 123 / FR 3524" />
                <Input id="child_seats" label={q.childSeats} type="number" min="0" max="6" />
              </div>
            </section>
            <section className="form-section">
              <h2>{q.contact}</h2>
              <div className="field-grid">
                <Input id="name" label={q.name} required placeholder="Full name" />
                <Input id="phone" label={q.phone} type="tel" required placeholder={company.phone} />
                <Input id="email" label={q.email} type="email" required placeholder={company.email} />
              </div>
            </section>
            <section className="form-section">
              <h2>{q.notes}</h2>
              <div className="field">
                <label htmlFor="notes">{q.notesLabel}</label>
                <textarea id="notes" name="notes" placeholder="Flight number, child seats, stops, waiting time..." />
              </div>
              <div className="actions" style={{ marginTop: 16 }}>
                <button className="btn primary" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : q.send}
                </button>
                <a className="btn whatsapp" href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noreferrer">
                  {q.whatsapp}
                </a>
              </div>
              {message ? <p className={status === "error" ? "form-error" : "help"}>{message}</p> : null}
            </section>
          </form>
          <aside className="quote-aside">
            <h2>{data.copy.sections.finalTitle}</h2>
            <p>{q.response}</p>
            <div className="summary-list">
              {data.copy.trust.slice(0, 5).map(([label, value]) => (
                <div className="summary-row" key={label}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="live-quote">
              <h2>{q.liveTitle}</h2>
              <div className="summary-list">
                <SummaryRow label={q.liveRoute} value={`${summary.pickup || "-"} -> ${summary.dropoff || "-"}`} />
                <SummaryRow label={q.liveTiming} value={`${summary.pickup_date || "-"} ${summary.pickup_time || "-"}`} />
                <SummaryRow label={q.liveVehicle} value={summary.vehicle || "-"} />
                <SummaryRow label={q.liveContact} value={summary.name || "-"} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Input({ id, label, type = "text", required = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={type} required={required} {...props} />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
