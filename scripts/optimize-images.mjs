import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetsDir = path.join(root, "assets");
const outDir = path.join(assetsDir, "optimized");
const imageExt = new Set([".jpg", ".jpeg", ".png"]);
const widths = [480, 768, 1024, 1400];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full === outDir) continue;
      files.push(...await walk(full));
    } else if (imageExt.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function maxWidthFor(rel) {
  if (rel === "logo-gold.png") return 220;
  if (rel.startsWith("fleet-")) return 1200;
  if (rel === "hero.jpg") return 1600;
  return 1400;
}

const images = await walk(assetsDir);
await fs.mkdir(outDir, { recursive: true });

for (const file of images) {
  const rel = path.relative(assetsDir, file);
  const parsed = path.parse(rel);
  const target = path.join(outDir, parsed.dir, `${parsed.name}.webp`);
  await fs.mkdir(path.dirname(target), { recursive: true });

  const input = sharp(file, { failOn: "error" });
  const meta = await input.metadata();
  if (!meta.width || !meta.height) throw new Error(`Invalid image: ${rel}`);
  const maxWidth = maxWidthFor(rel.replaceAll("\\", "/"));

  const normalized = input.rotate();
  const baseWidth = Math.min(meta.width, maxWidth);

  await normalized
    .clone()
    .resize({ width: baseWidth, withoutEnlargement: true })
    .webp({ quality: rel.startsWith("programs") ? 72 : 78, effort: 5 })
    .toFile(target);

  await normalized
    .clone()
    .resize({ width: baseWidth, withoutEnlargement: true })
    .avif({ quality: rel.startsWith("programs") ? 48 : 55, effort: 5 })
    .toFile(path.join(outDir, parsed.dir, `${parsed.name}.avif`));

  for (const width of widths) {
    const variantWidth = Math.min(width, maxWidth);
    await normalized
      .clone()
      .resize({ width: variantWidth, withoutEnlargement: true })
      .webp({ quality: rel.startsWith("programs") ? 72 : 78, effort: 5 })
      .toFile(path.join(outDir, parsed.dir, `${parsed.name}-${width}.webp`));

    await normalized
      .clone()
      .resize({ width: variantWidth, withoutEnlargement: true })
      .avif({ quality: rel.startsWith("programs") ? 48 : 55, effort: 5 })
      .toFile(path.join(outDir, parsed.dir, `${parsed.name}-${width}.avif`));
  }

  console.log(`${rel} -> ${path.relative(root, target)}`);
}
