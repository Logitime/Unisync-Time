'use client';

import * as React from 'react';
import { Download, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendanceRecords, type AttendanceRecord } from '@/lib/data';

function downloadCsv(data: (AttendanceRecord & { employeeName: string, department: string })[]) {
  const headers = ['ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Time', 'Event Type', 'Status'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      [
        row.id,
        row.employeeId,
        `"${row.employeeName}"`,
        `"${row.department}"`,
        row.date,
        row.time,
        row.eventType,
        row.status,
      ].join(',')
    )
  ];
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'attendance_report.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


export function AttendanceTable() {
  const [filter, setFilter] = React.useState('');

  const filteredData = attendanceRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(filter.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(filter.toLowerCase()) ||
      record.department.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consolidated Attendance Data</CardTitle>
        <div className="flex items-center justify-between pt-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by employee, ID, or department..."
              className="pl-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => downloadCsv(filteredData)}>
            <Download className="mr-2" />
            Download CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{record.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{record.department}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="hidden sm:table-cell">{record.time}</TableCell>
                    <TableCell>{record.eventType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === 'Present'
                            ? 'secondary'
                            : record.status === 'Late' ? 'default' : 'destructive'
                        }
                        className={record.status === 'Late' ? 'bg-amber-500 text-white' : ''}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
