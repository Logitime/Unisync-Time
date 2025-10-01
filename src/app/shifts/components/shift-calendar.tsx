'use client';

import * as React from 'react';
import { getDaysInMonth, startOfMonth, format, addMonths, subMonths, getDate } from 'date-fns';
import { shifts } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const shiftColors: { [key: string]: string } = {
  'shift-1': 'bg-blue-500',
  'shift-2': 'bg-indigo-500',
  'shift-3': 'bg-purple-500',
  'default': 'bg-gray-300',
};

const getShiftInfo = (shiftId?: string) => {
  if (!shiftId) return { name: 'Not Assigned', color: shiftColors.default };
  const shift = shifts.find(s => s.id === shiftId);
  return {
    name: shift?.name || 'Unknown',
    color: shiftId in shiftColors ? shiftColors[shiftId] : shiftColors.default,
  };
};

interface ShiftCalendarProps {
  shiftId?: string;
  month: Date;
}

export function ShiftCalendar({ shiftId, month }: ShiftCalendarProps) {
  const daysInMonth = getDaysInMonth(month);
  const monthStart = startOfMonth(month);
  const shiftInfo = getShiftInfo(shiftId);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <div className="flex w-full items-center gap-0.5">
        {days.map((day) => (
          <Tooltip key={day}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] text-muted-foreground">{day}</span>
                 <div className={cn("h-4 w-2 rounded-sm", shiftInfo.color)} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {format(new Date(month.getFullYear(), month.getMonth(), day), 'MMM d, yyyy')}
              </p>
              <p className="text-xs">{shiftInfo.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
