"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { updateBookingStatus } from "@/lib/actions/api/bookings";
import { toast } from "@/components/ui/toast";
import type { tBookingData } from "@/types";

export type TechnicianRequest = Omit<tBookingData, "status"> & {
  _id?: string;
  status: string;
};

type ManageRequestsBoardProps = {
  requests: TechnicianRequest[];
};

type RequestStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rejected";

type TabValue = "all" | "requested" | "accepted" | "in-progress" | "completed";

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const statusConfig: Record<
  RequestStatus,
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

const monthNames = [
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

const tabTriggerClassName =
  "h-auto flex-none rounded-none px-0 pt-5 pb-4 text-sm font-semibold text-slate-500 after:bottom-0 after:h-0.5 after:bg-[#176b63] hover:text-slate-800 data-active:text-[#176b63]";

function normalizeStatus(status: string): RequestStatus {
  const value = status.toLowerCase();

  if (value === "accepted" || value === "confirmed") return "accepted";
  if (value === "in-progress" || value === "in_progress") return "in-progress";
  if (value === "completed") return "completed";
  if (value === "rejected") return "rejected";
  if (value === "cancelled" || value === "canceled") {
    return "cancelled";
  }

  return "requested";
}

function getRequestKey(request: TechnicianRequest) {
  return (
    request._id ?? `${request.serviceId}-${request.customerEmail ?? "unknown"}`
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

function formatPreferredDate(value: string) {
  if (!value) return "—";

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const monthName = monthNames[month - 1];

  if (!year || !monthName || !day) return value;

  return `${monthName} ${day}, ${year}`;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#176b63]" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onStatusChange,
  busy,
  error,
}: {
  request: TechnicianRequest;
  onStatusChange: (status: RequestStatus) => void;
  busy: boolean;
  error: string;
}) {
  const status = normalizeStatus(request.status);
  const badge = statusConfig[status];
  const amount = Number.isFinite(request.finalAmount)
    ? request.finalAmount
    : request.basePrice;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold",
            badge.className,
          )}
        >
          {badge.label}
        </span>
        <span className="text-[22px] leading-none font-semibold tracking-tight text-slate-900">
          {formatAmount(amount)}
        </span>
      </div>

      <h3 className="mt-4 text-lg leading-snug font-semibold text-slate-900">
        {request.serviceTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Requested by {request.customerName}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoItem icon={Phone} label="Phone" value={request.customerPhone} />
          <InfoItem icon={MapPin} label="Address" value={request.address} />
          <InfoItem
            icon={CalendarDays}
            label="Preferred date"
            value={formatPreferredDate(request.preferredDate)}
          />
        </div>
      </div>

      <div className="mt-5 min-h-[76px] rounded-lg bg-[#f7f8f7] px-4 py-3">
        <p className="text-xs text-slate-500">Problem description</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          {request.problemDescription}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-end gap-3 pt-5">
        {status === "requested" ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={busy || !request._id}
              onClick={() => onStatusChange("rejected")}
              className="h-11 rounded-lg border-[#f4c7c7] bg-white px-6 text-sm font-semibold text-[#d64545] shadow-xs hover:bg-[#fdf5f5] hover:text-[#c0392b]"
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={busy || !request._id}
              onClick={() => onStatusChange("accepted")}
              className="h-11 rounded-lg bg-[#176b63] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
            >
              Accept Request
            </Button>
          </>
        ) : null}

        {status === "accepted" ? (
          <Button
            type="button"
            disabled={busy || !request._id}
            onClick={() => onStatusChange("in-progress")}
            className="h-11 rounded-lg bg-[#176b63] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
          >
            Start Work
          </Button>
        ) : null}

        {status === "in-progress" ? (
          <Button
            type="button"
            disabled={busy || !request._id}
            onClick={() => onStatusChange("completed")}
            className="h-11 rounded-lg bg-[#176b63] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
          >
            Mark Completed
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-3 text-right text-sm text-red-600">{error}</p>
      ) : null}
    </article>
  );
}

export default function ManageRequestsBoard({
  requests,
}: ManageRequestsBoardProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [items, setItems] = useState<TechnicianRequest[]>(requests);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  async function updateStatus(
    request: TechnicianRequest,
    status: RequestStatus,
  ) {
    const key = getRequestKey(request);

    if (!request._id) {
      setActionErrors((current) => ({
        ...current,
        [key]: "This request is missing its booking ID.",
      }));
      return;
    }

    if (
      status !== "accepted" &&
      status !== "rejected" &&
      status !== "in-progress" &&
      status !== "completed"
    ) {
      return;
    }

    setPendingKey(key);
    setActionErrors((current) => ({ ...current, [key]: "" }));

    try {
      await updateBookingStatus(request._id, status);

      toast.add({
        title: "Booking status updated",
        description: `The request is now ${status.replace("-", " ")}.`,
        type: "success",
      });

      setItems((current) =>
        current.map((item) =>
          getRequestKey(item) === key ? { ...item, status } : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update the booking status.";
      setActionErrors((current) => ({
        ...current,
        [key]: message,
      }));
      toast.add({
        title: "Status update failed",
        description: message,
        type: "error",
      });
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[32px]">
          Repair Requests
        </h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Review incoming work and keep every job status current.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="gap-0"
        >
          <div className="overflow-x-auto border-b border-slate-200 px-6 sm:px-8">
            <TabsList
              variant="line"
              className="h-auto w-full min-w-max justify-start gap-7 rounded-none p-0 sm:gap-9"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={tabTriggerClassName}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tab) => {
            const tabItems =
              tab.value === "all"
                ? items
                : items.filter(
                    (request) => normalizeStatus(request.status) === tab.value,
                  );

            return (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 p-6 sm:p-8"
              >
                {tabItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {tabItems.map((request) => (
                      <RequestCard
                        key={getRequestKey(request)}
                        request={request}
                        busy={pendingKey === getRequestKey(request)}
                        error={actionErrors[getRequestKey(request)] ?? ""}
                        onStatusChange={(status) =>
                          updateStatus(request, status)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                    <p className="text-sm font-medium text-slate-900">
                      No requests in this tab.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      New work will appear here as customers book your services.
                    </p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
