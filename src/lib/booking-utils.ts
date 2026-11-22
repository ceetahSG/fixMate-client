import type { tBookingData } from "@/types";

export type BookingRecord = tBookingData & {
  _id?: string;
  createdAt?: string;
};

export type BookingActivityPoint = {
  month: string;
  bookings: number;
};

export type BookingStatusCounts = {
  completed: number;
  cancelled: number;
  inProgress: number;
  pending: number;
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

export function normalizeStatus(status: string) {
  const value = String(status ?? "").toLowerCase();

  if (value === "accepted" || value === "confirmed") return "accepted";
  if (value === "in-progress" || value === "in_progress") return "in-progress";
  if (value === "completed") return "completed";
  if (value === "rejected") return "rejected";
  if (value === "cancelled" || value === "canceled") return "cancelled";

  return "requested";
}

export function getStatusConfig(status: string) {
  return (
    statusConfig[normalizeStatus(status)] ?? {
      label: status || "Unknown",
      className: "border-slate-200 bg-slate-50 text-slate-600",
    }
  );
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function getBookingTimestamp(booking: BookingRecord) {
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

export function getBookingActivity(
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

export function getBookingStatusCounts(
  bookings: BookingRecord[],
): BookingStatusCounts {
  return bookings.reduce(
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
}

export function getThisMonthBookingCount(bookings: BookingRecord[]) {
  const now = new Date();

  return bookings.filter((booking) => {
    const timestamp = getBookingTimestamp(booking);
    if (!timestamp) return false;

    const date = new Date(timestamp);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }).length;
}

export function sortBookingsByNewest(bookings: BookingRecord[]) {
  return [...bookings].sort(
    (first, second) =>
      getBookingTimestamp(second) - getBookingTimestamp(first),
  );
}
