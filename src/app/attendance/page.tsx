import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceTable } from '@/app/reports/components/attendance-table';
import { CardDescription } from '@/components/ui/card';
import { AttendanceByEmployee } from './components/attendance-by-employee';

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
        <p className="text-muted-foreground">
          Browse and search all employee attendance records.
        </p>
      </div>

      <Tabs defaultValue="by-employee" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-employee">By Employee</TabsTrigger>
          <TabsTrigger value="browse-records">Browse Records</TabsTrigger>
        </TabsList>
        <TabsContent value="by-employee">
          <AttendanceByEmployee />
        </TabsContent>
        <TabsContent value="browse-records">
          <AttendanceTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
