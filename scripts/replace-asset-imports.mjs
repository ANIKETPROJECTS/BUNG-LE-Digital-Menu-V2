import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const mapping = JSON.parse(readFileSync("scripts/cloudinary-mapping.json", "utf8"));

const filesOutput = execSync(
  `grep -rl --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.css' --include='*.html' "@assets/" client server vite.config.ts 2>/dev/null || true`,
  { encoding: "utf8" },
);
const files = filesOutput.split("\n").filter(Boolean);
console.log(`Files to process: ${files.length}`);

let totalReplacements = 0;
let totalImportsConverted = 0;
const unmapped = new Set();

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const original = content;

  content = content.replace(
    /^([ \t]*)import\s+([A-Za-z0-9_$]+)\s+from\s+["']@assets\/([^"']+)["'];?[ \t]*$/gm,
    (match, indent, varName, filename) => {
      const url = mapping[filename];
      if (!url) {
        unmapped.add(filename);
        return match;
      }
      totalImportsConverted++;
      return `${indent}const ${varName} = "${url}";`;
    },
  );

  content = content.replace(/["']@assets\/([^"']+)["']/g, (match, filename) => {
    const url = mapping[filename];
    if (!url) {
      unmapped.add(filename);
      return match;
    }
    totalReplacements++;
    return `"${url}"`;
  });

  if (content !== original) {
    writeFileSync(file, content);
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nImports converted to consts: ${totalImportsConverted}`);
console.log(`Other string replacements: ${totalReplacements}`);
if (unmapped.size > 0) {
  console.log(`\nUnmapped (kept as @assets/ - probably non-image like .json/.mp3):`);
  for (const f of unmapped) console.log(`  ${f}`);
}
