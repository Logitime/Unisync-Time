import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceTable } from './components/attendance-table';
import { ReportGenerator } from './components/report-generator';
import { CardDescription } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <CardDescription className="mt-2">
          Generate custom AI-powered reports or browse raw attendance data.
        </CardDescription>
      </div>
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">AI Report Generator</TabsTrigger>
          <TabsTrigger value="browse">Browse Data</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <ReportGenerator />
        </TabsContent>
        <TabsContent value="browse">
          <AttendanceTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
