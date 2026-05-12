import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const apps = [
  {
    name: 'sapling-seeds',
    dir: path.join(rootDir, 'sapling-seeds'),
    dest: path.join(rootDir, 'backend', 'public', 'client')
  },
  {
    name: 'admin-portal',
    dir: path.join(rootDir, 'admin-portal'),
    dest: path.join(rootDir, 'backend', 'public', 'admin')
  }
];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function deleteRecursiveSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteRecursiveSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

async function build() {
  console.log('🚀 Starting production build process...');

  const publicDir = path.join(rootDir, 'backend', 'public');
  if (fs.existsSync(publicDir)) {
    console.log('🧹 Cleaning existing public directory...');
    deleteRecursiveSync(publicDir);
  }
  fs.mkdirSync(publicDir, { recursive: true });

  for (const app of apps) {
    console.log(`\n📦 Building ${app.name}...`);
    
    try {
      execSync('npm run build', { cwd: app.dir, stdio: 'inherit' });
      
      const distDir = path.join(app.dir, 'dist');
      if (fs.existsSync(distDir)) {
        console.log(`🚚 Moving ${app.name} build to ${app.dest}...`);
        fs.mkdirSync(app.dest, { recursive: true });
        copyRecursiveSync(distDir, app.dest);
        console.log(`✅ ${app.name} built and moved.`);
      } else {
        console.error(`❌ Dist directory not found for ${app.name}`);
      }
    } catch (error) {
      console.error(`❌ Error building ${app.name}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✨ Production build complete! All files are in backend/public');
}

build();

