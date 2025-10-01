'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { addDays, format, subMonths, addMonths } from 'date-fns';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  employees as initialEmployees,
  shifts,
  departments,
  type Employee,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShiftCalendar, shiftColors } from './components/shift-calendar';

export default function ShiftManagementPage() {
  const { toast } = useToast();
  const [employees, setEmployees] =
    React.useState<Employee[]>(initialEmployees);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedShiftId, setSelectedShiftId] = React.useState<string>('');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [currentMonth, setCurrentMonth] = React.useState(new Date());


  const getShiftName = (shiftId?: string) => {
    if (!shiftId) return 'Not Assigned';
    const latestAssignment = employees
      .flatMap(e => e.shiftAssignments || [])
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    
    if (shiftId) {
      return shifts.find((s) => s.id === shiftId)?.name || 'Unknown Shift';
    }
    
    if (latestAssignment) {
      return shifts.find((s) => s.id === latestAssignment.shiftId)?.name || 'Not Assigned';
    }
    
    return 'Not Assigned';
  };

  const columns: ColumnDef<Employee>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: 'shiftId',
      header: 'Current Shift',
      cell: ({ row }) => {
        const latestAssignment = [...(row.original.shiftAssignments || [])].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
        return <div className="w-28">{getShiftName(latestAssignment?.shiftId)}</div>
      },
    },
    {
        id: 'monthly-schedule',
        header: () => (
          <div className="text-center w-full">{format(currentMonth, 'MMMM yyyy')}</div>
        ),
        cell: ({ row }) => (
          <ShiftCalendar assignments={row.original.shiftAssignments || []} month={currentMonth} />
        ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.id)}
              >
                Copy employee ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: employees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  
  const handleAssignShift = () => {
    const selectedEmployeeIds = table.getSelectedRowModel().rows.map(row => row.original.id);
    if (selectedEmployeeIds.length === 0 || !selectedShiftId) {
        toast({
            variant: 'destructive',
            title: 'Assignment Failed',
            description: 'Please select at least one employee and a shift to assign.'
        })
        return;
    }
     if (!dateRange?.from || !dateRange?.to) {
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'Please select a valid date range.',
      });
      return;
    }

    const newAssignment = {
      shiftId: selectedShiftId,
      startDate: format(dateRange.from, 'yyyy-MM-dd'),
      endDate: format(dateRange.to, 'yyyy-MM-dd'),
    };
    
    setEmployees(prev => prev.map(emp => {
      if (selectedEmployeeIds.includes(emp.id)) {
        const otherAssignments = emp.shiftAssignments?.filter(
          // A simple filter to remove overlapping old assignments.
          // A more robust solution would handle partial overlaps.
          as => new Date(as.endDate) < dateRange.from! || new Date(as.startDate) > dateRange.to!
        ) || [];

        return {
          ...emp,
          shiftAssignments: [...otherAssignments, newAssignment]
        };
      }
      return emp;
    }));
    
    toast({
        title: 'Shifts Assigned',
        description: `Assigned shift to ${selectedEmployeeIds.length} employee(s) from ${format(dateRange.from, 'LLL dd, y')} to ${format(dateRange.to, 'LLL dd, y')}.`
    });

    table.resetRowSelection();
  }
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shift Management</h1>
        <p className="mt-2 text-muted-foreground">
          Assign shifts to employees individually or in bulk.
        </p>
      </div>
      <Card>
        <CardHeader>
             <CardTitle>Assign Shifts</CardTitle>
            <CardDescription>Select employees, a shift, and an optional date range, then click "Assign Shift".</CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
                <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a shift to assign" />
                </SelectTrigger>
                <SelectContent>
                    {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                    </SelectItem>
                    ))}
                    <SelectItem value="unassigned">Unassign</SelectItem>
                </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-[300px] justify-start text-left font-normal',
                        !dateRange && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Button onClick={handleAssignShift} disabled={table.getSelectedRowModel().rows.length === 0 || !selectedShiftId}>Assign Shift</Button>
            </div>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-sm">
              <span className="font-medium">Legend:</span>
              {shifts.map(shift => (
                <div key={shift.id} className="flex items-center gap-2">
                  <div className={cn("h-3 w-3 rounded-sm", shiftColors[shift.id] || shiftColors.default)} />
                  <span>{shift.name}</span>
                </div>
              ))}
               <div className="flex items-center gap-2">
                  <div className={cn("h-3 w-3 rounded-sm", shiftColors.default)} />
                  <span>Not Assigned</span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by employee name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
           <div className="ml-auto flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="w-32 text-center font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
             </div>
             <Select
              value={
                (table.getColumn('department')?.getFilterValue() as string) ?? 'all'
              }
              onValueChange={(value) => {
                if (value === 'all') {
                  table.getColumn('department')?.setFilterValue(undefined);
                } else {
                  table.getColumn('department')?.setFilterValue(value);
                }
              }}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === 'shiftId' ? 'Current Shift' : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} style={{width: header.getSize() !== 150 ? header.getSize() : undefined }}>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
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
        </div>
        </CardContent>
        </Card>
    </div>
  );
}
