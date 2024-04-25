import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = request.nextUrl.pathname;

  // Allow all requests to API endpoints
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Existing logic for handling auth and non-auth pages
  if (path.startsWith("/api/auth") || path.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && !path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
