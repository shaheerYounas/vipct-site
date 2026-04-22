import { company, images } from "@/lib/site-data";
import type { CardContent, FleetItem, Language, ProgramItem, PublicCmsData, RoutePageContent, ServiceItem } from "@/lib/types";
import { siteHref } from "@/components/SiteChrome";

export function Hero({
  lang,
  rootCompat,
  data,
  title,
  text,
  image = images.hero
}: {
  lang: Language;
  rootCompat?: boolean;
  data: PublicCmsData;
  title: string;
  text: string;
  image?: string;
}) {
  const { copy } = data;
  return (
    <section className="hero">
      <picture className="hero-media">
        <img src={image} width={1600} height={1000} loading="eager" decoding="async" alt="" />
      </picture>
      <div className="container hero-content">
        <span className="eyebrow">{copy.heroEyebrow}</span>
        <h1>{title}</h1>
        <p className="lead">{text}</p>
        <div className="actions">
          <a className="btn primary" href={siteHref(lang, "quote.html", rootCompat, { source: "hero" })}>
            {copy.ctaQuote}
          </a>
          <a className="btn whatsapp" data-wa data-wa-location="hero" href={`https://wa.me/${company.whatsappNumber}`}>
            {copy.ctaWhatsApp}
          </a>
        </div>
        <p className="help" style={{ marginTop: 12 }}>
          {copy.responseTime}
        </p>
      </div>
    </section>
  );
}

export function TrustStrip({ data }: { data: PublicCmsData }) {
  return (
    <section className="container trust-strip" aria-label="Trust signals">
      {data.copy.trust.map(([title, text]) => (
        <div className="trust-item" key={title}>
          <strong>{title}</strong>
          <span>{text}</span>
        </div>
      ))}
    </section>
  );
}

export function SectionHead({ title, text }: { title: string; text?: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function RouteCards({ lang, rootCompat, routes, cta }: { lang: Language; rootCompat?: boolean; routes: RoutePageContent[]; cta: string }) {
  return (
    <div className="route-grid">
      {routes.map((route) => (
        <a
          className="route-card"
          data-track="route_quote"
          data-track-key={route.key}
          href={siteHref(lang, "quote.html", rootCompat, { route: route.key, source: "route_card" })}
          key={route.key}
        >
          <span>{route.label}</span>
          <strong>{route.title}</strong>
          <span>
            {route.duration} · {cta}
          </span>
        </a>
      ))}
    </div>
  );
}

export function ServiceCards({ lang, rootCompat, services, cta }: { lang: Language; rootCompat?: boolean; services: ServiceItem[]; cta: string }) {
  return (
    <div className="grid">
      {services.map((service) => (
        <article className="card span-4" key={service.key}>
          <CardImage item={service} />
          <div className="card-body">
            <h2>{service.title}</h2>
            <p>{service.text}</p>
            <div className="actions">
              <a className="btn" href={siteHref(lang, service.detailsHref, rootCompat)}>
                Learn more
              </a>
              <a className="btn primary" href={siteHref(lang, "quote.html", rootCompat, { ...service.quoteParams, source: "service_card" })}>
                {cta}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function FleetCards({ fleet, labels }: { fleet: FleetItem[]; labels: { capacity: string; luggage: string; amenities: string } }) {
  return (
    <div className="grid">
      {fleet.map((item) => (
        <article className="card span-3" key={item.key}>
          <CardImage item={item} />
          <div className="card-body">
            <h2>{item.title}</h2>
            <p>{item.bestFor}</p>
            <div className="pill-list">
              <span className="pill">
                {labels.capacity}: {item.capacity}
              </span>
              <span className="pill">
                {labels.luggage}: {item.luggage}
              </span>
              <span className="pill">{item.amenities}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProgramCards({ lang, rootCompat, programs, cta }: { lang: Language; rootCompat?: boolean; programs: ProgramItem[]; cta: string }) {
  return (
    <div className="grid">
      {programs.map((program) => (
        <article className="card span-4" key={program.key}>
          <CardImage item={program} />
          <div className="card-body">
            <h2>{program.title}</h2>
            <p>{program.text}</p>
            <div className="pill-list">
              <span className="pill">{program.duration}</span>
              <span className="pill">{program.season}</span>
              <span className="pill">{program.vehicle}</span>
            </div>
            <div className="actions">
              <a className="btn primary" href={siteHref(lang, "quote.html", rootCompat, { program: program.key, service: "program", source: "program_card" })}>
                {cta}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProofBlock({ data }: { data: PublicCmsData }) {
  const { sections, responseTime } = data.copy;
  return (
    <section className="section">
      <div className="container proof-grid">
        <article className="proof-panel">
          <strong>{sections.proofTitle}</strong>
          <blockquote>{sections.proofQuote}</blockquote>
        </article>
        <article className="proof-panel">
          <h2>{sections.proofTitle}</h2>
          <p>{sections.proofText}</p>
          <p>
            <strong style={{ textTransform: "none", letterSpacing: 0 }}>{responseTime}</strong>
          </p>
        </article>
      </div>
    </section>
  );
}

export function FinalCta({ lang, rootCompat, data }: { lang: Language; rootCompat?: boolean; data: PublicCmsData }) {
  const { copy } = data;
  return (
    <section className="section feature-band">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>{copy.sections.finalTitle}</h2>
            <p>
              {copy.sections.finalText} {copy.responseTime}
            </p>
          </div>
          <div className="actions">
            <a className="btn primary" href={siteHref(lang, "quote.html", rootCompat, { source: "final_cta" })}>
              {copy.ctaQuote}
            </a>
            <a className="btn whatsapp" href={`https://wa.me/${company.whatsappNumber}`}>
              {copy.ctaWhatsApp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqBlock({ data }: { data: PublicCmsData }) {
  return (
    <div className="faq">
      {data.faqs.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FleetTable({ data }: { data: PublicCmsData }) {
  const c = data.copy;
  return (
    <table className="comparison">
      <thead>
        <tr>
          <th>{c.fleetBest}</th>
          <th>{c.capacity}</th>
          <th>{c.luggage}</th>
          <th>{c.amenities}</th>
        </tr>
      </thead>
      <tbody>
        {data.fleet.map((item) => (
          <tr key={item.key}>
            <th>{item.title}</th>
            <td>{item.capacity}</td>
            <td>{item.luggage}</td>
            <td>
              {item.amenities}
              <br />
              {item.bestFor}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CardImage({ item }: { item: CardContent }) {
  return (
    <div className="media">
      <img src={item.image} width={900} height={560} loading="lazy" decoding="async" alt={item.title} />
    </div>
  );
}
