# Performance Audit

The site is static, so it has the potential to be very fast. Current performance risk comes mostly from oversized images, broken/missing image requests, render-blocking resources, and lack of basic image loading attributes.

## Asset Summary

| Asset Group | Approximate Weight | Notes |
|---|---:|---|
| PNG files | 7.6 MB | Several program images are very large; three PNG files are corrupt placeholders. |
| JPG files | 6.8 MB | Many are larger than their displayed size. |
| HTML files | 78 KB | Fine, though inline CSS/JS reduces cache efficiency. |
| JS files | 12 KB | Small, but `data.js` is broken. |
| CSS files | 6 KB | Small shared CSS, but page CSS is embedded in HTML. |

## Performance Issues

| Issue | Where It Appears | Why It Matters | Severity | Exact Fix | Expected Impact |
|---|---|---|---|---|---|
| Large unoptimized program images | `assets/programs/Special-PRG.png`, `assets/programs/Summer.png`, `assets/programs/PRG-snow-1.png`, `assets/programs/PRG-snow-2.png` | These four images alone are about 7.3 MB. On mobile, this can slow page load dramatically when used. | High | Convert to WebP or AVIF at display sizes. Create responsive versions such as 480, 768, and 1200 px. Replace `<img>` sources with `srcset`. | 60-80% reduction for those assets, faster program page loads. |
| Logo image is far too large for display size | `assets/logo-gold.png`; used at `index.html:15`, `quote.html:158`, `thankyou.html:72` | The logo is about 410 KB and displayed around 28-40 px high. | High | Export a small optimized transparent WebP/PNG around 160 px wide, or use an SVG if the logo is vector. Update all logo references. | Saves hundreds of KB on first load. |
| Broken image paths cause 404 requests | `fleet.html:25`, `programs.html:54`, `programs.html:59`, `services.html:163`, `services.html:179`, `services.html:195` | Missing images slow rendering, create layout gaps, and look unprofessional. Case mismatch can fail on production hosting. | Critical | Rename `assets/Services` to `assets/services` or update all references consistently. Fix `Adventure-Wintter.png` to actual file, `Action-PRG.png` to `.jpg`, and provide `assets/fleet-hero.jpg` or change the background URL. | Removes wasted requests and restores visual content. |
| Corrupt 0-byte or 2-byte image placeholders exist | `assets/programs/PRG-Summer-1.png`, `assets/programs/PRG-Summer-2.png`, `assets/programs/PRG-VIE.png` | These files cannot render and can hide broken production content. | Medium | Delete them if unused, or replace with valid optimized images. Add asset validation to the build. | Prevents future broken cards and deployment confusion. |
| Most images do not use lazy loading | `programs.html:34` to `programs.html:60`; `services.html:163` onward; `fleet.html:244` onward | Below-the-fold images load too early and compete with critical content. | High | Add `loading="lazy" decoding="async"` to non-hero images. Keep the top hero image eager. | Faster initial page load and better mobile experience. |
| Images lack explicit width and height | Most `<img>` elements across `programs.html`, `services.html`, `fleet.html` | Browser cannot reserve space before images load, increasing layout shift risk. | Medium | Add `width` and `height` attributes matching actual or intended aspect ratio. Use CSS `aspect-ratio` for cards. | Lower cumulative layout shift and more stable cards. |
| Quote page loads Flatpickr despite using native date inputs | `quote.html:9`, `quote.html:194`, initialized in `quote.html:436` | Adds external CSS/JS dependency and render-blocking CSS for a simple date input. | Medium | Remove Flatpickr and rely on native `type="date"`, or use one local date-picker bundle only if there is a clear UX requirement. | Fewer network requests and less JavaScript. |
| External IP geolocation request delays WhatsApp flow | `quote.html:285` to `quote.html:295` | On WhatsApp click, the site calls `ipapi.co`. Slow or blocked network can delay the most important conversion action. It also has privacy implications. | High | Remove IP lookup from the booking flow. Capture language, time zone, and UTM locally if needed. If country is required, ask in the form. | Faster WhatsApp conversion and less privacy risk. |
| Inline CSS and JS reduce cache efficiency | CSS in `services.html:8`, `fleet.html:9`, `thankyou.html:8`; JS in `quote.html:196` | Browser cannot cache page-specific behavior separately, and HTML becomes heavier. | Low | Move page CSS and JS into external files loaded with `defer` for JS. | Cleaner caching and maintainability. |
| Shared JS is not loaded with `defer` | `index.html:117`, `services.html:577`, `quote.html:192`, other pages | Scripts at the end are acceptable, but `defer` gives safer parsing behavior and consistency. | Low | Use `<script src="assets/data.js" defer></script>` and `<script src="assets/app.js" defer></script>`. Ensure scripts do not depend on blocking execution. | More predictable loading and easier future optimization. |
| No cache-busting strategy for changed assets | All asset URLs are static, for example `assets/style.css` | Browsers may keep stale CSS/JS after updates, especially with static hosting and CDN caching. | Medium | Add versioned query strings manually, such as `assets/style.css?v=2026-04-21`, or use a build tool that fingerprints assets. | Fewer stale UI and JS issues after deployments. |
| Google Maps iframe is very tall | `contact.html:83` to `contact.html:91` | The map is lazy loaded, which is good, but 600 px consumes a lot of scroll space and layout area. | Low | Reduce height to 360-420 px and place below high-value contact CTAs. | Cleaner contact page and less visual weight. |

## Recommended Performance Checklist

| Task | Exact Action | Priority |
|---|---|---|
| Fix JavaScript syntax | Run `node --check assets/data.js` after adding missing commas. | P0 |
| Fix image paths | Normalize folder and filenames, then run a link checker. | P0 |
| Optimize images | Convert large PNG/JPG files to WebP/AVIF and add responsive variants. | P1 |
| Add image attributes | Add `loading`, `decoding`, `width`, `height`, and `alt`. | P1 |
| Remove unnecessary dependencies | Remove Flatpickr and IP geolocation unless strictly needed. | P1 |
| Add validation scripts | Add checks for JS syntax, broken local references, and invalid image files. | P1 |

