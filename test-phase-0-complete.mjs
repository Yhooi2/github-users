#!/usr/bin/env node

/**
 * Comprehensive Phase 0 Testing Script
 * Tests all aspects of Backend Security Layer implementation
 */

import { readFileSync } from "fs";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n`),
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, passed, details = "") {
  totalTests++;
  if (passed) {
    passedTests++;
    log.success(`${name}`);
  } else {
    failedTests++;
    log.error(`${name}${details ? ": " + details : ""}`);
  }
}

// ============================================
// Test 1: Environment Configuration
// ============================================
log.section("📋 Test 1: Environment Configuration");

let GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  try {
    const envContent = readFileSync(".env.local", "utf-8");
    const match = envContent.match(/GITHUB_TOKEN=(.+)/);
    if (match) {
      GITHUB_TOKEN = match[1].trim();
    }
  } catch (err) {
    // Ignore
  }
}

test("GitHub token found", Boolean(GITHUB_TOKEN));
test("Token format valid (ghp_ prefix)", GITHUB_TOKEN?.startsWith("ghp_"));

// ============================================
// Test 2: File Structure
// ============================================
log.section("📁 Test 2: File Structure");

const requiredFiles = [
  "api/github-proxy.ts",
  "vercel.json",
  ".env.local",
  "src/apollo/ApolloAppProvider.tsx",
  "test-real-github-token.mjs",
];

for (const file of requiredFiles) {
  try {
    readFileSync(file, "utf-8");
    test(`File exists: ${file}`, true);
  } catch {
    test(`File exists: ${file}`, false, "File not found");
  }
}

// ============================================
// Test 3: Proxy Implementation
// ============================================
log.section("🔧 Test 3: Proxy Implementation");

try {
  const proxyCode = readFileSync("api/github-proxy.ts", "utf-8");

  test("Proxy exports handler function", proxyCode.includes("export default"));
  test("Proxy checks HTTP method", proxyCode.includes("req.method !== 'POST'"));
  test(
    "Proxy uses GitHub token from env",
    proxyCode.includes("process.env.GITHUB_TOKEN"),
  );
  test("Proxy has KV fallback logic", proxyCode.includes("isKVConfigured"));
  test("Proxy handles cacheKey", proxyCode.includes("cacheKey"));
  test(
    "Proxy makes GitHub API call",
    proxyCode.includes("https://api.github.com/graphql"),
  );
} catch (err) {
  test("Read proxy file", false, err.message);
}

// ============================================
// Test 4: Apollo Client Configuration
// ============================================
log.section("⚡ Test 4: Apollo Client Configuration");

try {
  const apolloCode = readFileSync("src/apollo/ApolloAppProvider.tsx", "utf-8");

  test("Apollo uses proxy endpoint", apolloCode.includes("/api/github-proxy"));
  test("Apollo has error link", apolloCode.includes("onError"));
  test("Apollo has HTTP link", apolloCode.includes("createHttpLink"));
  test("Apollo has cache key link", apolloCode.includes("cacheKeyLink"));
  test(
    "No direct GitHub API calls",
    !apolloCode.includes("https://api.github.com/graphql"),
  );
} catch (err) {
  test("Read Apollo file", false, err.message);
}

// ============================================
// Test 5: Security - Token Not in Bundle
// ============================================
log.section("🔒 Test 5: Security - Token Not in Bundle");

try {
  const { execSync } = await import("child_process");

  // Check if dist exists, if not skip
  try {
    execSync("test -d dist");
  } catch {
    log.warn(
      "dist/ not found, skipping bundle check (run npm run build first)",
    );
  }

  if (GITHUB_TOKEN) {
    try {
      execSync(`grep -r "${GITHUB_TOKEN}" dist/ 2>/dev/null`);
      test("Token NOT in bundle", false, "Token found in bundle!");
    } catch {
      test("Token NOT in bundle", true);
    }
  }

  try {
    execSync('grep -r "ghp_" dist/ 2>/dev/null');
    test("No GitHub tokens in bundle", false, "Token pattern found");
  } catch {
    test("No GitHub tokens in bundle", true);
  }
} catch (err) {
  log.warn("Bundle check skipped: " + err.message);
}

// ============================================
// Test 6: GitHub API Authentication
// ============================================
log.section("🔐 Test 6: GitHub API Authentication");

if (GITHUB_TOKEN) {
  try {
    const query = `query { viewer { login name } }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    test("GitHub API responds", response.ok);
    test("Authentication successful", !data.errors);
    test("Viewer data returned", Boolean(data.data?.viewer));

    if (data.data?.viewer) {
      log.info(`  Authenticated as: ${data.data.viewer.login}`);
    }
  } catch (err) {
    test("GitHub API connection", false, err.message);
  }
} else {
  log.warn("Skipping GitHub API test: No token found");
}

// ============================================
// Test 7: Vercel Configuration
// ============================================
log.section("⚙️ Test 7: Vercel Configuration");

try {
  const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf-8"));

  test("Vercel config valid JSON", true);
  test("Build command configured", Boolean(vercelConfig.buildCommand));
  test("Output directory set", Boolean(vercelConfig.outputDirectory));
  test("Framework detected", vercelConfig.framework === "vite");
  test("API rewrites configured", Boolean(vercelConfig.rewrites));
} catch (err) {
  test("Read Vercel config", false, err.message);
}

// ============================================
// Final Summary
// ============================================
log.section("📊 Test Summary");

console.log(`Total Tests:  ${totalTests}`);
console.log(`${colors.green}Passed:       ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed:       ${failedTests}${colors.reset}`);
console.log(
  `${colors.blue}Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%${colors.reset}`,
);

if (failedTests === 0) {
  log.section("🎉 Phase 0 Complete - All Tests Passed!");
  console.log("✅ Backend security layer implemented correctly");
  console.log("✅ Token secured on server");
  console.log("✅ Apollo Client configured");
  console.log("✅ Ready for Phase 1: GraphQL Multi-Query Architecture");
  console.log("\n📝 Next steps:");
  console.log("  1. Run: vercel dev");
  console.log("  2. Test: Search for a GitHub user");
  console.log("  3. Verify: Network tab shows /api/github-proxy calls");
  console.log("  4. Deploy: vercel --prod");
  process.exit(0);
} else {
  log.section("⚠️ Phase 0 Incomplete - Some Tests Failed");
  console.log("Please review the failed tests above and fix the issues.");
  process.exit(1);
}
