import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/actions/api/services";

/**
 * Stripe success redirect. The Express API verifies the checkout session with
 * Stripe and marks the booking + payment record as paid.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      new URL("/dashboard/customer/my-booking", request.url),
    );
  }

  try {
    const result = await confirmPayment(sessionId);
    const bookingId =
      typeof result?.bookingId === "string" ? result.bookingId : "";

    return NextResponse.redirect(
      new URL(
        bookingId
          ? `/dashboard/customer/payment?bookingId=${encodeURIComponent(bookingId)}`
          : "/dashboard/customer/my-booking",
        request.url,
      ),
    );
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard/customer/my-booking", request.url),
    );
  }
}
