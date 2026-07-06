import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/auth";
import { homeForSession, setSessionCookie } from "@/lib/session";
import { registerCustomerInputSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerCustomerInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revisa los datos del formulario." },
      { status: 400 }
    );
  }

  const result = await registerCustomer(parsed.data);

  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 409 });
  }

  await setSessionCookie(result);

  return NextResponse.json({
    kind: result.kind,
    name: result.name,
    redirectTo: homeForSession(result)
  });
}
