'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import { format, subMonths, addMonths, differenceInMinutes, parse } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  employees,
  departments,
  attendanceRecords,
  type Employee,
  type AttendanceRecord,
} from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceCalendar, attendanceColors } from './attendance-calendar';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const calculateTotalHours = (records: AttendanceRecord[], month: Date): string => {
    const monthStr = format(month, 'yyyy-MM');
    const monthlyRecords = records.filter(r => r.date.startsWith(monthStr));
    
    const totalMinutes = monthlyRecords.reduce((total, record) => {
        if (record.entryTime && record.exitTime) {
            const entry = parse(record.entryTime, 'HH:mm', new Date(record.date));
            const exit = parse(record.exitTime, 'HH:mm', new Date(record.date));
            return total + differenceInMinutes(exit, entry);
        }
        return total;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}

const calculateAttendancePercentage = (records: AttendanceRecord[], month: Date): number => {
    const monthStr = format(month, 'yyyy-MM');
    const monthlyRecords = records.filter(r => r.date.startsWith(monthStr));
    const presentOrLateDays = monthlyRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    
    // Assuming a fixed number of workdays for simplicity, e.g., 22
    const totalWorkDays = 22; 

    if (totalWorkDays === 0) return 0;
    
    return Math.round((presentOrLateDays / totalWorkDays) * 100);
}

export function AttendanceByEmployee() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date('2024-07-01'));
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');

  const data = React.useMemo(() => {
    return employees.filter(employee => {
        const departmentMatch = departmentFilter === 'all' || employee.department === departmentFilter;
        return departmentMatch;
    })
  }, [departmentFilter]);


  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="w-32">
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-xs text-muted-foreground">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <div className="w-24">{row.getValue('department')}</div>,
    },
    {
        id: 'monthly-attendance',
        header: () => (
          <div className="text-center w-full">{format(currentMonth, 'MMMM yyyy')}</div>
        ),
        cell: ({ row }) => {
            const employeeRecords = attendanceRecords.filter(r => r.employeeId === row.original.id);
            return <AttendanceCalendar records={employeeRecords} month={currentMonth} />
        },
    },
    {
        id: 'total-hours',
        header: 'Total Hours',
        cell: ({ row }) => {
             const employeeRecords = attendanceRecords.filter(r => r.employeeId === row.original.id);
            return (
                <div className="font-medium text-right w-24">
                    {calculateTotalHours(employeeRecords, currentMonth)}
                </div>
            )
        }
    },
    {
        id: 'attendance-percentage',
        header: 'Presence %',
        cell: ({ row }) => {
            const employeeRecords = attendanceRecords.filter(r => r.employeeId === row.original.id);
            const percentage = calculateAttendancePercentage(employeeRecords, currentMonth);
            return (
                <div className="w-28 space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">{percentage}%</div>
                </div>
            )
        }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
        globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }
  
  const rows = table.getRowModel().rows;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance by Employee</CardTitle>
        <CardDescription>
          Monthly attendance summary for each employee.
        </CardDescription>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Filter by employee name..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-8"
                />
            </div>
            <div className="flex items-center gap-4">
                <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                        {dept}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="w-32 text-center font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
                    <Button variant="outline" size="icon" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-sm">
            <span className="font-medium">Legend:</span>
            {Object.entries(attendanceColors).map(([status, color]) => (
                status !== 'default' &&
                <div key={status} className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-sm", color)} />
                    <span>{status}</span>
                </div>
            ))}
            <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-sm", attendanceColors.default)} />
                <span>No Record</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows?.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
