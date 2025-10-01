import {
  AlertTriangle,
  Building2,
  CalendarClock,
  Database,
  Users,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { attendanceRecords, employees, departments } from '@/lib/data';

export default function DashboardPage() {
  const recentAttendance = attendanceRecords.slice(0, 5);
  const issuesCount = attendanceRecords.filter(
    (r) => r.status === 'Late' || r.status === 'Absent'
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total active departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DB Sync Status
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Synced</div>
            <p className="text-xs text-muted-foreground">
              All databases are up-to-date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuesCount}</div>
            <p className="text-xs text-muted-foreground">
              Late arrivals or absences
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employeeName}
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>{record.eventType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === 'Present'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
