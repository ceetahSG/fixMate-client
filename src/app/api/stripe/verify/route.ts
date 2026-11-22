import { NextResponse } from "next/server";
import Stripe from "stripe";
import { savePaymentIntent } from "@/lib/actions/api/services";

const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!secretKey || !sessionId) {
    return NextResponse.redirect(
      new URL("/dashboard/customer/my-booking", request.url),
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = checkoutSession.metadata?.bookingId;

    if (checkoutSession.payment_status !== "paid" || !bookingId) {
      return NextResponse.redirect(
        new URL("/dashboard/customer/my-booking", request.url),
      );
    }

    const bookingResponse = await fetch(
      `${baseUrl}/bookings/${encodeURIComponent(bookingId)}`,
      { cache: "no-store" },
    );
    const booking = await bookingResponse.json().catch(() => null);

    if (booking?.paymentStatus !== "paid") {
      const amount =
        typeof checkoutSession.amount_total === "number"
          ? checkoutSession.amount_total / 100
          : Number(booking?.finalAmount ?? booking?.basePrice ?? 0);
      const transactionId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : (checkoutSession.payment_intent?.id ?? "");

      await savePaymentIntent(
        bookingId,
        checkoutSession.metadata?.serviceTitle ?? booking?.serviceTitle ?? "",
        checkoutSession.metadata?.customerName ?? booking?.customerName ?? "",
        checkoutSession.metadata?.customerEmail ??
          booking?.customerEmail ??
          "",
        checkoutSession.metadata?.technicianName ??
          booking?.technicianName ??
          "",
        checkoutSession.metadata?.technicianEmail ??
          booking?.technicianEmail ??
          "",
        amount,
        checkoutSession.currency ?? "usd",
        transactionId,
        checkoutSession.id,
        checkoutSession.payment_status,
        new Date().toISOString(),
      );
    }

    await fetch(`${baseUrl}/bookings/${encodeURIComponent(bookingId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "paid" }),
    });

    return NextResponse.redirect(
      new URL(
        `/dashboard/customer/payment?bookingId=${encodeURIComponent(bookingId)}`,
        request.url,
      ),
    );
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard/customer/my-booking", request.url),
    );
  }
}
