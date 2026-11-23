import { NextResponse } from "next/server";
import { authFetch, backendUrlFor } from "@/lib/auth-fetch";

/**
 * Starts a Stripe Checkout session through the Express API so that the
 * backend remains the single source of truth for payments and bookings.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const bookingId =
    typeof body?.bookingId === "string" ? body.bookingId.trim() : "";

  if (!bookingId) {
    return NextResponse.json(
      { message: "A valid booking is required." },
      { status: 400 },
    );
  }

  const origin = (
    process.env.BETTER_AUTH_URL?.trim() ||
    new URL(request.url).origin
  ).replace(/\/$/, "");

  try {
    const response = await authFetch(
      backendUrlFor("/api/payments/create-checkout-session"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          successUrl: `${origin}/api/stripe/verify?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/dashboard/customer/payment?bookingId=${encodeURIComponent(
            bookingId,
          )}`,
        }),
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.url) {
      return NextResponse.json(
        {
          message:
            result?.message || "Could not start Stripe checkout.",
        },
        { status: response.status === 200 ? 502 : response.status },
      );
    }

    return NextResponse.json({ url: result.url });
  } catch {
    return NextResponse.json(
      { message: "Please sign in to make a payment." },
      { status: 401 },
    );
  }
}
