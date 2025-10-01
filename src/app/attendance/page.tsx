import { AttendanceTable } from '@/app/reports/components/attendance-table';

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
      <p className="text-muted-foreground">
        Browse and search all employee attendance records.
      </p>
      <AttendanceTable />
    </div>
  );
}
