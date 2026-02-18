import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login sayfasını koru değil, geçir
  if (pathname === "/admin/login") return NextResponse.next();

  // /admin ve alt yollarını koru
  if (pathname.startsWith("/admin")) {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(req, res, {
      password: process.env.SESSION_SECRET!,
      cookieName: "repair-tracker-session",
    });

    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
