# Redesign Roadmap

This roadmap prioritizes production fixes first, then conversion improvements, then a scalable redesign. The site should become a premium, fast, multilingual lead-generation system for VIP airport transfers, chauffeur service, Europe routes, fleet bookings, and day programs.

## Phase 1: Production Fixes

| Item | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Fix broken `assets/data.js` | `assets/data.js:80`, `assets/data.js:158`, `assets/data.js:236` | Shared JS currently cannot rely on the translation dictionary. | Critical | Add missing commas and run `node --check assets/data.js`. | Restores translations and WhatsApp link hydration. |
| Fill missing i18n keys | `index.html`, `quote.html`, `programs.html`, `thankyou.html` | Many translated elements are blank or incomplete. | High | Add all referenced keys to `assets/data.js`, or remove `data-i18n` from elements with static copy. | Prevents blank UI and improves multilingual trust. |
| Fix broken image references | `services.html`, `programs.html`, `fleet.html` | Missing images create a visibly broken site. | Critical | Normalize filenames and folder casing. Add missing `fleet-hero.jpg` or change reference. Replace corrupt placeholder images. | Restores professional visual quality. |
| Remove internal production copy | `programs.html:23` | Users see draft implementation notes. | Critical | Replace with customer-facing program intro and CTA. | Immediate trust improvement. |
| Fix homepage header HTML | `index.html:13` to `index.html:20` | Malformed markup can create inconsistent layout. | High | Close `.logo` correctly and add logo `alt`. | More stable header and better accessibility. |
| Add basic validation scripts | Repository root | Existing issues would have been caught automatically. | High | Add `package.json` scripts for JS syntax, local asset references, and image validity. | Prevents future deployment breakage. |

## Phase 2: Conversion and UX Quick Wins

| Item | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Strengthen primary CTA wording | Site-wide CTAs | Generic CTAs under-sell speed and certainty. | Medium | Use "Get fixed price", "Check availability", and "Book on WhatsApp". Keep CTA labels consistent. | Higher click-through to quote/WhatsApp. |
| Add trust strip below hero | `index.html` | Visitors need proof before requesting a VIP transfer. | High | Add a horizontal strip: licensed company, 24/7, flight tracking, professional drivers, fixed quote, Arabic/English support. | Better first-scroll confidence. |
| Add popular route shortcuts | Homepage and quote page | Users often know the route before they know the service category. | High | Add route chips: Prague Airport to Center, Prague to Vienna, Prague to Dresden, Prague to Karlovy Vary, Prague to Cesky Krumlov. | Faster quote starts and better SEO signals. |
| Improve quote form grouping | `quote.html:43` to `quote.html:139` | Long form creates friction. | High | Split into visual groups: Trip, Passengers, Vehicle, Contact, Notes. Add response-time copy. | Lower abandonment and better lead quality. |
| Include all fields in WhatsApp message | `quote.html:298` to `quote.html:376` | Current message omits name, email, and notes, reducing lead context. | High | Add `name`, `email`, `notes`, and optional flight number to `buildMessage`. | Faster follow-up and fewer clarification messages. |
| Remove IP lookup from WhatsApp flow | `quote.html:285` | Delays conversion and introduces privacy friction. | High | Remove `detectCountry` or make it non-blocking and optional. | Faster WhatsApp opening. |
| Add sticky mobile CTA bar | `assets/style.css`; all pages | Mobile users need immediate contact access. | Medium | Add bottom bar with WhatsApp and Get Quote. Hide or adapt current floating WhatsApp button on small screens. | More mobile leads. |

## Phase 3: Visual Redesign

| Item | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Redesign homepage as a booking landing page | `index.html` | Current homepage is a set of static cards rather than a persuasive funnel. | High | New order: hero, trust strip, route shortcuts, airport transfer section, fleet showcase, services, testimonials, FAQ, final CTA. | Better conversion and stronger brand perception. |
| Redesign services page around customer intent | `services.html` | Current page is long and inconsistent by language. | Medium | Use service cards with images, benefits, "best for", and CTA. Move long descriptions into focused sections or FAQs. | Easier service selection. |
| Redesign fleet page with comparison table | `fleet.html` | Users need to choose by passengers, luggage, and occasion. | Medium | Add table: vehicle, seats, luggage, best for, amenities, CTA. Keep filters as enhancement. | Better quote accuracy. |
| Redesign programs page as bookable experiences | `programs.html` | Programs are currently examples, not persuasive products. | Medium | Destination cards with duration, route, season, highlights, price note, and "Request this program". | More program inquiries. |
| Redesign contact page for action | `contact.html` | Contact page should convert, not just display info. | Medium | Use action-first layout with WhatsApp, phone, email, response time, company details, then map. | Faster contact conversions. |

## Phase 4: SEO and Content Expansion

| Item | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Add service landing pages | New files | Search demand is route and service specific. | High | Create pages for Prague airport transfer, private chauffeur Prague, Europe transfers, Prague to Vienna, Prague to Dresden, Prague to Cesky Krumlov. | More organic traffic and better conversion intent. |
| Add multilingual static URLs | Current JS-only language switching | Client-side language switching is not enough for SEO. | High | Generate `/en/`, `/cs/`, and `/ar/` pages with `hreflang`. | Indexable multilingual content. |
| Add structured data | All public pages | Search engines need explicit business and service context. | Medium | Add JSON-LD for LocalBusiness/TaxiService, Service, FAQ, and BreadcrumbList. | Stronger local and rich-result eligibility. |
| Add reviews and proof content | Homepage, services, quote | VIP users need confidence and social proof. | High | Add testimonials, Google rating reference, real fleet/driver proof, company registration, insurance/service promises. | Higher booking trust. |
| Add sitemap and robots | New `sitemap.xml`, `robots.txt` | Improves crawl discovery and indexing control. | Medium | Generate sitemap for all public pages and add robots reference. | Better crawl coverage. |

## Phase 5: Scalable Static Architecture

| Item | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Introduce static site generation | Whole repo | Manual HTML duplication will slow every future improvement. | Medium | Migrate to Astro or Eleventy with layouts, components, and data-driven pages. | Faster content growth and fewer bugs. |
| Centralize content data | Fleet, services, programs, company info | Data is duplicated and inconsistent. | Medium | Create structured data files and render all cards from them. | Easier updates and route page generation. |
| Add first-party lead pipeline | Quote flow | FormSubmit is useful, but not enough for production lead operations. | Medium | Add Cloudflare Worker or serverless endpoint to email lead, store in CRM/Sheet, and capture UTMs. | Better lead reliability and marketing attribution. |
| Add analytics events | CTAs and forms | The business cannot optimize what it cannot measure. | Medium | Track `whatsapp_click`, `quote_start`, `quote_submit`, `route_chip_click`, `language_switch`. | Data-driven conversion optimization. |

## Recommended Implementation Order

1. Fix `data.js`, image paths, corrupt assets, and production placeholder copy.
2. Add image optimization, lazy loading, and validation scripts.
3. Improve quote form and WhatsApp payload.
4. Redesign homepage and contact flow around trust plus fast booking.
5. Add SEO metadata, structured data, sitemap, and route landing pages.
6. Move to a static generator once the current production issues are stable.

