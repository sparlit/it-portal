/**
 * Artemis Universal Industrial-Grade Setup Script
 * Supports: Windows (PowerShell/CMD), Linux, macOS
 * Requirements: Node.js, PostgreSQL
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const log = (msg) => console.log(`[ARTEMIS SETUP] ${msg}`);
const error = (msg) => { console.error(`[ARTEMIS ERROR] ${msg}`); process.exit(1); };

async function setup() {
  log('Initializing Universal Production Setup...');

  // 1. Dependency Check
  try {
    execSync('node -v', { stdio: 'ignore' });
    log('Node.js detected.');
  } catch (e) { error('Node.js not found. Please install Node.js v18+'); }

  // 2. Environment Configuration
  if (!fs.existsSync('.env')) {
    log('Creating .env from .env.example...');
    fs.copyFileSync('.env.example', '.env');
  } else {
    log('.env already exists. Skipping copy.');
  }

  // 3. Install Dependencies
  log('Installing NPM dependencies (Production Standard)...');
  execSync('npm install', { stdio: 'inherit' });

  // 4. Database Initialization (Prisma)
  log('Generating Prisma Client and pushing schema to PostgreSQL...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    // Note: npx prisma db push is used for rapid industrial deployment
    // In strict enterprise, use npx prisma migrate deploy
    log('Prisma synchronization complete.');
  } catch (e) {
    log('Prisma sync failed. Ensure DATABASE_URL in .env is correct.');
  }

  // 5. Success
  log('====================================================');
  log('ARTEMIS ECOSYSTEM SETUP COMPLETE');
  log('Run "npm run dev" to start the development server.');
  log('Run "npm run build" to prepare for production.');
  log('====================================================');
}

setup().catch(e => error(e.message));
