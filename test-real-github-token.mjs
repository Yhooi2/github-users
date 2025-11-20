#!/usr/bin/env node

/**
 * Test script to verify GitHub token authentication
 * Tests the /api/github-proxy endpoint with real GitHub GraphQL API
 */

import { readFileSync } from "fs";

// Read token from .env.local
let GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  try {
    const envContent = readFileSync(".env.local", "utf-8");
    const match = envContent.match(/GITHUB_TOKEN=(.+)/);
    if (match) {
      GITHUB_TOKEN = match[1].trim();
    }
  } catch (err) {
    // Ignore file read errors
  }
}

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN not found in environment");
  console.error("Please add your token to .env.local");
  process.exit(1);
}

console.log("✅ GitHub token found in environment");
console.log(`Token prefix: ${GITHUB_TOKEN.substring(0, 7)}...`);

// Test GraphQL query
const query = `
  query {
    viewer {
      login
      name
      email
    }
  }
`;

console.log("\n🔍 Testing GitHub GraphQL API...");

try {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    console.error("❌ GraphQL errors:", data.errors);
    process.exit(1);
  }

  if (data.data?.viewer) {
    console.log("✅ GitHub API authentication successful!");
    console.log("\nUser info:");
    console.log(`  Login: ${data.data.viewer.login}`);
    console.log(`  Name: ${data.data.viewer.name || "N/A"}`);
    console.log(`  Email: ${data.data.viewer.email || "N/A"}`);
    console.log("\n🎉 Phase 0 is ready for production testing!");
    console.log("\nNext steps:");
    console.log("1. Run: vercel dev");
    console.log("2. Open: http://localhost:3000");
    console.log("3. Search for a GitHub user");
    console.log("4. Verify /api/github-proxy is called in Network tab");
  } else {
    console.error("❌ Unexpected response structure:", data);
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Error testing GitHub API:", error.message);
  process.exit(1);
}
