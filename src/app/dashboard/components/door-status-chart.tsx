
'use client';

import { Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { doorStatusData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Doors',
  },
  unlocked: {
    label: 'Unlocked',
    color: 'hsl(var(--chart-2))',
  },
  locked: {
    label: 'Locked',
    color: 'hsl(var(--chart-3))',
  },
  jammed: {
    label: 'Jammed',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function DoorStatusChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={doorStatusData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="-mt-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
