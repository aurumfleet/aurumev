import { NextResponse } from "next/server";
import { z } from "zod";
import { queryOne } from "@/lib/db";
import { hasStaffRole, requireAuth, type AuthSession } from "@/lib/auth";

const uuidSchema = z.string().uuid();

export function isValidUuid(id: string): boolean {
  return uuidSchema.safeParse(id).success;
}

export interface BookingRow {
  id: string;
  booking_number: string;
  customer_id: string | null;
  location_id: string;
  vehicle_model_id: string | null;
  rental_plan_id: string | null;
  vehicle_category: string;
  duration_type: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
}

export interface DocumentRow {
  id: string;
  user_id: string;
  business_id: string | null;
  document_type: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  verification_status: string;
  created_at: string;
}

export interface BusinessRow {
  id: string;
  company_name: string;
  owner_user_id: string | null;
  verification_status: string;
  city: string;
}

type AuthzResult<T> =
  | { session: AuthSession; resource: T; response?: never }
  | { session?: never; resource?: never; response: NextResponse };

export async function authorizeBookingAccess(
  request: Request,
  bookingId: string
): Promise<AuthzResult<BookingRow>> {
  const auth = await requireAuth(request);
  if (auth.response) return auth;

  if (!isValidUuid(bookingId)) {
    return {
      response: NextResponse.json({ error: "Invalid booking ID" }, { status: 400 }),
    };
  }

  const booking = await queryOne<BookingRow>(
    `SELECT id, booking_number, customer_id, location_id, vehicle_model_id, rental_plan_id,
            vehicle_category, duration_type, start_date::text, end_date::text,
            customer_name, customer_email, customer_phone, status
     FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (!booking) {
    return {
      response: NextResponse.json({ error: "Booking not found" }, { status: 404 }),
    };
  }

  const isOwner =
    booking.customer_id !== null && booking.customer_id === auth.session.userId;
  if (!isOwner && !hasStaffRole(auth.session)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: you do not have access to this booking" },
        { status: 403 }
      ),
    };
  }

  return { session: auth.session, resource: booking };
}

export async function authorizeDocumentAccess(
  request: Request,
  documentId: string
): Promise<AuthzResult<DocumentRow>> {
  const auth = await requireAuth(request);
  if (auth.response) return auth;

  if (!isValidUuid(documentId)) {
    return {
      response: NextResponse.json({ error: "Invalid document ID" }, { status: 400 }),
    };
  }

  const doc = await queryOne<DocumentRow>(
    `SELECT id, user_id, business_id, document_type, file_name, storage_path, mime_type,
            verification_status, created_at::text
     FROM kyc_documents WHERE id = $1`,
    [documentId]
  );

  if (!doc) {
    return {
      response: NextResponse.json({ error: "Document not found" }, { status: 404 }),
    };
  }

  if (doc.user_id !== auth.session.userId && !hasStaffRole(auth.session)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: you do not have access to this document" },
        { status: 403 }
      ),
    };
  }

  return { session: auth.session, resource: doc };
}

export async function authorizeBusinessAccess(
  request: Request,
  businessId: string
): Promise<AuthzResult<BusinessRow>> {
  const auth = await requireAuth(request);
  if (auth.response) return auth;

  if (!isValidUuid(businessId)) {
    return {
      response: NextResponse.json({ error: "Invalid business ID" }, { status: 400 }),
    };
  }

  const biz = await queryOne<BusinessRow>(
    `SELECT id, company_name, owner_user_id, verification_status, city
     FROM business_accounts WHERE id = $1`,
    [businessId]
  );

  if (!biz) {
    return {
      response: NextResponse.json({ error: "Business account not found" }, { status: 404 }),
    };
  }

  const isOwner =
    biz.owner_user_id !== null && biz.owner_user_id === auth.session.userId;

  let isActiveMember = false;
  if (!isOwner && !hasStaffRole(auth.session)) {
    const member = await queryOne<{ id: string }>(
      `SELECT id FROM business_members
       WHERE business_id = $1 AND user_id = $2 AND is_active = TRUE`,
      [businessId, auth.session.userId]
    );
    isActiveMember = Boolean(member);
  }

  if (!isOwner && !isActiveMember && !hasStaffRole(auth.session)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: you do not have access to this business account" },
        { status: 403 }
      ),
    };
  }

  return { session: auth.session, resource: biz };
}
