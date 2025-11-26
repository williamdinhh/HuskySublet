#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking HuskySublet Setup...\n');

// Check 1: Server .env file
const serverEnvPath = join(__dirname, 'server', '.env');
if (existsSync(serverEnvPath)) {
  console.log('✅ Server .env file exists');
  try {
    const envContent = readFileSync(serverEnvPath, 'utf8');
    if (envContent.includes('MONGODB_URI=')) {
      const mongoUri = envContent.match(/MONGODB_URI=(.+)/)?.[1];
      if (mongoUri && !mongoUri.includes('your-')) {
        console.log('✅ MongoDB URI is configured');
        if (mongoUri.includes('mongodb+srv://')) {
          console.log('   → Using MongoDB Atlas (cloud)');
        } else if (mongoUri.includes('localhost')) {
          console.log('   → Using local MongoDB');
          console.log('   ⚠️  Make sure MongoDB is running: brew services start mongodb-community');
        }
      } else {
        console.log('❌ MongoDB URI needs to be configured in server/.env');
      }
    }
    if (envContent.includes('JWT_SECRET=')) {
      const jwtSecret = envContent.match(/JWT_SECRET=(.+)/)?.[1];
      if (jwtSecret && jwtSecret !== 'your-super-secret-jwt-key-change-this-in-production') {
        console.log('✅ JWT Secret is configured');
      } else {
        console.log('⚠️  JWT Secret is using default - change it for security');
      }
    }
  } catch (error) {
    console.log('❌ Error reading .env file');
  }
} else {
  console.log('❌ Server .env file not found');
  console.log('   → Create it from server/env.example');
}

// Check 2: Node modules
const serverNodeModules = join(__dirname, 'server', 'node_modules');
const clientNodeModules = join(__dirname, 'node_modules');

if (existsSync(serverNodeModules)) {
  console.log('✅ Server dependencies installed');
} else {
  console.log('❌ Server dependencies not installed');
  console.log('   → Run: cd server && npm install');
}

if (existsSync(clientNodeModules)) {
  console.log('✅ Frontend dependencies installed');
} else {
  console.log('❌ Frontend dependencies not installed');
  console.log('   → Run: npm install');
}

// Check 3: Key files
const keyFiles = [
  'src/App.tsx',
  'src/AppRouter.tsx',
  'src/BrowseApp.tsx',
  'src/BrowseApp.css',
  'src/contexts/AuthContext.tsx',
  'src/pages/Login.tsx',
  'server/server.js',
];

console.log('\n📁 Checking key files...');
keyFiles.forEach(file => {
  const path = join(__dirname, file);
  if (existsSync(path)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n📝 Next Steps:');
console.log('1. Make sure MongoDB is running or configure MongoDB Atlas');
console.log('2. Update server/.env with your MongoDB connection string');
console.log('3. Start backend: cd server && npm run dev');
console.log('4. Start frontend: npm run dev (in new terminal)');
console.log('\n📚 See MONGODB_SETUP.md for MongoDB setup help\n');
