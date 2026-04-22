import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".pages-dist");
const directories = new Set(["assets", "en", "cs", "ar"]);
const files = new Set(["robots.txt", "sitemap.xml", ".nojekyll"]);

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const entries = await fs.readdir(root, { withFileTypes: true });

for (const entry of entries) {
  const source = path.join(root, entry.name);
  const target = path.join(outDir, entry.name);

  if (entry.isDirectory() && directories.has(entry.name)) {
    await fs.cp(source, target, { recursive: true });
    continue;
  }

  if (entry.isFile() && (entry.name.endsWith(".html") || files.has(entry.name))) {
    await fs.copyFile(source, target);
  }
}

console.log(`Prepared GitHub Pages artifact in ${outDir}`);
