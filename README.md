# VIP Coach Transfers Static Site

Production static marketing site for VIP Coach Transfers.

## Local Preview

Install dependencies once:

```bash
npm install
```

Generate pages and optimized images:

```bash
npm run optimize:images
npm run generate
npm run check
```

Start a local server:

```bash
npm run serve
```

Open:

```text
http://127.0.0.1:5500/
```

If you run `python -m http.server 5500` manually and Python prints `http://[::]:5500/`, that is the IPv6 bind address. You can still open `http://127.0.0.1:5500/` or `http://localhost:5500/` in the browser.

## Useful Scripts

- `npm run generate` rebuilds root, EN, CS and AR static pages.
- `npm run optimize:images` writes WebP derivatives to `assets/optimized/`.
- `npm run check` validates JS syntax, local references, hero background URLs and image files.
- `npm run serve` previews the site on `127.0.0.1:5500`.
