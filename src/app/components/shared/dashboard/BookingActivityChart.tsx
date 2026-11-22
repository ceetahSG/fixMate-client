"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BookingActivityPoint } from "@/lib/booking-utils";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#5f9e94",
  },
} satisfies ChartConfig;

export default function BookingActivityChart({
  data,
}: {
  data: BookingActivityPoint[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[240px] w-full"
    >
      <BarChart
        data={data}
        margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
        barCategoryGap="38%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 4" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          className="text-xs"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="bookings"
          fill="var(--color-bookings)"
          radius={[5, 5, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ChartContainer>
  );
}
