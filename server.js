import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Starting Sapling Seeds Server ---');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);

try {
  console.log('📦 Loading Backend Logic...');
  // Use dynamic import to catch early errors
  await import('./backend/src/server.js');
  console.log('✅ Backend logic loaded successfully');
  console.log('🌐 Server is preparing to accept connections...');
} catch (error) {
  console.error('❌ CRITICAL ERROR during server startup:');
  console.error('Error Name:', error.name);
  console.error('Error Message:', error.message);
  if (error.stack) console.error('Stack Trace:', error.stack);
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('💡 Hint: Missing dependencies? Run "npm install" in the root and backend folders.');
  }
  
  process.exit(1);
}
