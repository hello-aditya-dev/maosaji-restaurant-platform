import { NextResponse, type NextRequest } from "next/server";

/**
 * PRIVATE CONCEPT safeguard — X-Robots-Tag on every response.
 * Remove only at authorized production launch (see PRODUCTION_HANDOFF.md).
 */
export default function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
