import type React from "react";
import { company, languages, navPages, pageHref, rootHref } from "@/lib/site-data";
import type { Language, PublicCmsData, SitePageKind } from "@/lib/types";

interface ChromeProps {
  lang: Language;
  data: PublicCmsData;
  slug: string;
  rootCompat?: boolean;
  active: SitePageKind;
  children: React.ReactNode;
}

export function SiteChrome({ lang, data, slug, rootCompat = false, active, children }: ChromeProps) {
  const { copy } = data;
  return (
    <div className={lang === "ar" ? "rtl" : ""} dir={languages[lang].dir} data-page={active}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href={siteHref(lang, "index.html", rootCompat)}>
            <span className="brand-mark">
              <img src="/assets/optimized/logo-gold.webp" width={46} height={46} alt="" />
            </span>
            <span>
              <span className="brand-name">{company.company}</span>
              <span className="brand-meta">{copy.brandMeta}</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            {navPages.map(([key, href], index) => (
              <a key={key} href={siteHref(lang, href, rootCompat)} className={active === key ? "active" : undefined}>
                {copy.nav[index]}
              </a>
            ))}
          </nav>
          <nav className="language-links" aria-label="Language">
            {(Object.keys(languages) as Language[]).map((targetLang) => (
              <a
                key={targetLang}
                className={targetLang === lang ? "active" : undefined}
                href={pageHref(targetLang, slug)}
                hrefLang={targetLang}
              >
                {languages[targetLang].label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <div className="whatsapp-float">
        <a data-wa data-wa-location="float" href={`https://wa.me/${company.whatsappNumber}`}>
          WhatsApp - {company.phone}
        </a>
      </div>
      <div className="mobile-cta">
        <a className="btn whatsapp" data-wa data-wa-location="mobile_bar" href={`https://wa.me/${company.whatsappNumber}`}>
          WhatsApp
        </a>
        <a className="btn primary" href={siteHref(lang, "quote.html", rootCompat, { source: "mobile_bar" })}>
          {copy.ctaQuote}
        </a>
      </div>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <strong>{company.company}</strong>
            <p>{copy.footerText}</p>
          </div>
          <div>
            <strong>{company.address}</strong>
            <p>
              IČO {company.ico}
              <br />
              DIČ {company.vat}
            </p>
          </div>
          <div>
            <strong>{company.phone}</strong>
            <p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function siteHref(
  lang: Language,
  slug: string,
  rootCompat = false,
  params: Record<string, string | undefined> = {}
): string {
  const base = rootCompat ? rootHref(slug) : pageHref(lang, slug);
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const serialized = search.toString();
  return serialized ? `${base}?${serialized}` : base;
}
