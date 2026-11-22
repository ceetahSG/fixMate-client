import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowLeft,
  CircleCheckBig,
  Clock3,
  Lock,
  ReceiptText,
} from "lucide-react";
import PaymentCheckout, { type PaymentBooking } from "./PaymentCheckout";
import { getBookingByEmail } from "@/lib/actions/api/data";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Complete Payment | FixMate",
  description: "Review your repair booking and pay securely with Stripe.",
};

type PaymentPageProps = {
  searchParams: Promise<{ bookingId?: string | string[] }>;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function PaymentStateCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-2xs">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f1ee] text-[#176b63]">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      <Link
        href="/dashboard/customer/my-booking"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" />
        Back to My Bookings
      </Link>
    </div>
  );
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { bookingId } = await searchParams;
  const requestedId = Array.isArray(bookingId) ? bookingId[0] : bookingId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const rawBookings = email
    ? await getBookingByEmail(email).catch(() => [])
    : [];

  const bookings: PaymentBooking[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];

  const booking = requestedId
    ? bookings.find((item) => item._id === requestedId)
    : undefined;

  const amount = booking
    ? Number.isFinite(booking.finalAmount)
      ? booking.finalAmount
      : booking.basePrice
    : 0;

  const status = String(booking?.status ?? "").toLowerCase();
  const isPaid = booking?.paymentStatus === "paid";
  const isCompleted = status === "completed";
  const isCancelled =
    status === "cancelled" || status === "canceled" || status === "rejected";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/customer/my-booking"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" />
            Back to My Bookings
          </Link>

          <h1 className="mt-3 text-[28px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[32px]">
            {isPaid ? "Payment receipt" : "Complete Payment"}
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            {isPaid
              ? "This booking has already been paid."
              : "Review your repair and pay securely with Stripe."}
          </p>
        </div>

        <span className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-[#c4e8de] bg-[#e8f6f2] px-3.5 text-xs font-semibold text-[#176b63]">
          <Lock className="size-3.5" />
          Secure checkout
        </span>
      </div>

      {!booking ? (
        <PaymentStateCard
          icon={<ReceiptText className="size-6" />}
          title="Payment link not available"
          description="This booking could not be found in your account. Open My Bookings and choose Pay Now from a completed repair."
        />
      ) : isPaid ? (
        <PaymentStateCard
          icon={<CircleCheckBig className="size-6" />}
          title="Payment already complete"
          description={`We've received ${formatAmount(amount)} for ${booking.serviceTitle}. No further action is needed.`}
        />
      ) : isCancelled ? (
        <PaymentStateCard
          icon={<ReceiptText className="size-6" />}
          title="Payment isn't required"
          description={`This repair was ${status === "rejected" ? "rejected" : "cancelled"}, so there is nothing to pay for ${booking.serviceTitle}.`}
        />
      ) : !isCompleted ? (
        <PaymentStateCard
          icon={<Clock3 className="size-6" />}
          title="Payment isn't available yet"
          description="Payment becomes available once the technician marks the repair as completed. You can track progress from My Bookings."
        />
      ) : (
        <PaymentCheckout booking={booking} amount={amount} />
      )}
    </div>
  );
}
