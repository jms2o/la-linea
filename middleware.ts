import { NextResponse, type NextRequest } from "next/server";
import { homeForSession, SESSION_COOKIE, verifySession } from "@/lib/session";

const ADMIN_PREFIX = "/admin";
const CUSTOMER_ONLY_PATHS = ["/checkout", "/mi-cuenta"];
const AUTH_PAGES = ["/login", "/registro"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isAdminPath = matchesPrefix(pathname, [ADMIN_PREFIX]);
  const isCustomerOnlyPath = matchesPrefix(pathname, CUSTOMER_ONLY_PATHS);
  const isAuthPage = matchesPrefix(pathname, AUTH_PAGES);

  if (isAdminPath && session?.kind !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isCustomerOnlyPath && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(homeForSession(session), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/mi-cuenta/:path*", "/login", "/registro"]
};
