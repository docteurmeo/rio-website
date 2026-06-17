// Reads all SVGs and outputs batched assignment JSON for Figma
import fs from 'fs';
import path from 'path';

const SVG_DIR = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\output';

const files = fs.readdirSync(SVG_DIR)
  .filter(f => f.endsWith('.svg'))
  .sort();

const svgs = files.map(f => ({
  name: f.replace('.svg', ''),
  content: fs.readFileSync(path.join(SVG_DIR, f), 'utf8').trim()
}));

// 128 rect IDs in order
const rectIds = ["1268:189","1268:190","1268:192","1268:194","1268:196","1268:198","1268:200","1268:202","1268:204","1268:206","1268:208","1268:210","1268:212","1268:214","1268:216","1268:218","1268:220","1268:222","1268:224","1268:226","1268:228","1268:230","1268:232","1268:234","1268:236","1268:238","1268:240","1268:242","1268:244","1268:246","1268:248","1268:250","1268:252","1268:254","1268:256","1268:258","1268:260","1268:262","1268:264","1268:266","1268:268","1268:270","1268:272","1268:274","1268:276","1268:278","1268:280","1268:282","1268:284","1268:286","1268:288","1268:290","1268:292","1268:294","1268:296","1268:298","1268:300","1268:302","1268:304","1268:306","1268:308","1268:310","1268:312","1268:314","1268:316","1268:318","1268:320","1268:322","1268:324","1268:326","1268:328","1268:330","1268:332","1268:334","1268:336","1268:338","1268:340","1268:342","1268:344","1268:346","1268:348","1268:350","1268:352","1268:354","1268:356","1268:358","1268:360","1268:362","1268:364","1268:366","1268:368","1268:370","1268:372","1268:374","1268:376","1268:378","1268:380","1268:382","1268:384","1268:386","1268:388","1268:390","1268:392","1268:394","1268:396","1268:398","1268:400","1268:402","1268:404","1268:406","1268:408","1268:410","1268:412","1268:414","1268:416","1268:418","1268:420","1268:422","1268:424","1268:426","1268:428","1268:430","1268:432","1268:434","1268:436","1268:438","1268:440","1268:442"];

// Shuffle SVGs and assign randomly to 128 slots (repeat as needed)
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
const rand = seededRandom(42);
const assigned = rectIds.map(() => svgs[Math.floor(rand() * svgs.length)]);

// Split into batches of 10
const BATCH_SIZE = 6;
const batches = [];
for (let i = 0; i < assigned.length; i += BATCH_SIZE) {
  batches.push(assigned.slice(i, i + BATCH_SIZE).map((svg, j) => ({
    rectId: rectIds[i + j],
    svgName: svg.name,
    svgContent: svg.content
  })));
}

// Output each batch as a JS code snippet for use_figma
batches.forEach((batch, bi) => {
  const dataJson = JSON.stringify(batch.map(b => ({
    rectId: b.rectId,
    name: b.svgName,
    svg: b.svgContent
  })));

  const code = `
const data = ${dataJson};
const frameNode = figma.currentPage.findOne(n => n.name === 'Icons pallete');
for (const item of data) {
  const rect = figma.currentPage.findOne(n => n.id === item.rectId);
  if (!rect) continue;
  const svgNode = figma.createNodeFromSvg(item.svg);
  svgNode.name = item.name;
  const padding = 16;
  const size = rect.width - padding * 2;
  svgNode.resize(size, size);
  svgNode.x = rect.x + padding;
  svgNode.y = rect.y + padding;
  frameNode.appendChild(svgNode);
}
`.trim();

  fs.writeFileSync(
    `D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\batch_${String(bi+1).padStart(2,'0')}.js`,
    code
  );
  console.log(`Batch ${bi+1}: ${batch.length} icons, ~${Math.round(code.length/1024)}KB`);
});

console.log(`\n${batches.length} batch files written.`);

