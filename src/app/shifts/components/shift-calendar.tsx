'use client';

import * as React from 'react';
import { getDaysInMonth, startOfMonth, format, isWithinInterval, parseISO } from 'date-fns';
import { shifts, type ShiftAssignment } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const shiftColors: { [key: string]: string } = {
  'shift-1': 'bg-blue-500',
  'shift-2': 'bg-indigo-500',
  'shift-3': 'bg-purple-500',
  'default': 'bg-gray-300',
};

const getShiftInfoForDate = (date: Date, assignments: ShiftAssignment[]) => {
  const assignment = assignments.find(a => 
    isWithinInterval(date, { start: parseISO(a.startDate), end: parseISO(a.endDate) })
  );
  
  if (!assignment) return { name: 'Not Assigned', color: shiftColors.default };

  const shift = shifts.find(s => s.id === assignment.shiftId);
  return {
    name: shift?.name || 'Unknown',
    color: assignment.shiftId in shiftColors ? shiftColors[assignment.shiftId] : shiftColors.default,
  };
};

interface ShiftCalendarProps {
  assignments: ShiftAssignment[];
  month: Date;
}

export function ShiftCalendar({ assignments, month }: ShiftCalendarProps) {
  const daysInMonth = getDaysInMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <div className="flex w-full items-center gap-0.5">
        {days.map((day) => {
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const shiftInfo = getShiftInfoForDate(date, assignments);

          return (
            <Tooltip key={day}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                  <div className={cn("h-4 w-2 rounded-sm", shiftInfo.color)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {format(date, 'MMM d, yyyy')}
                </p>
                <p className="text-xs">{shiftInfo.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
