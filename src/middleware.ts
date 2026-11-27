import { NextRequest, NextResponse } from "next/server";
import {
  getSessionFromRequest,
  hasStaffRole,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_API_BODY_BYTES = 65_536; // 64 KB

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const PUBLIC_PAGE_EXACT = new Set<string>([
  "/",
  "/about",
  "/blog",
  "/business",
  "/cancellation-policy",
  "/contact",
  "/faq",
  "/fleet",
  "/how-it-works",
  "/invest",
  "/investor-disclosures",
  "/locations",
  "/privacy-policy",
  "/refund-policy",
  "/rental-policy",
  "/rentals",
  "/riders",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/opengraph-image.jpg",
  "/twitter-image.jpg",
  "/icon.png",
  "/apple-icon.png",
]);

const PUBLIC_PAGE_PREFIXES = ["/blog/"];

const PUBLIC_API_ALLOWLIST: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ["/api/health", new Set(["GET"])],
  ["/api/public/catalog", new Set(["GET"])],
  ["/api/bookings", new Set(["POST"])],
  ["/api/business/register", new Set(["POST"])],
  ["/api/investor/enquiries", new Set(["POST"])],
  ["/api/leads", new Set(["POST"])],
]);

function isPublicPage(pathname: string): boolean {
  if (PUBLIC_PAGE_EXACT.has(pathname)) return true;
  return PUBLIC_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicApi(pathname: string, method: string): boolean {
  const allowedMethods = PUBLIC_API_ALLOWLIST.get(pathname);
  if (!allowedMethods) return false;
  return allowedMethods.has(method.toUpperCase());
}

function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes(`${SESSION_COOKIE_NAME}=`);
}

function validateSameOriginForCsrf(request: NextRequest): boolean {
  const expectedOrigin = request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === expectedOrigin;
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin;
    } catch {
      return false;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. API protection: body size cap, rate limit, CSRF, allowlist & deny-by-default authz
  if (pathname.startsWith("/api/")) {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_API_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    const shouldRateLimit =
      process.env.VITEST !== "true" ||
      request.headers.get("x-test-ratelimit") === "1";
    if (shouldRateLimit) {
      const ip = getClientIp(request);
      const isWrite = STATE_CHANGING_METHODS.has(method);
      const rl = checkRateLimit(
        `${ip}:${isWrite ? "write" : "read"}:${pathname}`,
        isWrite ? 20 : 120,
        60_000
      );
      if (!rl.allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(rl.retryAfterSeconds) },
          }
        );
      }
    }

    // CSRF protection for cookie-authenticated state-changing requests (without Bearer token)
    const hasBearer =
      request.headers.get("authorization")?.toLowerCase().startsWith("bearer ") ??
      false;
    if (
      STATE_CHANGING_METHODS.has(method) &&
      !hasBearer &&
      hasSessionCookie(request) &&
      !validateSameOriginForCsrf(request)
    ) {
      return NextResponse.json(
        { error: "CSRF validation failed: invalid origin" },
        { status: 403 }
      );
    }

    if (isPublicApi(pathname, method)) {
      return NextResponse.next();
    }

    // Deny-by-default for all non-allowlisted API routes/methods
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (isAdminPath(pathname) && !hasStaffRole(session)) {
      return NextResponse.json(
        { error: "Forbidden: staff role required" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 2. Allow explicitly allowlisted public pages
  if (isPublicPage(pathname)) {
    return NextResponse.next();
  }

  // 3. Deny-by-default for all non-allowlisted frontend routes (/admin, /dashboard, /portal, etc.)
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (isAdminPath(pathname) && !hasStaffRole(session)) {
    return NextResponse.json(
      { error: "Forbidden: staff role required" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
