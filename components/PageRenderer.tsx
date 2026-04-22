import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/QuoteForm";
import { SiteChrome } from "@/components/SiteChrome";
import {
  FaqBlock,
  FinalCta,
  FleetCards,
  FleetTable,
  Hero,
  ProgramCards,
  ProofBlock,
  RouteCards,
  SectionHead,
  ServiceCards,
  TrustStrip
} from "@/components/SiteSections";
import { company, getRouteBySlug, images, isRouteSlug, pageHref, rootHref } from "@/lib/site-data";
import type { Language, PublicCmsData, SitePageKind } from "@/lib/types";

interface PageRendererProps {
  lang: Language;
  slug: string;
  data: PublicCmsData;
  rootCompat?: boolean;
}

export function PageRenderer({ lang, slug, data, rootCompat = false }: PageRendererProps) {
  const active = activeKind(slug);
  return (
    <SiteChrome lang={lang} data={data} slug={slug} rootCompat={rootCompat} active={active}>
      {renderPage({ lang, slug, data, rootCompat })}
    </SiteChrome>
  );
}

function renderPage({ lang, slug, data, rootCompat }: PageRendererProps) {
  const c = data.copy;
  if (slug === "index.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.homeTitle} text={c.homeLead} image={images.hero} />
        <TrustStrip data={data} />
        <section className="section tight">
          <div className="container">
            <SectionHead title={c.sections.routesTitle} text={c.sections.routesText} />
            <RouteCards lang={lang} rootCompat={rootCompat} routes={data.routes} cta={c.routeCta} />
          </div>
        </section>
        <section className="section feature-band">
          <div className="container">
            <SectionHead title={c.sections.airportTitle} text={c.sections.airportText} />
            <div className="feature-list">
              {c.trust.slice(2, 6).map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SectionHead title={c.sections.fleetTitle} text={c.sections.fleetText} />
            <FleetCards fleet={data.fleet} labels={{ capacity: c.capacity, luggage: c.luggage, amenities: c.amenities }} />
          </div>
        </section>
        <section className="section tight">
          <div className="container">
            <SectionHead title={c.sections.servicesTitle} text={c.sections.servicesText} />
            <ServiceCards lang={lang} rootCompat={rootCompat} services={data.services} cta={c.ctaQuote} />
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SectionHead title={c.sections.faqTitle} />
            <FaqBlock data={data} />
          </div>
        </section>
        <ProofBlock data={data} />
        <FinalCta lang={lang} rootCompat={rootCompat} data={data} />
      </>
    );
  }

  if (slug === "services.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.sections.servicesTitle} text={c.sections.servicesText} image={images.serviceAirport} />
        <TrustStrip data={data} />
        <section className="section">
          <div className="container">
            <ServiceCards lang={lang} rootCompat={rootCompat} services={data.services} cta={c.ctaQuote} />
          </div>
        </section>
        <FinalCta lang={lang} rootCompat={rootCompat} data={data} />
      </>
    );
  }

  if (slug === "fleet.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.sections.fleetTitle} text={c.sections.fleetText} image={images.vclass} />
        <TrustStrip data={data} />
        <section className="section">
          <div className="container">
            <FleetCards fleet={data.fleet} labels={{ capacity: c.capacity, luggage: c.luggage, amenities: c.amenities }} />
          </div>
        </section>
        <section className="section">
          <div className="container">
            <FleetTable data={data} />
          </div>
        </section>
        <FinalCta lang={lang} rootCompat={rootCompat} data={data} />
      </>
    );
  }

  if (slug === "programs.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.sections.programsTitle} text={c.sections.programsText} image={images.cesky} />
        <TrustStrip data={data} />
        <section className="section">
          <div className="container">
            <ProgramCards lang={lang} rootCompat={rootCompat} programs={data.programs} cta={c.routeCta} />
          </div>
        </section>
        <ProofBlock data={data} />
        <FinalCta lang={lang} rootCompat={rootCompat} data={data} />
      </>
    );
  }

  if (slug === "quote.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.quote.title} text={c.quote.lead} image={images.hero} />
        <QuoteForm lang={lang} data={data} rootCompat={rootCompat} />
      </>
    );
  }

  if (slug === "contact.html") {
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={c.contactTitle} text={c.contactLead} image={images.hero} />
        <section className="section">
          <div className="container contact-grid">
            <article className="contact-panel">
              <h2>{c.ctaWhatsApp}</h2>
              <p>
                {c.contactLead} {c.responseTime}
              </p>
              <div className="actions">
                <a className="btn whatsapp" href={`https://wa.me/${company.whatsappNumber}`}>
                  WhatsApp
                </a>
                <a
                  className="btn primary"
                  href={withParams(rootCompat ? rootHref("quote.html") : pageHref(lang, "quote.html"), { source: "contact_panel" })}
                >
                  {c.ctaQuote}
                </a>
              </div>
            </article>
            <article className="contact-panel">
              <dl>
                <div>
                  <dt>{company.company}</dt>
                  <dd>{company.address}</dd>
                </div>
                <div>
                  <dt>IČO / DIČ</dt>
                  <dd>
                    {company.ico} / {company.vat}
                  </dd>
                </div>
                <div>
                  <dt>Phone / WhatsApp</dt>
                  <dd>
                    <a href="tel:+420775091730">{company.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </dd>
                </div>
              </dl>
            </article>
          </div>
        </section>
        <section className="section tight">
          <div className="container map-card">
            <h2>{company.address}</h2>
            <p>{c.footerText}</p>
            <div className="actions">
              <a className="btn" href={company.mapUrl} target="_blank" rel="noreferrer">
                {c.mapOpen}
              </a>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug === "thankyou.html") {
    return (
      <section className="section">
        <div className="container">
          <article className="card">
            <div className="card-body" style={{ textAlign: "center", maxWidth: 860, margin: "auto" }}>
              <img src="/assets/optimized/logo-gold.webp" width={72} height={72} alt="" style={{ margin: "0 auto 18px" }} />
              <h1>{c.thankTitle}</h1>
              <p className="lead" style={{ marginInline: "auto" }}>
                {c.thankLead}
              </p>
              <div className="actions" style={{ justifyContent: "center" }}>
                <a className="btn primary" href={rootCompat ? rootHref("index.html") : pageHref(lang, "index.html")}>
                  {c.backHome}
                </a>
                <a className="btn" href={rootCompat ? rootHref("quote.html") : pageHref(lang, "quote.html")}>
                  {c.newQuote}
                </a>
                <a className="btn whatsapp" href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noreferrer">
                  {c.openWhatsApp}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (isRouteSlug(slug)) {
    const route = getRouteBySlug(lang, slug);
    if (!route) notFound();
    return (
      <>
        <Hero lang={lang} rootCompat={rootCompat} data={data} title={route.title} text={route.description} image={route.image} />
        <TrustStrip data={data} />
        <section className="section">
          <div className="container">
            <div className="grid">
              <article className="card span-7">
                <div className="card-body">
                  <h2>{route.label}</h2>
                  <p>{route.description}</p>
                  <div className="pill-list">
                    <span className="pill">{route.duration}</span>
                    <span className="pill">{c.sections.fleetText}</span>
                    <span className="pill">{c.trust[4][0]}</span>
                  </div>
                </div>
              </article>
              <article className="card span-5">
                <div className="card-body">
                  <h2>{c.sections.finalTitle}</h2>
                  <p>
                    {c.sections.finalText} {c.responseTime}
                  </p>
                  <div className="actions">
                    <a
                      className="btn primary"
                      href={withParams(rootCompat ? rootHref("quote.html") : pageHref(lang, "quote.html"), {
                        route: route.key,
                        source: "route_page"
                      })}
                    >
                      {c.routeCta}
                    </a>
                    <a className="btn whatsapp" href={`https://wa.me/${company.whatsappNumber}`}>
                      {c.ctaWhatsApp}
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SectionHead title={c.sections.fleetTitle} text={c.sections.fleetText} />
            <FleetCards fleet={data.fleet} labels={{ capacity: c.capacity, luggage: c.luggage, amenities: c.amenities }} />
          </div>
        </section>
        <FinalCta lang={lang} rootCompat={rootCompat} data={data} />
      </>
    );
  }

  notFound();
}

function activeKind(slug: string): SitePageKind {
  if (slug === "index.html") return "home";
  if (slug === "services.html") return "services";
  if (slug === "fleet.html") return "fleet";
  if (slug === "programs.html") return "programs";
  if (slug === "quote.html" || slug === "thankyou.html") return "quote";
  if (slug === "contact.html") return "contact";
  return "services";
}

function withParams(href: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const serialized = search.toString();
  return serialized ? `${href}?${serialized}` : href;
}
