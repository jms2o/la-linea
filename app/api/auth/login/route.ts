import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { homeForSession, setSessionCookie } from "@/lib/session";
import { loginInputSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const IP_RATE_LIMIT = { limit: 20, windowMs: 5 * 60 * 1000 };
const ACCOUNT_RATE_LIMIT = { limit: 5, windowMs: 5 * 60 * 1000 };

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Correo o contrasena invalidos." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const email = parsed.data.email.toLowerCase();

  const ipCheck = checkRateLimit(`login:ip:${ip}`, IP_RATE_LIMIT);
  const accountCheck = checkRateLimit(`login:account:${email}`, ACCOUNT_RATE_LIMIT);

  if (!ipCheck.allowed || !accountCheck.allowed) {
    const retryAfterSeconds = Math.max(ipCheck.retryAfterSeconds, accountCheck.retryAfterSeconds);

    return NextResponse.json(
      { message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const session = await authenticate(parsed.data);

  if (!session) {
    return NextResponse.json(
      { message: "Correo o contrasena incorrectos." },
      { status: 401 }
    );
  }

  await setSessionCookie(session);

  return NextResponse.json({
    kind: session.kind,
    name: session.name,
    redirectTo: homeForSession(session)
  });
}
