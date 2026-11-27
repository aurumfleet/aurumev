import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";

export function generateReferenceCode(prefix: string): string {
  const ts = Date.now().toString().slice(-6);
  const rand = randomInt(100000, 999999);
  return `${prefix}-${ts}-${rand}`;
}

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}
