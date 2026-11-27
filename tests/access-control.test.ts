import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";
import {
  AuthorizationError,
  requireAuth,
  requireRole,
  requireSelfOrStaff,
  requireStaff,
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
} from "../src/lib/auth";
import { query, resetDbForTests } from "../src/lib/db";
import { updateSiteSetting } from "../src/lib/settings";
import {
  GET as adminSettingsGet,
  PUT as adminSettingsPut,
} from "../src/app/api/admin/settings/route";

const TEST_SECRET = "aurum-test-secret-minimum-32-chars-long";

function makeNextRequest(
  path: string,
  options: { method?: string; token?: string; asCookie?: boolean } = {}
): NextRequest {
  const headers = new Headers();
  if (options.token) {
    if (options.asCookie) {
      headers.set("cookie", `${SESSION_COOKIE_NAME}=${options.token}`);
    } else {
      headers.set("authorization", `Bearer ${options.token}`);
    }
  }
  return new NextRequest(`http://localhost:3000${path}`, {
    method: options.method ?? "GET",
    headers,
  });
}

describe("Broken Access Control & Deny-by-Default Regression Suite", () => {
  beforeAll(async () => {
    process.env.VITEST = "true";
    process.env.DATABASE_URL = "pglite://memory";
    await resetDbForTests();
    await query("SELECT 1");
  });

  beforeEach(() => {
    process.env.AUTH_SECRET = TEST_SECRET;
  });

  describe("Middleware: Deny-by-Default Enforcement", () => {
    it("denies unauthenticated requests to protected and unknown API routes with 401", async () => {
      const protectedApis = [
        "/api/admin/settings",
        "/api/admin/users",
        "/api/bookings/123",
        "/api/internal/metrics",
      ];

      for (const path of protectedApis) {
        const res = await middleware(makeNextRequest(path));
        expect(res.status, `${path} should return 401`).toBe(401);
      }
    });

    it("denies non-allowlisted HTTP methods on public API routes with 401", async () => {
      const disallowedMethodCalls: Array<[string, string]> = [
        ["GET", "/api/bookings"],
        ["DELETE", "/api/bookings"],
        ["GET", "/api/leads"],
        ["GET", "/api/business/register"],
        ["GET", "/api/investor/enquiries"],
        ["POST", "/api/public/catalog"],
        ["POST", "/api/health"],
      ];

      for (const [method, path] of disallowedMethodCalls) {
        const res = await middleware(makeNextRequest(path, { method }));
        expect(res.status, `${method} ${path} should return 401`).toBe(401);
      }
    });

    it("denies unauthenticated requests to non-allowlisted frontend routes (/admin, /dashboard, /portal)", async () => {
      const protectedPages = ["/admin", "/admin/settings", "/dashboard", "/portal", "/unknown-private"];

      for (const path of protectedPages) {
        const res = await middleware(makeNextRequest(path));
        expect(res.status, `${path} should return 401`).toBe(401);
      }
    });

    it("rejects tampered, malformed, or wrong-secret JWTs with 401", async () => {
      const wrongSecretToken = await signSessionToken(
        { userId: "admin-1", roles: ["super_admin"] },
        { secret: "different-secret-that-is-32-chars!" }
      );

      for (const badToken of ["not.a.jwt", wrongSecretToken]) {
        const res = await middleware(
          makeNextRequest("/api/admin/settings", { token: badToken })
        );
        expect(res.status).toBe(401);
      }
    });

    it("fails closed (401) when AUTH_SECRET is missing or too short", async () => {
      const validToken = await signSessionToken({
        userId: "admin-1",
        roles: ["admin"],
      });
      delete process.env.AUTH_SECRET;
      delete process.env.JWT_SECRET;

      expect(await verifySessionToken(validToken)).toBeNull();
      const res = await middleware(
        makeNextRequest("/api/admin/settings", { token: validToken })
      );
      expect(res.status).toBe(401);
    });

    it("denies authenticated non-staff users from admin endpoints and admin pages with 403", async () => {
      const customerToken = await signSessionToken({
        userId: "cust-1",
        email: "rider@example.com",
        roles: ["customer"],
      });

      const apiRes = await middleware(
        makeNextRequest("/api/admin/settings", { token: customerToken })
      );
      expect(apiRes.status).toBe(403);

      const pageRes = await middleware(
        makeNextRequest("/admin", { token: customerToken, asCookie: true })
      );
      expect(pageRes.status).toBe(403);
    });

    it("allows authenticated staff users to pass middleware for admin routes", async () => {
      const adminToken = await signSessionToken({
        userId: "staff-1",
        email: "ops@aurumfleets.com",
        roles: ["admin"],
      });

      const apiRes = await middleware(
        makeNextRequest("/api/admin/settings", { token: adminToken, asCookie: true })
      );
      expect(apiRes.status).toBe(200);

      const pageRes = await middleware(
        makeNextRequest("/admin/settings", { token: adminToken })
      );
      expect(pageRes.status).toBe(200);
    });

    it("allows explicitly allowlisted public pages and public API methods", async () => {
      const publicChecks: Array<[string, string]> = [
        ["GET", "/"],
        ["GET", "/invest"],
        ["GET", "/blog/ev-fleet-launch"],
        ["GET", "/api/health"],
        ["GET", "/api/public/catalog"],
        ["POST", "/api/bookings"],
        ["POST", "/api/leads"],
      ];

      for (const [method, path] of publicChecks) {
        const res = await middleware(makeNextRequest(path, { method }));
        expect(res.status, `${method} ${path} should pass middleware`).toBe(200);
      }
    });
  });

  describe("Server-Side Endpoint & Domain Authorization (Defense in Depth)", () => {
    it("enforces auth & staff role directly inside /api/admin/settings handlers", async () => {
      // Unauthenticated GET & PUT -> 401
      const unauthGet = await adminSettingsGet(
        new Request("http://localhost:3000/api/admin/settings")
      );
      expect(unauthGet.status).toBe(401);

      const unauthPut = await adminSettingsPut(
        new Request("http://localhost:3000/api/admin/settings", {
          method: "PUT",
          body: JSON.stringify({ key: "contact_settings", value: {} }),
        })
      );
      expect(unauthPut.status).toBe(401);

      // Authenticated non-staff -> 403
      const investorToken = await signSessionToken({
        userId: "inv-1",
        roles: ["investor"],
      });
      const forbiddenGet = await adminSettingsGet(
        new Request("http://localhost:3000/api/admin/settings", {
          headers: { authorization: `Bearer ${investorToken}` },
        })
      );
      expect(forbiddenGet.status).toBe(403);

      const forbiddenPut = await adminSettingsPut(
        new Request("http://localhost:3000/api/admin/settings", {
          method: "PUT",
          headers: { authorization: `Bearer ${investorToken}` },
          body: JSON.stringify({ key: "contact_settings", value: {} }),
        })
      );
      expect(forbiddenPut.status).toBe(403);

      // Authenticated staff -> 200
      const staffToken = await signSessionToken({
        userId: "00000000-0000-0000-0000-000000000001",
        roles: ["super_admin"],
      });
      const okGet = await adminSettingsGet(
        new Request("http://localhost:3000/api/admin/settings", {
          headers: { authorization: `Bearer ${staffToken}` },
        })
      );
      expect(okGet.status).toBe(200);
    });

    it("prevents IDOR via requireSelfOrStaff", async () => {
      const custAToken = await signSessionToken({
        userId: "user-A",
        roles: ["customer"],
      });
      const staffToken = await signSessionToken({
        userId: "staff-1",
        roles: ["customer_support"],
      });

      const reqCustA = new Request("http://localhost:3000/api/bookings/user-B", {
        headers: { authorization: `Bearer ${custAToken}` },
      });
      const crossUser = await requireSelfOrStaff(reqCustA, "user-B");
      expect(crossUser.response?.status).toBe(403);

      const ownUser = await requireSelfOrStaff(reqCustA, "user-A");
      expect(ownUser.session?.userId).toBe("user-A");

      const reqStaff = new Request("http://localhost:3000/api/bookings/user-B", {
        headers: { authorization: `Bearer ${staffToken}` },
      });
      const staffAccess = await requireSelfOrStaff(reqStaff, "user-B");
      expect(staffAccess.session?.userId).toBe("staff-1");
    });

    it("enforces requireAuth, requireRole, and requireStaff helpers", async () => {
      const noAuth = await requireAuth(new Request("http://localhost:3000/api/x"));
      expect(noAuth.response?.status).toBe(401);

      const bizToken = await signSessionToken({
        userId: "biz-1",
        roles: ["business_member"],
      });
      const roleCheck = await requireRole(
        new Request("http://localhost:3000/api/x", {
          headers: { authorization: `Bearer ${bizToken}` },
        }),
        ["finance_manager"]
      );
      expect(roleCheck.response?.status).toBe(403);

      const staffCheck = await requireStaff(
        new Request("http://localhost:3000/api/x", {
          headers: { authorization: `Bearer ${bizToken}` },
        })
      );
      expect(staffCheck.response?.status).toBe(403);
    });

    it("rejects unauthorized updateSiteSetting calls at the domain layer", async () => {
      await expect(
        updateSiteSetting("contact_settings", {}, "Unauthorized", null)
      ).rejects.toThrow(AuthorizationError);

      await expect(
        updateSiteSetting("contact_settings", {}, "Customer attempt", {
          userId: "cust-1",
          roles: ["customer"],
        })
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
