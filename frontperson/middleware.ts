import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";
  const role = req.cookies.get("role")?.value || "";
  const { pathname } = req.nextUrl;

  // RUTAS LIBRES
  if (pathname.startsWith("/") || pathname === "/") {
    return NextResponse.next();
  }

  // BLOQUEAR SI NO HAY TOKEN
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // VALIDAR ROLES
  if (role === "User") {
    const forbiddenRoutes = [
      "/person/create-user",
      "/person/list/",
    ];

    if (forbiddenRoutes.some(r => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/no-access", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/person/:path*"],
};
