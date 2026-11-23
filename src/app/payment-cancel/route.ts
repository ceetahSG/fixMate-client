import { NextResponse } from "next/server";

/** Stripe "cancel" return URL: send the customer back to their bookings. */
export async function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/dashboard/customer/my-booking", request.url),
  );
}
