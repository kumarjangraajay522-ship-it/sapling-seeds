/**
 * One-time image optimization script.
 * Compresses JPG/PNG assets in-place using sharp.
 * Run once: npm run optimize-images
 */
import sharp from 'sharp';
import { readdir, rename, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets');

const MAX_PRODUCT_DIM = 900;  // max px for product images
const MAX_LOGO_DIM = 300;     // max px for logos / small UI images
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

const LOGO_BASENAMES = new Set([
  'logo.png',
  'amritaLogo.jpeg',
  'gubbLogo.jpeg',
  'midazzleLogo.jpeg',
  'namanLogo.jpeg',
  'sarvodayaLogo.jpeg',
  'unitedLogo.jpeg',
  'Cvent Logo.png',
  'SF logo.png',
  'Daisy Website.png',
  'Sanchu Website.png',
  'website cst image.png',
  'ajay.png',
  'pawan.png',
]);

const SKIP_BASENAMES = new Set([
  // Earth globe PNGs — used at their natural size in globe animations
  'earth_clouds.png',
  'earth_polluted_final.png',
  'earth_pristine_final.png',
]);

async function sizeKB(path) {
  const { size } = await stat(path);
  return Math.round(size / 1024);
}

async function optimizeImage(filePath) {
  const name = basename(filePath);
  const ext = extname(name).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  if (SKIP_BASENAMES.has(name)) {
    console.log(`  skip  ${name}`);
    return;
  }

  const beforeKB = await sizeKB(filePath);
  const maxDim = LOGO_BASENAMES.has(name) ? MAX_LOGO_DIM : MAX_PRODUCT_DIM;

  const tmp = filePath + '.opt.tmp';
  try {
    let pipeline = sharp(filePath).resize(maxDim, maxDim, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
    } else {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    }

    await pipeline.toFile(tmp);
    await rename(tmp, filePath);

    const afterKB = await sizeKB(filePath);
    const saved = beforeKB - afterKB;
    console.log(`  ${name.padEnd(40)} ${beforeKB}KB → ${afterKB}KB  (saved ${saved}KB)`);
  } catch (err) {
    console.error(`  ERROR ${name}: ${err.message}`);
    try { await rename(tmp, filePath); } catch {}
  }
}

const files = await readdir(ASSETS_DIR);
console.log(`Optimizing ${files.length} files in src/assets/...\n`);
for (const f of files) {
  await optimizeImage(join(ASSETS_DIR, f));
}
console.log('\nDone.');
