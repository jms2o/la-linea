import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { homeForSession, setSessionCookie } from "@/lib/session";
import { loginInputSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Correo o contrasena invalidos." },
      { status: 400 }
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
