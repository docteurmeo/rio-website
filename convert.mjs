import sharp from 'sharp';
import potrace from 'potrace';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const trace = promisify(potrace.trace);

const INPUT_DIR  = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons';
const OUTPUT_DIR = 'D:\\WORK\\RIO hanoi\\Diben2025\\Icons_SVG\\output';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 39 names in render order (sorted by LastWriteTime)
const NAMES = [
  '01_am-tra',
  '02_phich-nuoc',
  '03_bat-pho',
  '04_chai-nuoc-mam',
  '05_bep-than-to-ong',
  '06_quat-nan',
  '07_con-trau',
  '08_con-co',
  '09_bong-lua',
  '10_la-sen',
  '11_kim-chi',
  '12_con-lan-son',
  '13_but-chi-moc',
  '14_banh-rang',
  '15_lan-di-cho',
  '16_hu-sanh',
  '17_bong-den',
  '18_vong-tai-che',
  '19_bat-tay',
  '20_chu-X',
  '21_noi-gang',
  '22_doi-dua',
  '23_lo-tam',
  '24_banh-mi',
  '25_xe-may',
  '26_mu-bao-hiem',
  '27_xich-lo',
  '28_thuyen-thung',
  '29_ca-ro',
  '30_oc-sen',
  '31_cay-tre',
  '32_con-kien',
  '33_chuon-chuon',
  '34_choi-dot',
  '35_binh-tuoi-cay',
  '36_chau-cay',
  '37_ban-tay-vay',
  '38_nam-dau',
  '39_giot-nuoc',
];

// Sort input files by LastWriteTime (oldest first = render order)
const allFiles = fs.readdirSync(INPUT_DIR)
  .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
  .map(f => ({ name: f, mtime: fs.statSync(path.join(INPUT_DIR, f)).mtime }))
  .sort((a, b) => a.mtime - b.mtime)
  .map(f => f.name);

console.log(`Found ${allFiles.length} images, mapping to ${NAMES.length} names\n`);

for (let i = 0; i < allFiles.length; i++) {
  const file     = allFiles[i];
  const outName  = NAMES[i] || `${String(i+1).padStart(2,'0')}_unknown`;
  const inputPath  = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, outName + '.svg');

  try {
    // Resize to 1000px max, keep aspect
    const resized = await sharp(inputPath)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    // Detect dominant foreground color
    const { data, info } = await sharp(inputPath)
      .resize(100, 100, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const colorCount = {};
    for (let j = 0; j < data.length; j += channels) {
      const r = data[j], g = data[j+1], b = data[j+2];
      if (r > 220 && g > 215 && b > 205) continue; // skip near-white bg
      if (r < 25 && g < 25 && b < 25) continue;    // skip near-black
      const qr = Math.round(r / 25) * 25;
      const qg = Math.round(g / 25) * 25;
      const qb = Math.round(b / 25) * 25;
      const key = `${qr},${qg},${qb}`;
      colorCount[key] = (colorCount[key] || 0) + 1;
    }

    let fillColor = '#1A2BE0';
    let maxCount = 0;
    for (const [key, count] of Object.entries(colorCount)) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = key.split(',').map(Number);
        fillColor = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
      }
    }

    // Greyscale for tracing
    const grayBuf = await sharp(resized).greyscale().png().toBuffer();

    // Trace — no background rect
    let svg = await trace(grayBuf, {
      background: 'transparent',
      color: fillColor,
      threshold: 180,
      turdSize: 4,
      turnPolicy: 'minority',
      alphaMax: 1.3,
      optCurve: true,
      optTolerance: 0.4,
    });

    // Remove any background rect potrace might still emit
    svg = svg.replace(/<rect[^/]*\/>/g, '');
    svg = svg.replace(/<rect[^>]*>.*?<\/rect>/gs, '');

    fs.writeFileSync(outputPath, svg);
    console.log(`✓ ${outName}.svg  ← ${file.slice(12,32)}  [${fillColor}]`);

  } catch (err) {
    console.error(`✗ ${outName}: ${err.message}`);
  }
}

console.log(`\nDone! ${allFiles.length} SVGs → ${OUTPUT_DIR}`);
