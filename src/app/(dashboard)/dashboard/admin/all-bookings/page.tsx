import { getBookings } from "@/lib/actions/api/data";
import type { tBookingData } from "@/types";
import AllBookingsTable from "./AllBookingsTable";

export const metadata = {
  title: "All Platform Bookings | FixMate",
};

export type BookingRecord = tBookingData & {
  _id?: string;
  createdAt?: string;
};

export default async function AllBookingsPage() {
  const rawBookings = await getBookings().catch(() => []);
  const bookings: BookingRecord[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];

  return <AllBookingsTable bookings={bookings} />;
}
