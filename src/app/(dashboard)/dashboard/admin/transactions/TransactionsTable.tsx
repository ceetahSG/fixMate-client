"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Transaction = {
  id: string;
  customer: string;
  service: string;
  technician: string;
  amount: number;
  date: string;
  image: string;
};

type TransactionsTableProps = {
  transactions: Transaction[];
};

const paymentStyles = "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]";

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const [query, setQuery] = useState("");
  const filteredTransactions = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return transactions;

    return transactions.filter((transaction) =>
      [
        transaction.customer,
        transaction.service,
        transaction.technician,
        transaction.id,
      ].some((value) => value.toLowerCase().includes(search)),
    );
  }, [query, transactions]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            All transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            All values are displayed in USD
          </p>
        </div>

        <label className="relative w-full sm:max-w-[335px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-700" />
          <span className="sr-only">Search transactions</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search transactions"
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#176b63] focus:ring-2 focus:ring-[#176b63]/10"
          />
        </label>
      </div>

      <div className="overflow-x-auto px-6 pb-6">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
              {[
                "Customer",
                "Service title",
                "Technician",
                "Amount",
                "Transaction ID",
                "Payment date",
                "Status",
              ].map((heading) => (
                <TableHead
                  key={heading}
                  className="h-13 text-[11px] font-semibold tracking-wider text-slate-500 uppercase first:pl-4 last:pr-4"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="border-slate-100 hover:bg-slate-50/60"
                >
                  <TableCell className="py-5 pl-4 text-sm font-medium text-slate-800">
                    {transaction.customer}
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={transaction.image || "/images/hero-repair.jpg"}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="max-w-[170px] text-sm font-medium text-slate-800">
                        {transaction.service}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 text-sm text-slate-700">
                    {transaction.technician}
                  </TableCell>
                  <TableCell className="py-5 text-sm font-semibold text-slate-800">
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell className="py-5 font-mono text-xs text-slate-600">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="py-5 text-sm text-slate-700">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="py-5 pr-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                        paymentStyles,
                      )}
                    >
                      Paid
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-sm text-slate-500"
                >
                  No paid transactions match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}