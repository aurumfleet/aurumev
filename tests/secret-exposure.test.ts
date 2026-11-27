import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { verifySessionToken } from "../src/lib/auth";

const ROOT = process.cwd();

const CONFIDENTIAL_ENV_NAMES = [
  "AUTH_SECRET",
  "JWT_SECRET",
  "DATABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SMTP_PASS",
  "SMS_API_KEY",
  "WHATSAPP_API_TOKEN",
  "PAYMENT_GATEWAY_KEY_ID",
  "PAYMENT_GATEWAY_KEY_SECRET",
  "PAYMENT_GATEWAY_WEBHOOK_SECRET",
];

const SECRET_VALUE_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: "Stripe live key", regex: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
  { name: "Stripe test key", regex: /\bsk_test_[A-Za-z0-9]{16,}\b/ },
  { name: "Google API key", regex: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "GitHub token", regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { name: "Slack token", regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Private key block", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    name: "Hardcoded Postgres credentials",
    regex: /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@[^/\s]+/i,
  },
];

function walkFiles(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

describe("Credential & Secret Exposure Prevention Suite", () => {
  it("ensures no client component references confidential environment variables", () => {
    const srcFiles = walkFiles(path.join(ROOT, "src"), [".ts", ".tsx"]);
    const clientFiles = srcFiles.filter((file) => {
      const head = fs.readFileSync(file, "utf-8").slice(0, 200);
      return head.includes('"use client"') || head.includes("'use client'");
    });

    expect(clientFiles.length).toBeGreaterThan(0);

    for (const file of clientFiles) {
      const content = fs.readFileSync(file, "utf-8");
      for (const secretVar of CONFIDENTIAL_ENV_NAMES) {
        expect(
          content.includes(secretVar),
          `Client component ${path.relative(ROOT, file)} must not reference ${secretVar}`
        ).toBe(false);
      }

      // Any process.env.* inside a client component must be NEXT_PUBLIC_ or NODE_ENV
      const envMatches = content.matchAll(/process\.env\.([A-Z0-9_]+)/g);
      for (const m of envMatches) {
        const varName = m[1];
        expect(
          varName.startsWith("NEXT_PUBLIC_") || varName === "NODE_ENV",
          `Client component ${path.relative(ROOT, file)} accesses non-public env var ${varName}`
        ).toBe(true);
      }
    }
  });

  it("ensures no hardcoded API keys, private keys, or DB passwords exist in src/ or scripts/", () => {
    const codeFiles = [
      ...walkFiles(path.join(ROOT, "src"), [".ts", ".tsx"]),
      ...walkFiles(path.join(ROOT, "scripts"), [".ts"]),
    ];

    for (const file of codeFiles) {
      const content = fs.readFileSync(file, "utf-8");
      for (const pattern of SECRET_VALUE_PATTERNS) {
        expect(
          pattern.regex.test(content),
          `${pattern.name} found in ${path.relative(ROOT, file)}`
        ).toBe(false);
      }
    }
  });

  it("ensures .env.example has empty AUTH_SECRET and .gitignore ignores .env files", () => {
    const envExample = fs.readFileSync(path.join(ROOT, ".env.example"), "utf-8");
    expect(envExample).toMatch(/^AUTH_SECRET=\s*$/m);

    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env");
    expect(gitignore).toContain(".env.local");
  });

  it("ensures production static JS bundles (.next/static) contain no confidential secret names or values", () => {
    const staticDir = path.join(ROOT, ".next", "static");
    if (!fs.existsSync(staticDir)) return;

    const jsFiles = walkFiles(staticDir, [".js"]);
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, "utf-8");
      for (const secretVar of CONFIDENTIAL_ENV_NAMES) {
        expect(
          content.includes(secretVar),
          `Client bundle ${path.relative(ROOT, file)} leaked ${secretVar}`
        ).toBe(false);
      }
      for (const pattern of SECRET_VALUE_PATTERNS) {
        expect(
          pattern.regex.test(content),
          `Client bundle ${path.relative(ROOT, file)} matched ${pattern.name}`
        ).toBe(false);
      }
    }
  });

  it("rejects known placeholder secrets at runtime", async () => {
    const prev = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "aurum-dev-secret-change-in-production-min-32-chars";
    expect(await verifySessionToken("eyJhbGciOiJIUzI1NiJ9.e30.abc")).toBeNull();
    if (prev !== undefined) {
      process.env.AUTH_SECRET = prev;
    } else {
      delete process.env.AUTH_SECRET;
    }
  });
});
