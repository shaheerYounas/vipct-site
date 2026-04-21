import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetsDir = path.join(root, "assets");
const outDir = path.join(assetsDir, "optimized");
const imageExt = new Set([".jpg", ".jpeg", ".png"]);

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

  await input
    .rotate()
    .resize({ width: Math.min(meta.width, maxWidth), withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(target);

  console.log(`${rel} -> ${path.relative(root, target)}`);
}
