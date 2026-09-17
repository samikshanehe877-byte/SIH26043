import "server-only";
import crypto from "crypto";

const SESSION_VERSION = 1;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

interface SessionPayload {
  v: number;
  userId: string;
  issuedAt: number;
  expiresAt: number;
}

function sessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret === "your-secret-key-here-change-in-production") {
    throw new Error("AUTH_SESSION_SECRET must be configured with a strong secret.");
  }
  return secret;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(encodedPayload: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(encodedPayload).digest("base64url");
}

export function createSessionToken(userId: string, now = Date.now()): string {
  const payload: SessionPayload = {
    v: SESSION_VERSION,
    userId,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS * 1000,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length) return null;

  const expected = sign(encodedPayload);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    if (
      payload.v !== SESSION_VERSION ||
      typeof payload.userId !== "string" ||
      !payload.userId ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= now
    ) return null;
    return payload;
  } catch {
    return null;
  }
}
