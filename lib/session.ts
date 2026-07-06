import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getRequiredEnv } from "@/lib/env";

export const SESSION_COOKIE = "session";
const SESSION_DURATION = "30d";

export type SessionPayload = {
  sub: string;
  kind: "admin" | "customer";
  role?: "ADMIN" | "SUPER_ADMIN";
  name: string;
  email: string;
};

function getSecretKey() {
  return new TextEncoder().encode(getRequiredEnv("NEXTAUTH_SECRET"));
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export function homeForSession(session: Pick<SessionPayload, "kind">): string {
  return session.kind === "admin" ? "/admin/dashboard" : "/mi-cuenta";
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
