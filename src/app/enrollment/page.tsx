import { Fingerprint, Landmark, User, History } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { employees, attendanceRecords } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EnrollmentPage() {
  const employee = employees[0];
  const employeeAttendance = attendanceRecords.filter(
    (record) => record.employeeId === employee.id
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Enrollment
        </h1>
        <div className="flex items-center gap-4">
          <Select defaultValue={employee.id}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Personal Data</CardTitle>
                <CardDescription>
                  Basic employee information.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={employee.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" defaultValue={employee.id} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue={employee.department} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  defaultValue={employee.enrollmentDate}
                  type="date"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Fingerprint className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>
                  Manage credentials and permissions.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Biometric Status</Label>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Enrolled</Badge>
                  <Button variant="link" size="sm">
                    Re-enroll
                  </Button>
                </p>
              </div>
              <div className="space-y-2">
                <Label>Access Groups</Label>
                <Select defaultValue="engineering-general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering-general">
                      Engineering - General
                    </SelectItem>
                    <SelectItem value="marketing-general">
                      Marketing - General
                    </SelectItem>
                    <SelectItem value="hr-admin">HR - Admin</SelectItem>
                    <SelectItem value="all-access">All Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <History className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Recent attendance records for {employee.name}.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeAttendance.length > 0 ? (
                      employeeAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.time}</TableCell>
                          <TableCell>{record.eventType}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === 'Present'
                                  ? 'secondary'
                                  : record.status === 'Late'
                                    ? 'default'
                                    : 'destructive'
                              }
                              className={
                                record.status === 'Late'
                                  ? 'bg-amber-500 text-white'
                                  : ''
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No attendance records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
