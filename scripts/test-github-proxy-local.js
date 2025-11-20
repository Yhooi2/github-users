#!/usr/bin/env node
// Simple test script to call GitHub GraphQL using GITHUB_TOKEN from .env
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env if present
const dotenvPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(dotenvPath)) {
  const dotenv = fs.readFileSync(dotenvPath, 'utf8');
  for (const line of dotenv.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2];
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
function mask(t) {
  if (!t) return '<none>';
  return `${t.slice(0,4)}...${t.slice(-4)}`;
}

console.log('Using token:', mask(token));
if (!token) {
  console.error('No GITHUB_TOKEN found in environment or .env');
  process.exit(1);
}

const query = `query { viewer { login } }`;

async function run() {
  try {
    console.log('Calling GitHub GraphQL...');
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    console.log('Response status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Response JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response text:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(2);
  }
}

run();
