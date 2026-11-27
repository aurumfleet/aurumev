import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "aurum_session";

export function buildSessionCookieHeader(
  token: string,
  maxAgeSeconds = 60 * 60 * 8
): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export const STAFF_ROLES = [
  "super_admin",
  "admin",
  "operations_manager",
  "fleet_manager",
  "finance_manager",
  "marketing_manager",
  "customer_support",
  "sales_executive",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
export type AppRole = StaffRole | "customer" | "business_member" | "investor";

export interface AuthSession {
  userId: string;
  email?: string;
  roles: AppRole[];
}

export class AuthorizationError extends Error {
  readonly status: number;

  constructor(message = "Forbidden", status = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

const JWT_ISSUER = "aurum-ev";
const JWT_AUDIENCE = "aurum-ev-api";

const KNOWN_WEAK_SECRETS = new Set([
  "aurum-dev-secret-change-in-production-min-32-chars",
  "changeme",
  "secret",
  "development-secret",
]);

function getEncodedSecret(overrideSecret?: string): Uint8Array | null {
  const raw =
    overrideSecret?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.JWT_SECRET?.trim();

  if (!raw || raw.length < 16 || KNOWN_WEAK_SECRETS.has(raw)) {
    return null;
  }
  return new TextEncoder().encode(raw);
}

export function isStaffRole(role: string): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

export function hasStaffRole(session: AuthSession | null | undefined): boolean {
  if (!session || !Array.isArray(session.roles)) return false;
  return session.roles.some((r) => isStaffRole(r));
}

export function hasAnyRole(
  session: AuthSession | null | undefined,
  allowedRoles: readonly AppRole[]
): boolean {
  if (!session || !Array.isArray(session.roles)) return false;
  return session.roles.some((r) => allowedRoles.includes(r));
}

export async function signSessionToken(
  session: AuthSession,
  options?: { expiresIn?: string; secret?: string }
): Promise<string> {
  const secret = getEncodedSecret(options?.secret);
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured (minimum 16 characters required).");
  }

  return new SignJWT({
    email: session.email,
    roles: session.roles,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(options?.expiresIn ?? "8h")
    .sign(secret);
}

export async function verifySessionToken(
  token: string | undefined | null,
  overrideSecret?: string
): Promise<AuthSession | null> {
  if (!token || typeof token !== "string") return null;

  const secret = getEncodedSecret(overrideSecret);
  if (!secret) {
    // Fail-closed: if no valid signing secret is configured, reject all tokens
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || payload.sub.trim() === "") {
      return null;
    }

    const rawRoles = Array.isArray(payload.roles)
      ? payload.roles.filter((r): r is AppRole => typeof r === "string")
      : [];

    if (rawRoles.length === 0) {
      return null;
    }

    return {
      userId: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      roles: rawRoles,
    };
  } catch {
    return null;
  }
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const parts = cookieHeader.split(";");
    for (const part of parts) {
      const idx = part.indexOf("=");
      if (idx === -1) continue;
      const name = part.slice(0, idx).trim();
      if (name === SESSION_COOKIE_NAME) {
        const val = decodeURIComponent(part.slice(idx + 1).trim());
        if (val) return val;
      }
    }
  }

  return null;
}

export async function getSessionFromRequest(
  request: Request
): Promise<AuthSession | null> {
  const token = extractTokenFromRequest(request);
  return verifySessionToken(token);
}

export async function requireAuth(
  request: Request
): Promise<
  | { session: AuthSession; response?: never }
  | { session?: never; response: NextResponse }
> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return {
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export async function requireRole(
  request: Request,
  allowedRoles: readonly AppRole[]
): Promise<
  | { session: AuthSession; response?: never }
  | { session?: never; response: NextResponse }
> {
  const auth = await requireAuth(request);
  if (auth.response) return auth;

  if (!hasAnyRole(auth.session, allowedRoles)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { session: auth.session };
}

export async function requireStaff(request: Request) {
  return requireRole(request, STAFF_ROLES);
}

export async function requireSelfOrStaff(
  request: Request,
  resourceOwnerId: string
): Promise<
  | { session: AuthSession; response?: never }
  | { session?: never; response: NextResponse }
> {
  const auth = await requireAuth(request);
  if (auth.response) return auth;

  if (auth.session.userId !== resourceOwnerId && !hasStaffRole(auth.session)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: resource access denied" },
        { status: 403 }
      ),
    };
  }

  return { session: auth.session };
}

export function assertStaffSession(
  session: AuthSession | null | undefined
): asserts session is AuthSession {
  if (!session) {
    throw new AuthorizationError("Authentication required", 401);
  }
  if (!hasStaffRole(session)) {
    throw new AuthorizationError("Forbidden: staff role required", 403);
  }
}
