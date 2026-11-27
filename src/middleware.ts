import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, hasStaffRole } from "@/lib/auth";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. Allow explicitly allowlisted public API (method + path)
  if (pathname.startsWith("/api/")) {
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
