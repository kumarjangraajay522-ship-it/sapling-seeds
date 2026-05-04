import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');

async function optimizeImages() {
  console.log('Scanning for large images to optimize...');
  const files = fs.readdirSync(assetsDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') continue;

    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    
    // Optimize if larger than 500KB
    if (stats.size > 500 * 1024) {
      console.log(`Optimizing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      
      const tempPath = path.join(assetsDir, `temp_${file}`);
      
      try {
        await sharp(filePath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80, progressive: true }) // Convert everything to progressive JPEG for speed
          .toFile(tempPath);

        // Replace original with optimized
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const newStats = fs.statSync(filePath);
        console.log(`✅ Success: ${file} is now ${(newStats.size / 1024).toFixed(2)} KB`);
      } catch (err) {
        console.error(`❌ Error optimizing ${file}:`, err);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath); // cleanup
        }
      }
    }
  }
  console.log('Image optimization complete!');
}

optimizeImages();
