import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  MoreHorizontal,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getBookingByEmail } from "@/lib/actions/api/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { tBookingData } from "@/types";
import BookingActivityChart, {
  type BookingActivityPoint,
} from "@/app/components/customer/BookingActivityChart";
import BookingRowActions from "@/app/components/customer/BookingRowActions";

export const metadata = {
  title: "Customer Dashboard | FixMate",
};

type BookingRecord = tBookingData & {
  _id?: string;
  createdAt?: string;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  requested: {
    label: "Requested",
    className: "border-[#d9e6ff] bg-[#eef4ff] text-[#2563eb]",
  },
  accepted: {
    label: "Accepted",
    className: "border-[#dcd8f7] bg-[#f0edfd] text-[#6d4aff]",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  },
  completed: {
    label: "Completed",
    className: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-[#f7c9c9] bg-[#fdf0f0] text-[#c0392b]",
  },
  rejected: {
    label: "Rejected",
    className: "border-[#f7c9c9] bg-[#fdf0f0] text-[#c0392b]",
  },
};

function normalizeStatus(status: string) {
  const value = String(status ?? "").toLowerCase();

  if (value === "accepted" || value === "confirmed") return "accepted";
  if (value === "in-progress" || value === "in_progress") return "in-progress";
  if (value === "completed") return "completed";
  if (value === "rejected") return "rejected";
  if (value === "cancelled" || value === "canceled") return "cancelled";

  return "requested";
}

function getStatusConfig(status: string) {
  return (
    statusConfig[normalizeStatus(status)] ?? {
      label: status || "Unknown",
      className: "border-slate-200 bg-slate-50 text-slate-600",
    }
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getBookingTimestamp(booking: BookingRecord) {
  if (booking.createdAt) {
    const timestamp = new Date(booking.createdAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  // MongoDB ObjectIds embed their creation timestamp in the first 4 bytes.
  if (booking._id && /^[0-9a-f]{24}$/i.test(booking._id)) {
    const timestamp = parseInt(booking._id.slice(0, 8), 16) * 1000;
    if (Number.isFinite(timestamp)) return timestamp;
  }

  const timestamp = new Date(booking.preferredDate).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getBookingActivity(
  bookings: BookingRecord[],
): BookingActivityPoint[] {
  const now = new Date();

  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1,
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: MONTH_LABELS[date.getMonth()],
      bookings: 0,
    };
  });

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const booking of bookings) {
    const timestamp = getBookingTimestamp(booking);
    if (!timestamp) continue;

    const date = new Date(timestamp);
    const bucket = bucketMap.get(
      `${date.getFullYear()}-${date.getMonth()}`,
    );

    if (bucket) bucket.bookings += 1;
  }

  return buckets.map(({ month, bookings: count }) => ({
    month,
    bookings: count,
  }));
}

export default async function CustomerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const displayName = session?.user?.name?.trim() || "there";
  const firstName = displayName.split(" ")[0];

  const email = session?.user?.email;
  const rawBookings = email
    ? await getBookingByEmail(email).catch(() => [])
    : [];

  const bookings: BookingRecord[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];

  const totalRequests = bookings.length;

  const statusCounts = bookings.reduce(
    (counts, booking) => {
      const status = normalizeStatus(booking.status);

      if (status === "completed") {
        counts.completed += 1;
      } else if (status === "cancelled" || status === "rejected") {
        counts.cancelled += 1;
      } else if (status === "in-progress" || status === "accepted") {
        counts.inProgress += 1;
      } else {
        counts.pending += 1;
      }

      return counts;
    },
    { completed: 0, cancelled: 0, inProgress: 0, pending: 0 },
  );

  const activeJobs = statusCounts.inProgress + statusCounts.pending;
  const activeJobsHelper =
    activeJobs === 0
      ? "No active jobs right now"
      : statusCounts.inProgress > 0
        ? `${statusCounts.inProgress} currently in progress`
        : `${statusCounts.pending} awaiting technician`;
  const completionRate =
    totalRequests > 0
      ? Math.round((statusCounts.completed / totalRequests) * 100)
      : 0;

  const now = new Date();
  const thisMonthCount = bookings.filter((booking) => {
    const timestamp = getBookingTimestamp(booking);
    if (!timestamp) return false;

    const date = new Date(timestamp);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }).length;

  const activity = getBookingActivity(bookings);

  const recentBookings = [...bookings]
    .sort(
      (first, second) =>
        getBookingTimestamp(second) - getBookingTimestamp(first),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Requests",
      value: totalRequests,
      helper: `+${thisMonthCount} this month`,
      icon: ClipboardList,
    },
    {
      label: "Active Jobs",
      value: activeJobs,
      helper: activeJobsHelper,
      icon: Clock3,
    },
    {
      label: "Completed Jobs",
      value: statusCounts.completed,
      helper: `${completionRate}% completion rate`,
      icon: CircleCheckBig,
    },
  ];

  const donutRadius = 42;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutOffset =
    donutCircumference * (1 - Math.min(Math.max(completionRate, 0), 100) / 100);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[30px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[34px]">
            Welcome Back, {firstName}
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Here&apos;s a clear view of your repair activity.
          </p>
        </div>

        <Button
          render={<Link href="/services" />}
          className="h-11 w-fit shrink-0 gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
        >
          Browse Services
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[15px] font-semibold text-slate-500">
                    {stat.label}
                  </p>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf4f1] text-[#176b63]">
                    <Icon className="size-4.5 stroke-[2]" />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-[13px] text-slate-400">
                  {stat.helper}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0 lg:col-span-2">
          <div className="flex items-start justify-between p-6 pb-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Booking activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your requests &middot; Last 6 months
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Booking activity options"
              className="text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <MoreHorizontal className="size-4.5" />
            </Button>
          </div>

          <div className="px-2 pb-4 sm:px-4">
            <BookingActivityChart data={activity} />
          </div>
        </Card>

        <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0">
          <CardContent className="flex h-full flex-col p-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Repair summary
              </h2>
              <p className="mt-1 text-sm text-slate-500">Current overview</p>
            </div>

            <div className="my-8 flex flex-1 items-center gap-6">
              <div className="relative flex size-32 shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="size-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={donutRadius}
                    fill="none"
                    stroke="#edf2ee"
                    strokeWidth="11"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={donutRadius}
                    fill="none"
                    stroke="#176b63"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutOffset}
                  />
                </svg>
                <span className="absolute text-lg font-bold text-slate-900">
                  {completionRate}%
                </span>
              </div>

              <div>
                <p className="text-base font-semibold text-slate-900">
                  Completed
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {statusCounts.completed} of {totalRequests} repair
                  {totalRequests === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#176b63]" />
                Completed {statusCounts.completed}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#6aa79d]" />
                Active {statusCounts.inProgress}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#d97544]" />
                Pending {statusCounts.pending}
              </span>
              {statusCounts.cancelled > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-slate-400" />
                  Cancelled {statusCounts.cancelled}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0">
        <div className="flex flex-col gap-3 p-6 pb-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Recent bookings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest activity requiring your attention
            </p>
          </div>

          <Button
            variant="link"
            render={<Link href="/dashboard/customer/my-booking" />}
            className="h-auto w-fit shrink-0 gap-1 p-0 text-sm font-semibold text-slate-800 hover:text-[#176b63] hover:no-underline"
          >
            View all
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-5 px-6 pb-6">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
                <TableHead className="h-11 w-[52%] pl-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Service
                </TableHead>
                <TableHead className="h-11 w-[18%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="h-11 w-[18%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Amount
                </TableHead>
                <TableHead className="h-11 w-[12%] pr-3 text-right text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => {
                  const status = getStatusConfig(booking.status);
                  const amount = Number.isFinite(Number(booking.finalAmount))
                    ? Number(booking.finalAmount)
                    : Number(booking.basePrice) || 0;

                  return (
                    <TableRow
                      key={booking._id ?? `${booking.serviceId}-${index}`}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={
                                booking.serviceImage ||
                                "/images/hero-repair-clean.jpg"
                              }
                              alt={booking.serviceTitle}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-slate-900">
                              {booking.serviceTitle}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {booking.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
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

                      <TableCell className="py-4 text-sm font-semibold text-slate-900">
                        {formatAmount(amount)}
                      </TableCell>

                      <TableCell className="py-4 pr-3 text-right">
                        <BookingRowActions
                          serviceTitle={booking.serviceTitle}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="py-16 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f1ee] text-[#176b63]">
                      <ClipboardList className="size-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-900">
                      No bookings yet.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse services to book your first repair.
                    </p>
                    <Button
                      render={<Link href="/services" />}
                      className="mt-4 h-10 gap-2 rounded-lg bg-[#176b63] px-4 text-sm font-semibold text-white hover:bg-[#125851]"
                    >
                      Browse Services
                      <ArrowRight className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
