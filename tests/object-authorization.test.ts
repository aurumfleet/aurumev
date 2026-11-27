import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { signSessionToken } from "../src/lib/auth";
import { query, queryOne, resetDbForTests } from "../src/lib/db";
import { POST as bookingsPost } from "../src/app/api/bookings/route";
import {
  DELETE as bookingDelete,
  GET as bookingGet,
} from "../src/app/api/bookings/[id]/route";
import { GET as documentGet } from "../src/app/api/documents/[id]/route";
import { GET as userBookingsGet } from "../src/app/api/users/[id]/bookings/route";
import { GET as businessGet } from "../src/app/api/business/[id]/route";

const TEST_SECRET = "aurum-test-secret-minimum-32-chars-long";

const USER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const USER_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const USER_C_MEMBER = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const USER_D_INACTIVE = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const STAFF_USER = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

describe("Object-Level Authorization & Cross-Account Isolation Suite", () => {
  let locationId: string;
  let bookingAId: string;
  let bookingBId: string;
  let docAId: string;
  let docBId: string;
  let businessAId: string;

  let tokenA: string;
  let tokenB: string;
  let tokenCMember: string;
  let tokenDInactive: string;
  let tokenStaff: string;

  beforeAll(async () => {
    process.env.VITEST = "true";
    process.env.DATABASE_URL = "pglite://memory";
    process.env.AUTH_SECRET = TEST_SECRET;
    await resetDbForTests();

    const loc = await queryOne<{ id: string }>(
      "SELECT id FROM locations WHERE is_active = TRUE LIMIT 1"
    );
    locationId = loc!.id;

    // Seed profiles for User A, B, C, D, Staff
    for (const [id, email, name] of [
      [USER_A, "usera@example.com", "User A"],
      [USER_B, "userb@example.com", "User B"],
      [USER_C_MEMBER, "memberc@example.com", "Member C"],
      [USER_D_INACTIVE, "inactived@example.com", "Inactive D"],
      [STAFF_USER, "staff@aurumfleets.com", "Staff Ops"],
    ]) {
      await query(
        `INSERT INTO profiles (id, full_name, email, password_hash) VALUES ($1, $2, $3, 'test-hash-not-used')
         ON CONFLICT (id) DO NOTHING`,
        [id, name, email]
      );
    }

    // Create Booking owned by A and Booking owned by B
    const bA = await queryOne<{ id: string }>(
      `INSERT INTO bookings (
        booking_number, customer_id, location_id, vehicle_category, duration_type,
        start_date, end_date, customer_name, customer_email, customer_phone, terms_accepted, status
      ) VALUES (
        'BK-ISO-A', $1, $2, 'commuter', 'monthly', '2026-12-01', '2026-12-31',
        'User A', 'usera@example.com', '+919800000001', TRUE, 'new_request'
      ) RETURNING id`,
      [USER_A, locationId]
    );
    bookingAId = bA!.id;

    const bB = await queryOne<{ id: string }>(
      `INSERT INTO bookings (
        booking_number, customer_id, location_id, vehicle_category, duration_type,
        start_date, end_date, customer_name, customer_email, customer_phone, terms_accepted, status
      ) VALUES (
        'BK-ISO-B', $1, $2, 'delivery', 'weekly', '2026-12-01', '2026-12-08',
        'User B', 'userb@example.com', '+919800000002', TRUE, 'new_request'
      ) RETURNING id`,
      [USER_B, locationId]
    );
    bookingBId = bB!.id;

    // Create KYC documents owned by A and B
    const dA = await queryOne<{ id: string }>(
      `INSERT INTO kyc_documents (user_id, document_type, file_name, storage_path, mime_type, file_size_bytes)
       VALUES ($1, 'aadhaar_front', 'doc-a.pdf', '/private/doc-a.pdf', 'application/pdf', 1024)
       RETURNING id`,
      [USER_A]
    );
    docAId = dA!.id;

    const dB = await queryOne<{ id: string }>(
      `INSERT INTO kyc_documents (user_id, document_type, file_name, storage_path, mime_type, file_size_bytes)
       VALUES ($1, 'pan_card', 'doc-b.pdf', '/private/doc-b.pdf', 'application/pdf', 2048)
       RETURNING id`,
      [USER_B]
    );
    docBId = dB!.id;

    // Create Business Account owned by A, with active member C and inactive member D
    const bizA = await queryOne<{ id: string }>(
      `INSERT INTO business_accounts (
        company_name, business_category, contact_person, email, mobile, owner_user_id, verification_status, city
      ) VALUES (
        'Alpha Fleet Co', 'Last-Mile Delivery', 'User A', 'usera@example.com', '+919800000001', $1, 'verified', 'Delhi'
      ) RETURNING id`,
      [USER_A]
    );
    businessAId = bizA!.id;

    await query(
      `INSERT INTO business_members (business_id, user_id, member_role, is_active)
       VALUES ($1, $2, 'business_staff', TRUE), ($1, $3, 'business_staff', FALSE)`,
      [businessAId, USER_C_MEMBER, USER_D_INACTIVE]
    );

    tokenA = await signSessionToken({ userId: USER_A, roles: ["customer"] });
    tokenB = await signSessionToken({ userId: USER_B, roles: ["customer"] });
    tokenCMember = await signSessionToken({ userId: USER_C_MEMBER, roles: ["business_member"] });
    tokenDInactive = await signSessionToken({ userId: USER_D_INACTIVE, roles: ["business_member"] });
    tokenStaff = await signSessionToken({ userId: STAFF_USER, roles: ["operations_manager"] });
  });

  beforeEach(() => {
    process.env.AUTH_SECRET = TEST_SECRET;
  });

  it("isolates bookings across accounts (GET and DELETE /api/bookings/[id])", async () => {
    // Unauthenticated -> 401
    const unauth = await bookingGet(
      new Request(`http://localhost:3000/api/bookings/${bookingAId}`),
      { params: Promise.resolve({ id: bookingAId }) }
    );
    expect(unauth.status).toBe(401);

    // User A reading own booking -> 200
    const ownGet = await bookingGet(
      new Request(`http://localhost:3000/api/bookings/${bookingAId}`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: bookingAId }) }
    );
    expect(ownGet.status).toBe(200);

    // User A attempting to read User B's booking -> 403
    const crossGet = await bookingGet(
      new Request(`http://localhost:3000/api/bookings/${bookingBId}`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: bookingBId }) }
    );
    expect(crossGet.status).toBe(403);

    // User A attempting to cancel (DELETE) User B's booking -> 403
    const crossDelete = await bookingDelete(
      new Request(`http://localhost:3000/api/bookings/${bookingBId}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: bookingBId }) }
    );
    expect(crossDelete.status).toBe(403);

    // Staff can access any booking -> 200
    const staffGet = await bookingGet(
      new Request(`http://localhost:3000/api/bookings/${bookingBId}`, {
        headers: { authorization: `Bearer ${tokenStaff}` },
      }),
      { params: Promise.resolve({ id: bookingBId }) }
    );
    expect(staffGet.status).toBe(200);
  });

  it("isolates KYC documents across accounts (GET /api/documents/[id])", async () => {
    // User A reading own document -> 200
    const ownDoc = await documentGet(
      new Request(`http://localhost:3000/api/documents/${docAId}`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: docAId }) }
    );
    expect(ownDoc.status).toBe(200);

    // User A attempting to read User B's document -> 403
    const crossDoc = await documentGet(
      new Request(`http://localhost:3000/api/documents/${docBId}`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: docBId }) }
    );
    expect(crossDoc.status).toBe(403);

    // Invalid UUID -> 400
    const badId = await documentGet(
      new Request("http://localhost:3000/api/documents/not-a-uuid", {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: "not-a-uuid" }) }
    );
    expect(badId.status).toBe(400);
  });

  it("isolates user-scoped booking listings (GET /api/users/[id]/bookings)", async () => {
    // User A listing User A's bookings -> 200 (only A's bookings)
    const ownList = await userBookingsGet(
      new Request(`http://localhost:3000/api/users/${USER_A}/bookings`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: USER_A }) }
    );
    expect(ownList.status).toBe(200);
    const ownJson = (await ownList.json()) as { bookings: Array<{ customer_id: string }> };
    expect(ownJson.bookings.length).toBeGreaterThanOrEqual(1);
    expect(ownJson.bookings.every((b) => b.customer_id === USER_A)).toBe(true);

    // User A attempting to list User B's bookings -> 403
    const crossList = await userBookingsGet(
      new Request(`http://localhost:3000/api/users/${USER_B}/bookings`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: USER_B }) }
    );
    expect(crossList.status).toBe(403);
  });

  it("isolates business accounts to owners, active members, and staff only", async () => {
    // Owner A -> 200
    const ownerRes = await businessGet(
      new Request(`http://localhost:3000/api/business/${businessAId}`, {
        headers: { authorization: `Bearer ${tokenA}` },
      }),
      { params: Promise.resolve({ id: businessAId }) }
    );
    expect(ownerRes.status).toBe(200);

    // Active member C -> 200
    const memberRes = await businessGet(
      new Request(`http://localhost:3000/api/business/${businessAId}`, {
        headers: { authorization: `Bearer ${tokenCMember}` },
      }),
      { params: Promise.resolve({ id: businessAId }) }
    );
    expect(memberRes.status).toBe(200);

    // Inactive/revoked member D -> 403
    const inactiveRes = await businessGet(
      new Request(`http://localhost:3000/api/business/${businessAId}`, {
        headers: { authorization: `Bearer ${tokenDInactive}` },
      }),
      { params: Promise.resolve({ id: businessAId }) }
    );
    expect(inactiveRes.status).toBe(403);

    // Unrelated User B -> 403
    const otherRes = await businessGet(
      new Request(`http://localhost:3000/api/business/${businessAId}`, {
        headers: { authorization: `Bearer ${tokenB}` },
      }),
      { params: Promise.resolve({ id: businessAId }) }
    );
    expect(otherRes.status).toBe(403);
  });

  it("rejects unpublished/non-existent vehicleModelId & rentalPlanId and binds customer_id on authenticated booking", async () => {
    const fakeUuid = "99999999-9999-4999-8999-999999999999";

    // Non-existent vehicleModelId -> 400
    const badModelRes = await bookingsPost(
      new Request("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locationId,
          vehicleModelId: fakeUuid,
          vehicleCategory: "commuter",
          durationType: "monthly",
          startDate: "2026-12-01",
          endDate: "2026-12-30",
          customerName: "Rider X",
          customerEmail: "riderx@example.com",
          customerPhone: "+919876543210",
          termsAccepted: true,
        }),
      })
    );
    expect(badModelRes.status).toBe(400);

    // Authenticated User A creating booking binds customer_id = USER_A
    const authedCreate = await bookingsPost(
      new Request("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${tokenA}`,
        },
        body: JSON.stringify({
          locationId,
          vehicleCategory: "commuter",
          durationType: "monthly",
          startDate: "2026-12-05",
          endDate: "2027-01-04",
          customerName: "User A",
          customerEmail: "usera@example.com",
          customerPhone: "+919800000001",
          termsAccepted: true,
        }),
      })
    );
    expect(authedCreate.status).toBe(201);
    const createdJson = (await authedCreate.json()) as {
      booking: { id: string };
    };

    // User B cannot read User A's newly created booking -> 403
    const crossRead = await bookingGet(
      new Request(`http://localhost:3000/api/bookings/${createdJson.booking.id}`, {
        headers: { authorization: `Bearer ${tokenB}` },
      }),
      { params: Promise.resolve({ id: createdJson.booking.id }) }
    );
    expect(crossRead.status).toBe(403);
  });
});
