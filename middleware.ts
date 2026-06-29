import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtSync } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const tokenCookie = request.cookies.get("adminToken");
    if (tokenCookie && tokenCookie.value) {
      const payload = verifyJwtSync(tokenCookie.value);
      if (payload && payload.role === "admin") return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
