
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { dailyAttendanceData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-2))',
  },
  late: {
    label: 'Late',
    color: 'hsl(var(--chart-4))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function AttendanceTrendsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={dailyAttendanceData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="present" fill="var(--color-present)" radius={4} />
        <Bar dataKey="late" fill="var(--color-late)" radius={4} />
        <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
