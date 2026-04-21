# Architecture Audit

Production context: VIP Coach Transfers is currently a static marketing site hosted for `vipct.org`. It can work well as a lightweight lead-generation site, but the current codebase has several production blockers that affect reliability, maintainability, and conversion tracking.

## System Summary

| Area | Current State | Production Assessment |
|---|---|---|
| Rendering model | Static HTML files: `index.html`, `services.html`, `fleet.html`, `programs.html`, `quote.html`, `contact.html`, `thankyou.html` | Good for simple hosting and speed, but repeated markup and hardcoded data make scaling difficult. |
| Styling | One shared stylesheet in `assets/style.css`, plus large inline page styles in several HTML files | Inconsistent design system and hard to maintain. |
| JavaScript | Shared `assets/app.js`, inline quote-page script, inline fleet filter script, inline thank-you script | Behavior is split across page files and not validated by any build step. |
| Data | Fleet, services, programs, company details, translations, and CTAs are hardcoded in HTML or `assets/data.js` | Data is duplicated and currently broken due to a syntax error. |
| Booking flow | Quote form posts to FormSubmit; WhatsApp flow is generated in browser and stores summary in `sessionStorage` | Leads can be lost or fragmented. No first-party backend, CRM, or analytics events. |
| Multilingual support | `data-i18n` attributes plus `window.I18N` object | Intended approach is reasonable, but currently broken and incomplete. |

## Architecture Issues

| Issue | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Translation file has a syntax error, blocking shared JS behavior | `assets/data.js:80`, `assets/data.js:158`, `assets/data.js:236` | `assets/app.js` depends on `window.I18N`. When `data.js` fails to parse, language switching, translated empty labels, active nav setup, and WhatsApp link hydration do not run. | Critical | Add missing commas after each `fleetBtnWa` property. Then run `node --check assets/data.js` and `node --check assets/app.js` before deployment. | Restores multilingual behavior and shared WhatsApp links site-wide. |
| Many referenced translation keys do not exist | `index.html:42`, `index.html:51`, `quote.html:50`, `thankyou.html:114`, `programs.html:20` | Elements with empty fallback text remain blank when JS runs. This is especially damaging on quote and thank-you pages. | High | Add all used keys to `assets/data.js`: homepage hero, service cards, fleet preview, programs copy, quote labels, modal labels, and thank-you labels. Alternatively remove `data-i18n` from content that should stay static. | Prevents blank UI and makes EN/CZ/AR pages consistent. |
| Header, footer, language switcher, and WhatsApp float are duplicated across every page | `index.html:11`, `services.html:105`, `fleet.html:184`, `programs.html:6`, `quote.html:13`, `contact.html:12`, `thankyou.html:67` | Any navigation or company detail change must be repeated manually, increasing drift and mistakes. | High | Introduce a static site generator such as Astro or Eleventy, or a simple build script that injects shared `partials/header.html`, `partials/footer.html`, and `partials/whatsapp.html`. | Faster edits, fewer inconsistencies, easier future page creation. |
| Data is hardcoded in page markup instead of structured source files | Fleet in `fleet.html:238`; services in `services.html:159`; programs in `programs.html:20` | Service/fleet/program changes require editing HTML and translation fragments manually. This will not scale for route landing pages or seasonal programs. | High | Create `data/company.json`, `data/fleet.json`, `data/services.json`, `data/programs.json`, and generate cards/pages from those data files. | Enables scalable content, route pages, and less duplicated code. |
| Booking data is split between FormSubmit and WhatsApp | Form action in `quote.html:44`; WhatsApp message builder in `quote.html:298`; thank-you session data in `thankyou.html:177` | Email leads and WhatsApp leads can have different fields. There is no reliable lead record or analytics trail. | High | Standardize lead payload in one JS object. Include trip type, dates, locations, passenger count, luggage, vehicle, name, phone, email, notes, language, and UTM fields. Send the same payload to both email endpoint and WhatsApp message. | Fewer lost details, better lead quality, better follow-up speed. |
| No first-party lead endpoint or CRM integration | `quote.html:44` posts directly to `https://formsubmit.co/info@vipct.org` | The business depends on a third party for quote delivery and has no structured lead database. | Medium | For GitHub Pages, add a Cloudflare Worker, Make/Zapier webhook, or serverless endpoint that emails the lead and writes to Google Sheets/CRM. Add spam protection and server-side validation. | Better reliability, measurable conversion funnel, easier lead management. |
| Page-specific JavaScript is embedded inline | Quote logic in `quote.html:196`; fleet filter in `fleet.html:363`; thank-you logic in `thankyou.html:168` | Inline scripts are harder to test, reuse, cache, and maintain. | Medium | Move scripts to `assets/quote.js`, `assets/fleet.js`, and `assets/thankyou.js`. Load with `defer`. Add syntax checks to deployment. | Better cacheability and easier debugging. |
| Page-specific CSS is embedded inline | `services.html:8`, `fleet.html:9`, `thankyou.html:8`, `quote.html:188` | Design tokens are bypassed and styles drift across pages. | Medium | Move page styles into `assets/pages/services.css`, `assets/pages/fleet.css`, `assets/pages/quote.css`, and shared components into `assets/components.css`. | Cleaner design system and easier redesign. |
| Static site has no build or validation workflow | `README.md:1` only contains the project name; no `package.json` exists | Broken JS and broken image paths reached the repository with no automated warning. | High | Add `package.json` with scripts: `check:js`, `check:links`, `check:html`, and `check:assets`. Run these before deployment. | Prevents regressions such as syntax errors and missing images. |
| No clear model for drivers, vehicle availability, or pricing | No driver data, availability data, or pricing data files exist | A VIP transfer site eventually needs availability, vehicle capacity logic, common routes, and price anchors. | Low now, High later | Add structured files for `routes.json`, `vehicleCapacity.json`, and optional `priceAnchors.json`. Keep actual booking confirmation manual until backend is ready. | Enables smarter quote forms and route landing pages without a full booking system. |

## Recommended Target Architecture

| Layer | Recommendation | Why |
|---|---|---|
| Static generation | Astro or Eleventy | Keeps hosting simple while adding layouts, reusable components, and data-driven pages. |
| Content | JSON or Markdown data files | Fleet, services, programs, routes, FAQs, and reviews become reusable across pages. |
| Styling | Shared design tokens plus component CSS | Consistent luxury visual system and faster redesign iteration. |
| Forms | First-party webhook or serverless function | Better lead reliability, validation, UTM capture, and CRM integration. |
| Analytics | GA4, Plausible, or similar with custom events | Track WhatsApp clicks, quote starts, quote submits, language switches, and route interest. |
| Quality checks | Simple npm scripts | Catch JS syntax, broken links, missing assets, and oversized images before publishing. |

