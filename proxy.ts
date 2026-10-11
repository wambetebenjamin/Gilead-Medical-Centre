import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/portal/login") return NextResponse.next();

  const cookieName = process.env.NODE_ENV === "production" ? "__Secure-gilead.session-token" : "gilead.session-token";
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });
  if (token) return NextResponse.next();

  const login = new URL("/portal/login", request.url);
  login.searchParams.set("callbackUrl", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/portal/:path*"] };
