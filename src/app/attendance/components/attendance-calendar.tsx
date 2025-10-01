'use client';

import * as React from 'react';
import { getDaysInMonth, format, parseISO } from 'date-fns';
import { type AttendanceRecord } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const attendanceColors: { [key: string]: string } = {
  Present: 'bg-green-500',
  Late: 'bg-amber-500',
  Absent: 'bg-red-500',
  default: 'bg-gray-300',
};

const getAttendanceForDate = (date: Date, records: AttendanceRecord[]) => {
  const record = records.find(r => r.date === format(date, 'yyyy-MM-dd'));
  if (!record) return { status: 'No Record', color: attendanceColors.default, record: null };

  return {
    status: record.status,
    color: attendanceColors[record.status] || attendanceColors.default,
    record,
  };
};

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  month: Date;
}

export function AttendanceCalendar({ records, month }: AttendanceCalendarProps) {
  const daysInMonth = getDaysInMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <div className="flex w-full items-center gap-0.5">
        {days.map((day) => {
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const attendance = getAttendanceForDate(date, records);

          return (
            <Tooltip key={day}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                  <div className={cn("h-4 w-2 rounded-sm", attendance.color)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {format(date, 'MMM d, yyyy')} - {attendance.status}
                </p>
                {attendance.record && (
                    <div className="text-xs text-muted-foreground">
                        <p>Entry: {attendance.record.entryTime || 'N/A'}</p>
                        <p>Exit: {attendance.record.exitTime || 'N/A'}</p>
                    </div>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
