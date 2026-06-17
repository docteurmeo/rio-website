import fs from 'fs';
import path from 'path';

const SRC_DIR = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\output\\SVG';
const DST_DIR = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\output';

// Sorted alphabetically → consistent numbering
const files = fs.readdirSync(SRC_DIR)
  .filter(f => f.endsWith('.svg'))
  .sort();

// Continue numbering from 39
let num = 39;

for (const file of files) {
  const src = path.join(SRC_DIR, file);
  const slug = file.replace('.svg', '');
  const outName = `${String(num).padStart(2, '0')}_${slug}.svg`;
  const dst = path.join(DST_DIR, outName);

  let svg = fs.readFileSync(src, 'utf8');

  // Remove background rect (any variant)
  svg = svg.replace(/<rect[^>]*\/>/g, '');
  svg = svg.replace(/<rect[^>]*>.*?<\/rect>/gs, '');

  // Normalize to 1000x1000 display size (keep viewBox coords intact for path scaling)
  svg = svg.replace(/\bwidth="[^"]*"/, 'width="1000"');
  svg = svg.replace(/\bheight="[^"]*"/, 'height="1000"');

  fs.writeFileSync(dst, svg);
  console.log(`✓ ${outName}`);
  num++;
}

console.log(`\nDone. ${files.length} files → ${DST_DIR}`);
