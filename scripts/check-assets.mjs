import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full);
    } else {
      files.push(full);
    }
  }
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function resolveRef(fromFile, raw) {
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(raw)) return null;
  const clean = raw.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (clean.startsWith("/")) return clean.slice(1);
  const base = path.posix.dirname(rel(fromFile));
  return path.posix.normalize((base === "." ? "" : `${base}/`) + clean);
}

walk(root);

const existing = new Set(files.map(rel));
const refFiles = files.filter((file) => /\.(html|css|js)$/i.test(file));
const refs = [];
const customPropertyIssues = [];

for (const file of refFiles) {
  const text = fs.readFileSync(file, "utf8");
  const patterns = [
    /\b(?:src|href)=["']([^"']+)["']/g,
    /url\(["']?([^"')]+)["']?\)/g,
    /this\.src=["']([^"']+)["']/g
  ];

  for (const re of patterns) {
    let match;
    while ((match = re.exec(text))) {
      const resolved = resolveRef(file, match[1]);
      if (!resolved) continue;
      if (/\.html$/i.test(resolved) || /\.(css|js|png|jpe?g|webp|svg|ico)$/i.test(resolved)) {
        refs.push({ from: rel(file), raw: match[1], resolved });
      }
    }
  }

  const heroImagePattern = /--hero-image\s*:\s*url\(["']?([^"')]+)["']?\)/g;
  let heroMatch;
  while ((heroMatch = heroImagePattern.exec(text))) {
    const raw = heroMatch[1];
    if (!raw.startsWith("/") && !/^https?:/i.test(raw)) {
      customPropertyIssues.push({
        from: rel(file),
        raw,
        resolved: "hero background URLs must be root-relative because CSS custom-property urls are resolved from assets/style.css"
      });
    }
  }
}

const missing = refs.filter((item) => !existing.has(item.resolved)).concat(customPropertyIssues);
if (missing.length) {
  console.error("Missing local references:");
  for (const item of missing) console.error(`- ${item.from}: ${item.raw} -> ${item.resolved}`);
  process.exitCode = 1;
}

const imageFiles = files.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
for (const image of imageFiles) {
  try {
    const stat = fs.statSync(image);
    if (stat.size < 16) throw new Error("too small to be valid");
    await sharp(image).metadata();
  } catch (error) {
    console.error(`Invalid image: ${rel(image)} (${error.message})`);
    process.exitCode = 1;
  }
}

if (!process.exitCode) {
  console.log(`Checked ${refs.length} local references and ${imageFiles.length} images.`);
}
