import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  isAdminEnvConfigured,
  verifyAdminSessionToken,
} from "./lib/admin-session";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = "kk_admin_session";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!isAdminEnvConfigured()) {
      return new NextResponse(null, { status: 404 });
    }

    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }

    const secret = process.env.ADMIN_SESSION_SECRET!.trim();
    const cookie = request.cookies.get(SESSION_COOKIE)?.value;
    const ok =
      cookie && (await verifyAdminSessionToken(cookie, secret));

    if (!ok) {
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
