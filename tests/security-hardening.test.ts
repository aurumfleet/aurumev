import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";
import {
  buildSessionCookieHeader,
  SESSION_COOKIE_NAME,
  signSessionToken,
} from "../src/lib/auth";
import { generateReferenceCode } from "../src/lib/api-helpers";
import { resetRateLimitsForTests } from "../src/lib/rate-limit";
import nextConfig from "../next.config";

const TEST_SECRET = "aurum-test-secret-minimum-32-chars-long";

describe("Security Hardening Regression Suite (Rate Limit, CSRF, CSP/HSTS, Crypto IDs)", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = TEST_SECRET;
    resetRateLimitsForTests();
  });

  it("enforces rate limiting (429 + Retry-After) on repeated POST requests", async () => {
    for (let i = 0; i < 20; i++) {
      const res = await middleware(
        new NextRequest("http://localhost:3000/api/leads", {
          method: "POST",
          headers: {
            "x-forwarded-for": "203.0.113.10",
            "x-test-ratelimit": "1",
          },
        })
      );
      expect(res.status).toBe(200);
    }

    const blocked = await middleware(
      new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "x-forwarded-for": "203.0.113.10",
          "x-test-ratelimit": "1",
        },
      })
    );
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThanOrEqual(1);
  });

  it("rejects oversized API payloads (413 Payload Too Large)", async () => {
    const res = await middleware(
      new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        headers: { "content-length": "1048576" },
      })
    );
    expect(res.status).toBe(413);
  });

  it("enforces CSRF Origin validation on cookie-authenticated state-changing requests", async () => {
    const adminToken = await signSessionToken({
      userId: "staff-1",
      roles: ["admin"],
    });

    // Cross-origin cookie request -> 403
    const crossOrigin = await middleware(
      new NextRequest("http://localhost:3000/api/admin/settings", {
        method: "PUT",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${adminToken}`,
          origin: "https://evil.example",
        },
      })
    );
    expect(crossOrigin.status).toBe(403);

    // Missing Origin & Referer on cookie request -> 403
    const missingOrigin = await middleware(
      new NextRequest("http://localhost:3000/api/admin/settings", {
        method: "PUT",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${adminToken}`,
        },
      })
    );
    expect(missingOrigin.status).toBe(403);

    // Same-origin cookie request -> 200
    const sameOrigin = await middleware(
      new NextRequest("http://localhost:3000/api/admin/settings", {
        method: "PUT",
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${adminToken}`,
          origin: "http://localhost:3000",
        },
      })
    );
    expect(sameOrigin.status).toBe(200);
  });

  it("builds session cookies with HttpOnly, SameSite=Lax, Path=/, and Secure in production", () => {
    const prevEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const cookie = buildSessionCookieHeader("tok-123");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Secure");
    (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
  });

  it("uses cryptographic reference codes and no Math.random() in API routes", () => {
    const code = generateReferenceCode("BK");
    expect(code).toMatch(/^BK-\d{6}-\d{6}$/);

    const apiDir = path.join(process.cwd(), "src", "app", "api");
    const stack = [apiDir];
    while (stack.length > 0) {
      const dir = stack.pop()!;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(full, "utf-8");
          expect(content.includes("Math.random"), `Math.random found in ${full}`).toBe(false);
        }
      }
    }
  });

  it("configures Content-Security-Policy, HSTS, X-Frame-Options, and nosniff headers", async () => {
    const headerGroups = await nextConfig.headers!();
    const globalHeaders = headerGroups[0].headers;
    const keys = globalHeaders.map((h) => h.key);
    expect(keys).toContain("Content-Security-Policy");
    expect(keys).toContain("Strict-Transport-Security");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("X-Frame-Options");
  });
});
