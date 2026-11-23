import { NextResponse } from "next/server";

/**
 * Backwards-compatible Stripe success landing page.
 *
 * Older checkout sessions were created with a `/payment-success` return URL
 * before the redirect moved to the verification endpoint. Forwarding here
 * keeps those sessions working instead of showing a 404.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      new URL("/dashboard/customer/my-booking", request.url),
    );
  }

  return NextResponse.redirect(
    new URL(
      `/api/stripe/verify?session_id=${encodeURIComponent(sessionId)}`,
      request.url,
    ),
  );
}
