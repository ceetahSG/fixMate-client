import { CreditCard, DollarSign } from "lucide-react";
import { getBookings } from "@/lib/actions/api/data";
import type { tBookingData } from "@/types";
import TransactionsTable, { type Transaction } from "./TransactionsTable";

export const metadata = {
    title: "Transactions & Revenue | FixMate",
};

type BookingRecord = tBookingData & {
    _id?: string;
    createdAt?: string;
};

function getTransactionAmount(booking: BookingRecord) {
    const finalAmount = Number(booking.finalAmount);
    if (Number.isFinite(finalAmount) && finalAmount > 0) return finalAmount;

    const basePrice = Number(booking.basePrice);
    return Number.isFinite(basePrice) ? basePrice : 0;
}

export default async function TransactionPage() {
    const rawBookings = await getBookings().catch(() => []);
    const bookings: BookingRecord[] = Array.isArray(rawBookings)
        ? rawBookings
        : [];

    const paidBookings = bookings.filter(
        (booking) => booking.paymentStatus?.toLowerCase() === "paid",
    );
    const totalRevenue = paidBookings.reduce(
        (total, booking) => total + getTransactionAmount(booking),
        0,
    );
    const transactions: Transaction[] = paidBookings.map((booking, index) => ({
        id: booking._id
            ? `TXN-${booking._id.slice(-6).toUpperCase()}`
            : `TXN-${index + 1}`,
        customer: booking.customerName || "Unknown customer",
        service: booking.serviceTitle || "Untitled service",
        technician: booking.technicianName || "Unknown technician",
        amount: getTransactionAmount(booking),
        date: booking.createdAt || booking.preferredDate,
        image: booking.serviceImage,
    }));

    return (
        <div className="space-y-7">
            <div>
                <h1 className="text-[30px] leading-tight font-semibold tracking-tight text-[#203635] sm:text-[36px]">
                    Transactions &amp; Revenue
                </h1>
                <p className="mt-2 text-[15px] text-slate-500">
                    Monitor completed payments across the platform.
                </p>
            </div>

            <div className="grid max-w-[705px] grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-[17px] font-semibold text-slate-500">
                            Total Revenue
                        </p>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#eaf4f1] text-[#176b63]">
                            <DollarSign className="size-5" />
                        </span>
                    </div>
                    <p className="mt-5 text-[40px] leading-none font-bold tracking-tight text-[#203635]">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                        }).format(totalRevenue)}
                    </p>
                    <p className="mt-3 text-sm text-slate-500">From paid transactions</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-[17px] font-semibold text-slate-500">
                            Transactions
                        </p>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#eaf4f1] text-[#176b63]">
                            <CreditCard className="size-5" />
                        </span>
                    </div>
                    <p className="mt-5 text-[40px] leading-none font-bold tracking-tight text-[#203635]">
                        {paidBookings.length}
                    </p>
                    <p className="mt-3 text-sm text-slate-500">Completed payments</p>
                </div>
            </div>

            <TransactionsTable transactions={transactions} />
        </div>
    );
}