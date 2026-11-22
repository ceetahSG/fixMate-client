"use client";

import Link from "next/link";
import { Eye, MoreHorizontal, ReceiptText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BookingRowActions({
  serviceTitle,
}: {
  serviceTitle: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${serviceTitle}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-48 rounded-lg border border-slate-200 p-1"
      >
        <DropdownMenuItem
          render={<Link href="/dashboard/customer/my-booking" />}
          className="cursor-pointer gap-2.5 px-2 py-2 text-slate-700"
        >
          <Eye className="size-4 text-slate-500" />
          View booking
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/dashboard/customer/payment-history" />}
          className="cursor-pointer gap-2.5 px-2 py-2 text-slate-700"
        >
          <ReceiptText className="size-4 text-slate-500" />
          Payment history
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
