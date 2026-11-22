import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getBookingByEmail } from "@/lib/actions/api/data";
import type { tBookingData } from "@/types";

type BookingRecord = tBookingData & { _id?: string };

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { message: "Stripe is not configured on the server." },
      { status: 500 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const customerEmail = session?.user?.email;

  if (!customerEmail) {
    return NextResponse.json(
      { message: "Please sign in to make a payment." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const bookingId =
    typeof body?.bookingId === "string" ? body.bookingId.trim() : "";

  if (!bookingId) {
    return NextResponse.json(
      { message: "A valid booking is required." },
      { status: 400 },
    );
  }

  const rawBookings = await getBookingByEmail(customerEmail).catch(() => []);
  const bookings: BookingRecord[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];
  const booking = bookings.find((item) => item._id === bookingId);

  if (!booking) {
    return NextResponse.json(
      { message: "This booking could not be found." },
      { status: 404 },
    );
  }

  if (
    String(booking.status).toLowerCase() !== "completed" ||
    booking.paymentStatus === "paid"
  ) {
    return NextResponse.json(
      { message: "This booking is not available for payment." },
      { status: 400 },
    );
  }

  const amount = Number.isFinite(booking.finalAmount)
    ? booking.finalAmount
    : booking.basePrice;

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { message: "The payment amount is invalid." },
      { status: 400 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000";

  const stripe = new Stripe(secretKey);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    client_reference_id: bookingId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: booking.serviceTitle,
            description: `FixMate repair booking (${bookingId})`,
          },
        },
      },
    ],
    metadata: {
      bookingId,
      customerEmail,
      serviceTitle: booking.serviceTitle,
      customerName: booking.customerName,
      technicianName: booking.technicianName,
      technicianEmail: booking.technicianEmail,
    },
    success_url: `${origin}/api/stripe/verify?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/customer/payment?bookingId=${encodeURIComponent(bookingId)}`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      { message: "Stripe did not provide a checkout URL." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}
