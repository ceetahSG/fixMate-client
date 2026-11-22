import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  MoreHorizontal,
  Wrench,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getBookingByTechnicianEmail,
  getMyServices,
} from "@/lib/actions/api/data";
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
import type { TServiceData } from "@/types";
import {
  formatAmount,
  getBookingActivity,
  getBookingStatusCounts,
  getStatusConfig,
  sortBookingsByNewest,
  type BookingRecord,
} from "@/lib/booking-utils";
import BookingActivityChart from "@/app/components/shared/dashboard/BookingActivityChart";
import RequestRowActions from "@/app/components/technician/RequestRowActions";

export const metadata = {
  title: "Technician Dashboard | FixMate",
};

type ServiceRecord = TServiceData & {
  status?: string;
};

type ApprovalStatus = "Approved" | "Pending" | "Rejected";

function getApprovalStatus(service: ServiceRecord): ApprovalStatus {
  const value = String(
    service.approvalStatus ?? service.status ?? "Pending",
  ).toLowerCase();

  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";

  return "Pending";
}

export default async function TechnicianDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const [rawServices, rawBookings] = await Promise.all([
    email ? getMyServices(email).catch(() => []) : [],
    email ? getBookingByTechnicianEmail(email).catch(() => []) : [],
  ]);

  const services: ServiceRecord[] = Array.isArray(rawServices)
    ? rawServices
    : [];
  const bookings: BookingRecord[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];

  const totalServices = services.length;
  const availableServices = services.filter(
    (service) => service.isAvailable !== false,
  ).length;
  const approvedServices = services.filter(
    (service) => getApprovalStatus(service) === "Approved",
  ).length;
  const pendingApprovalServices = services.filter(
    (service) => getApprovalStatus(service) === "Pending",
  ).length;
  const rejectedServices = services.filter(
    (service) => getApprovalStatus(service) === "Rejected",
  ).length;

  const approvalRate =
    totalServices > 0
      ? Math.round((approvedServices / totalServices) * 100)
      : 0;

  const bookingStatusCounts = getBookingStatusCounts(bookings);
  const pendingRequests = bookingStatusCounts.pending;

  const activity = getBookingActivity(bookings);
  const recentRequests = sortBookingsByNewest(bookings).slice(0, 5);

  const stats = [
    {
      label: "Total Services",
      value: totalServices,
      helper: `${availableServices} currently available`,
      icon: Wrench,
    },
    {
      label: "Approved Services",
      value: approvedServices,
      helper:
        pendingApprovalServices > 0
          ? `${pendingApprovalServices} awaiting review`
          : "All services reviewed",
      icon: CircleCheckBig,
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      helper:
        pendingRequests > 0 ? "Needs your response" : "No new requests",
      icon: Clock3,
    },
  ];

  const donutRadius = 42;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutOffset =
    donutCircumference *
    (1 - Math.min(Math.max(approvalRate, 0), 100) / 100);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[30px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[34px]">
            Technician Dashboard
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Manage your services and active repair work.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/technician/add-service" />}
          className="h-11 w-fit shrink-0 gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
        >
          Add New Service
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
                Your repair jobs &middot; Last 6 months
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
                Service approval
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
                  {approvalRate}%
                </span>
              </div>

              <div>
                <p className="text-base font-semibold text-slate-900">
                  Approved
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {approvedServices} of {totalServices} service
                  {totalServices === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#176b63]" />
                Approved {approvedServices}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#d97544]" />
                Pending {pendingApprovalServices}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#c0392b]" />
                Rejected {rejectedServices}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent repair requests */}
      <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0">
        <div className="flex flex-col gap-3 p-6 pb-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Recent repair requests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest activity requiring your attention
            </p>
          </div>

          <Button
            variant="link"
            render={
              <Link href="/dashboard/technician/manage-request" />
            }
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
              {recentRequests.length > 0 ? (
                recentRequests.map((request, index) => {
                  const status = getStatusConfig(request.status);
                  const amount = Number.isFinite(Number(request.finalAmount))
                    ? Number(request.finalAmount)
                    : Number(request.basePrice) || 0;

                  return (
                    <TableRow
                      key={request._id ?? `${request.serviceId}-${index}`}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={
                                request.serviceImage ||
                                "/images/hero-repair-clean.jpg"
                              }
                              alt={request.serviceTitle}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-slate-900">
                              {request.serviceTitle}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {request.category}
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
                        <RequestRowActions
                          serviceTitle={request.serviceTitle}
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
                      No repair requests yet.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Once customers book your services, requests will appear
                      here.
                    </p>
                    <Button
                      render={
                        <Link href="/dashboard/technician/add-service" />
                      }
                      className="mt-4 h-10 gap-2 rounded-lg bg-[#176b63] px-4 text-sm font-semibold text-white hover:bg-[#125851]"
                    >
                      Add a Service
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
