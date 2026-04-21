# SEO Audit

The site has a useful domain, service focus, and multilingual ambition, but the current implementation underuses SEO fundamentals. The biggest opportunities are service-specific landing pages, route pages, structured metadata, image fixes, and stronger local business signals.

## SEO Issues

| Issue | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Most pages lack meta descriptions | `services.html:6`, `fleet.html:6`, `programs.html:3`, `quote.html:6`, `contact.html:6`, `thankyou.html:6` | Search results need page-specific snippets. Missing descriptions reduce CTR and topical clarity. | High | Add unique `<meta name="description">` to each public page. Keep thank-you `noindex`. | Better SERP appearance and relevance. |
| No canonical URLs | All HTML pages | Search engines may treat duplicate URL variants as separate pages, especially with `index.html` paths. | Medium | Add canonical tags, for example `<link rel="canonical" href="https://vipct.org/services.html">`. | Cleaner indexing and reduced duplication. |
| No Open Graph or Twitter metadata | All HTML pages | Shared links on WhatsApp, Facebook, and social apps may look generic or broken. | Medium | Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, and `twitter:card` to public pages. | Better link previews and trust when shared. |
| No structured data | All HTML pages | Google does not get explicit LocalBusiness, TaxiService, FAQ, or contact details. | High | Add JSON-LD for `LocalBusiness` or `TaxiService` with company name, address, phone, URL, area served, opening hours, and services. Add FAQ schema where real FAQs exist. | Stronger local SEO and clearer business identity. |
| Homepage has only one meta description and weak section depth | `index.html:6` to `index.html:7`; content in `index.html:39` to `index.html:94` | Homepage targets "Luxury Transfers Prague" but lacks enough route/service content to rank strongly. | High | Add sections for Prague airport transfers, private chauffeur, Europe transfers, fleet, reviews, FAQs, and popular routes. | More topical authority and higher conversion from organic traffic. |
| Programs page includes draft/internal SEO note | `programs.html:23` | Internal implementation notes can be indexed and harm credibility. | Critical | Remove the note. Replace with actual customer-facing destination and program content. | Immediate quality improvement for users and crawlers. |
| Important service pages are missing | No route pages exist | Searches like "Prague airport transfer", "Prague to Vienna private transfer", and Arabic VIP transfer queries need dedicated pages. | High | Create pages such as `airport-transfer-prague.html`, `prague-to-vienna-transfer.html`, `prague-to-dresden-transfer.html`, `prague-to-cesky-krumlov.html`, and Arabic-focused VIP Prague transfer page. | More organic entry points and better keyword targeting. |
| Multilingual SEO is not implemented | Language switch in `assets/app.js:14`; pages are single URLs | Changing text client-side does not create indexable language-specific URLs. | High | Create language-specific static URLs such as `/en/`, `/cs/`, `/ar/`, or use separate HTML pages. Add `hreflang` tags for each language version. | Search engines can index each language properly. |
| Image alt text is missing on programs cards and logo | `programs.html:34` to `programs.html:60`; `index.html:15` | Images cannot support accessibility or image search, and missing logo alt hurts basic semantics. | Medium | Add descriptive `alt` attributes to every meaningful image. Use empty `alt=""` only for decorative images. | Better accessibility and image relevance. |
| Broken images undermine SEO quality | `services.html:163` onward; `programs.html:54`; `fleet.html:25` | Crawlers and users encounter missing assets, which reduces perceived quality. | High | Fix all local image references and run an asset checker before publishing. | Better user experience and crawl quality. |
| Quote and thank-you pages should have indexing rules | `quote.html`, `thankyou.html` | Quote page may be indexable, but thank-you should not be indexed. | Medium | Add `<meta name="robots" content="noindex,follow">` to `thankyou.html`. Keep quote indexable only if it has useful content; otherwise use `noindex,follow`. | Prevents thin/private pages from appearing in search. |
| Contact page title is translated via `data-i18n` instead of a static title | `contact.html:6` | Search engines and social parsers may read the initial text before JS translation. | Low | Use static, descriptive titles per page, such as `Contact VIP Coach Transfers Prague | 24/7 Chauffeur Service`. | More reliable metadata. |
| Company NAP appears but is not marked up | `contact.html:46` to `contact.html:70`; footer in `index.html:101` | Name, address, and phone consistency matters for local search. | Medium | Keep NAP identical across site and include it in JSON-LD. Add clickable `tel:` and `mailto:` links. | Better local trust and faster mobile contact. |
| No sitemap or robots file | No `sitemap.xml` or `robots.txt` found | Search engines can still crawl, but discovery and indexing control are weaker. | Medium | Add `sitemap.xml` listing all public pages and `robots.txt` referencing it. | Better crawl discovery and control. |

## Recommended Metadata Examples

Use page-specific metadata instead of generic titles.

| Page | Suggested Title | Suggested Description |
|---|---|---|
| Home | VIP Coach Transfers Prague | Luxury Airport and Europe Transfers | Private airport transfers, chauffeur service, VIP vans, sedans, minibuses, and coaches in Prague. 24/7 WhatsApp booking and fixed-price quotes. |
| Services | VIP Transfer Services in Prague | Airport, Chauffeur, Europe Routes | Book Prague airport transfers, private driver service, city-to-city transfers, daily tours, and VIP group transport. |
| Fleet | VIP Fleet Prague | Sedans, Mercedes V-Class, Minibuses and Coaches | Choose premium vehicles for airport transfers, families, corporate travel, events, and private tours from Prague. |
| Programs | Private Day Trips from Prague | VIP Coach Transfers | Private day trips and seasonal programs from Prague with professional drivers, flexible timing, and comfortable vehicles. |
| Contact | Contact VIP Coach Transfers Prague | 24/7 WhatsApp Booking | Contact VIP Coach Transfers s.r.o. for private transfers, chauffeur service, airport pickup, and group transport in Prague. |

