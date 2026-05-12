import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Starting Sapling Seeds Server ---');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);

try {
  // Use dynamic import to catch early errors
  await import('./backend/src/server.js');
  console.log('✅ Backend logic loaded successfully');
} catch (error) {
  console.error('❌ CRITICAL ERROR during server startup:');
  console.error(error);
  process.exit(1);
}
