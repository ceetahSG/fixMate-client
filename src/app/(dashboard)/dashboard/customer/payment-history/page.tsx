import { headers } from "next/headers";
import PaymentHistoryTable, { type PaymentRecord } from "./PaymentHistoryTable";
import { getPaymentHistory } from "@/lib/actions/api/data";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Payment History | FixMate",
  description: "Review your completed repair payments.",
};

export default async function PaymentHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const role =
    session?.user && "role" in session.user
      ? String(session.user.role ?? "Customer")
      : "Customer";

  const rawPayments = email
    ? await getPaymentHistory(email, role).catch(() => [])
    : [];

  const payments: PaymentRecord[] = Array.isArray(rawPayments)
    ? rawPayments
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[32px]">
          Payment History
        </h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Review your completed repair payments.
        </p>
      </div>

      <PaymentHistoryTable payments={payments} />
    </div>
  );
}
