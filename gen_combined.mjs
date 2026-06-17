import fs from 'fs';
import path from 'path';

const SVG_DIR = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\output';
const map = JSON.parse(fs.readFileSync('D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\map_remaining.json', 'utf8'));

// unique files used in remaining
const uniqueFiles = [...new Set(Object.values(map))];
const svgByFile = {};
for (const f of uniqueFiles) svgByFile[f] = fs.readFileSync(path.join(SVG_DIR, f), 'utf8').trim();

const code = `const SVGS = ${JSON.stringify(svgByFile)};
const MAP = ${JSON.stringify(map)};
const frame = figma.currentPage.findOne(n => n.name === 'Icons pallete');
let done = 0, missing = 0;
for (const rid in MAP) {
  const rect = figma.currentPage.findOne(n => n.id === rid);
  if (!rect) { missing++; continue; }
  const node = figma.createNodeFromSvg(SVGS[MAP[rid]]);
  node.name = MAP[rid].replace('.svg', '');
  const pad = 16, size = rect.width - pad * 2;
  node.resize(size, size);
  node.x = rect.x + pad;
  node.y = rect.y + pad;
  frame.appendChild(node);
  done++;
}
'filled ' + done + ', missing ' + missing;`;

fs.writeFileSync('D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\combined.js', code);
console.log('unique icons:', uniqueFiles.length, '| total slots:', Object.keys(map).length, '| code size KB:', Math.round(code.length / 1024));
