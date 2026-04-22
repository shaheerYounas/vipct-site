import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.resolve(root, "..", ".env_copy.local");
const target = path.resolve(root, ".env.local");

try {
  await fs.access(source);
} catch (error) {
  console.error(`Missing source env file: ${source}`);
  process.exit(1);
}

await fs.copyFile(source, target);
console.log(`Synced ${path.relative(root, source)} -> ${path.relative(root, target)}`);
