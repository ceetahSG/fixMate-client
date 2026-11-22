"use client";

import { useMemo, useState } from "react";
import { ReceiptText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type PaymentRecord = {
  _id?: string;
  bookingId?: string;
  serviceTitle: string;
  customerName?: string;
  customerEmail?: string;
  technicianName: string;
  technicianEmail?: string;
  amount: number;
  currency?: string;
  transactionId: string;
  stripeSessionId?: string;
  paymentStatus: string;
  paidAt: string;
};

type PaymentHistoryTableProps = {
  payments: PaymentRecord[];
};

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: {
    label: "Paid",
    className: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  },
  pending: {
    label: "Pending",
    className: "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  },
  failed: {
    label: "Failed",
    className: "border-[#f7c9c9] bg-[#fdf0f0] text-[#c0392b]",
  },
  refunded: {
    label: "Refunded",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

function formatAmount(amount: number) {
  const value = Number(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPaymentDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getTimestamp(value: string) {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getStatus(status: string) {
  const key = String(status ?? "").toLowerCase();

  return (
    statusConfig[key] ?? {
      label: status || "Unknown",
      className: "border-slate-200 bg-slate-50 text-slate-600",
    }
  );
}

export default function PaymentHistoryTable({
  payments,
}: PaymentHistoryTableProps) {
  const [query, setQuery] = useState("");

  const filteredPayments = useMemo(() => {
    const search = query.trim().toLowerCase();

    return [...payments]
      .sort(
        (first, second) =>
          getTimestamp(second.paidAt) - getTimestamp(first.paidAt),
      )
      .filter((payment) => {
        if (!search) return true;

        return [
          payment.serviceTitle,
          payment.technicianName,
          payment.transactionId,
          payment.paymentStatus,
          String(payment.amount),
          formatAmount(payment.amount),
          formatPaymentDate(payment.paidAt),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);
      });
  }, [payments, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0">
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Completed payments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              All values are displayed in USD
            </p>
          </div>

          <div className="relative w-full sm:w-[260px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search transactions"
              aria-label="Search payment transactions"
              className="h-10 rounded-lg border-slate-300 bg-white pl-9 text-sm shadow-xs placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 px-6 pb-6">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
              <TableHead className="h-11 w-[27%] pl-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Service title
              </TableHead>
              <TableHead className="h-11 w-[17%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Technician
              </TableHead>
              <TableHead className="h-11 w-[11%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Amount
              </TableHead>
              <TableHead className="h-11 w-[22%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Transaction ID
              </TableHead>
              <TableHead className="h-11 w-[14%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Payment Date
              </TableHead>
              <TableHead className="h-11 w-[9%] pr-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => {
                const status = getStatus(payment.paymentStatus);

                return (
                  <TableRow
                    key={
                      payment._id ??
                      `${payment.transactionId}-${payment.bookingId ?? index}`
                    }
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="py-5 pl-3 text-sm font-medium text-slate-800">
                      {payment.serviceTitle}
                    </TableCell>
                    <TableCell className="py-5 text-sm text-slate-700">
                      {payment.technicianName}
                    </TableCell>
                    <TableCell className="py-5 text-sm font-semibold text-slate-900">
                      {formatAmount(payment.amount)}
                    </TableCell>
                    <TableCell className="py-5 text-sm text-slate-600">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell className="py-5 text-sm text-slate-600">
                      {formatPaymentDate(payment.paidAt)}
                    </TableCell>
                    <TableCell className="py-5 pr-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-6 rounded-full px-2.5 text-xs font-semibold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f1ee] text-[#176b63]">
                    <ReceiptText className="size-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-900">
                    {hasQuery
                      ? "No matching transactions."
                      : "No payments yet."}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {hasQuery
                      ? "Try a different service, technician, or transaction ID."
                      : "Completed repair payments will appear here."}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
