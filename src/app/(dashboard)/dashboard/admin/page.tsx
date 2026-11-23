import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MoreHorizontal, Users, Wrench } from "lucide-react";
import { getServices, getUsers } from "@/lib/actions/api/data";
import {
  formatServicePrice,
  normalizeService,
  type ApiService,
} from "@/lib/services";
import type { TUser } from "@/types";

export const metadata = {
  title: "Admin Portal | FixMate",
};

const statusStyles = {
  Pending: "bg-[#fef6e7] text-[#c27803] border-[#fae3b8]",
  Approved: "bg-[#e8f6f2] text-[#176b63] border-[#c4e8de]",
  Rejected: "bg-[#fdf2f2] text-[#b91c1c] border-[#f6c9c9]",
};

export default async function AdminDashboardPage() {
  const [rawUsers, rawServices] = await Promise.all([
    getUsers().catch(() => []),
    getServices().catch(() => []),
  ]);

  const users: TUser[] = Array.isArray(rawUsers) ? rawUsers : [];
  const services = Array.isArray(rawServices)
    ? (rawServices as ApiService[]).map(normalizeService)
    : [];
  const pendingServices = services.filter(
    (service) => service.approvalStatus === "Pending",
  );
  const technicianCount = users.filter(
    (user) => user.role === "Technician",
  ).length;
  const customerCount = users.filter((user) => user.role === "Customer").length;
  const userTotal = users.length;
  const customerPercentage = userTotal
    ? Math.round((customerCount / userTotal) * 100)
    : 0;

  const now = new Date();
  const activityData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const count = services.filter((service) => {
      const createdAt = new Date(service.createdAt);
      return (
        createdAt.getFullYear() === date.getFullYear() &&
        createdAt.getMonth() === date.getMonth()
      );
    }).length;

    return { month: date.toLocaleString("en-US", { month: "short" }), count };
  });
  const maxActivity = Math.max(...activityData.map((item) => item.count), 1);
  const recentPendingServices = pendingServices.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Platform Overview Page Title & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Platform Overview
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Monitor users, service approvals, and marketplace activity.
          </p>
        </div>

        <Link
          href="/dashboard/admin/service-approval"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#176b63] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#125851] sm:text-sm"
        >
          <span>Review Services</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* 3 Top Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total Users */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Users
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#eaf4f1] text-[#176b63]">
              <Users className="size-4.5 stroke-[2]" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {userTotal}
          </p>
          <p className="mt-1 text-xs text-slate-400 font-normal">
            Registered platform accounts
          </p>
        </div>

        {/* Card 2: Total Technicians */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Technicians
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#eaf4f1] text-[#176b63]">
              <Wrench className="size-4.5 stroke-[2]" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {technicianCount}
          </p>
          <p className="mt-1 text-xs text-slate-400 font-normal">
            {userTotal ? Math.round((technicianCount / userTotal) * 100) : 0}%
            of all users
          </p>
        </div>

        {/* Card 3: Pending Services */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pending Services
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#eaf4f1] text-[#176b63]">
              <Clock className="size-4.5 stroke-[2]" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {pendingServices.length}
          </p>
          <p className="mt-1 text-xs text-slate-400 font-normal">
            Needs review
          </p>
        </div>
      </div>

      {/* Analytics & Distribution Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Platform activity Bar Chart */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:col-span-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Platform activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Service submissions &middot; Last 6 months
              </p>
            </div>
            <button
              type="button"
              className="text-slate-400 transition-colors hover:text-slate-600"
              aria-label="More options"
            >
              <MoreHorizontal className="size-4.5" />
            </button>
          </div>

          {/* Bar Chart Graphics */}
          <div className="mt-8 flex h-48 w-full items-end justify-between border-b border-slate-100 px-2 sm:px-6">
            {activityData.map((item) => (
              <div
                key={item.month}
                className="flex flex-col items-center gap-2.5 h-full justify-end"
              >
                <div
                  style={{
                    height: `${Math.max((item.count / maxActivity) * 100, item.count ? 8 : 0)}%`,
                  }}
                  className="w-7 sm:w-10 rounded-t-sm bg-[#6aa79d] transition-all hover:bg-[#57948a]"
                />
                <span className="text-xs font-medium text-slate-400 pb-1">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: User distribution Donut Chart */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:col-span-4">
          {/* Header */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              User distribution
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">Current overview</p>
          </div>

          {/* Donut Chart & Stat */}
          <div className="my-6 flex items-center gap-6">
            {/* SVG Donut Graphic */}
            <div className="relative flex size-24 shrink-0 items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* 74% Teal Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#176b63]"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.74)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-base font-bold text-slate-900">
                {customerPercentage}%
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Customers</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {customerCount} registered customers
              </p>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="flex flex-wrap items-center gap-3.5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-800" />
              Approved{" "}
              {
                services.filter(
                  (service) => service.approvalStatus === "Approved",
                ).length
              }
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#6aa79d]" />
              Available{" "}
              {services.filter((service) => service.isAvailable).length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#d97544]" />
              Pending {pendingServices.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Service Submissions Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Pending service submissions
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Latest activity requiring your attention
            </p>
          </div>

          <Link
            href="/dashboard/admin/service-approval"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-[#176b63]"
          >
            <span>View all</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Submissions Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th scope="col" className="pb-3 font-semibold">
                  Service
                </th>
                <th scope="col" className="pb-3 text-center font-semibold">
                  Status
                </th>
                <th scope="col" className="pb-3 text-center font-semibold">
                  Amount
                </th>
                <th scope="col" className="pb-3 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPendingServices.map((submission) => (
                <tr key={submission.id} className="group transition-colors">
                  {/* Service Thumbnail & Titles */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={submission.image}
                          alt={submission.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {submission.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {submission.category} · {submission.technicianName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 text-center">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[submission.approvalStatus]}`}
                    >
                      {submission.approvalStatus}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 text-center font-bold text-slate-900">
                    {formatServicePrice(submission.price)}
                  </td>

                  {/* Action */}
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
