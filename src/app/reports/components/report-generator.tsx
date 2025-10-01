'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, Copy, Download, Loader2 } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { handleGenerateReport } from '@/app/reports/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { departments, employees, eventTypes } from '@/lib/data';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  eventType: z.string().optional(),
  additionalParameters: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function downloadTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ReportGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [report, setReport] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: addDays(new Date(), -7),
        to: new Date(),
      },
      employeeId: '',
      department: '',
      eventType: '',
      additionalParameters: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsGenerating(true);
    setReport(null);

    const input = {
      ...values,
      dateRange: `${format(values.dateRange.from, 'yyyy-MM-dd')} to ${format(
        values.dateRange.to,
        'yyyy-MM-dd'
      )}`,
      employeeId: values.employeeId || 'all',
      department: values.department || 'all',
      eventType: values.eventType || 'all',
    };

    const result = await handleGenerateReport(input);
    setIsGenerating(false);

    if (result.success) {
      setReport(result.report);
      toast({
        title: 'Report Generated',
        description: 'Your report has been successfully created.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generate AI Report</CardTitle>
          <CardDescription>
            Fill in the parameters to generate a custom report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value.from && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'LLL dd, y')} -{' '}
                                  {format(field.value.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(field.value.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={{ from: field.value.from, to: field.value.to }}
                          onSelect={(range) => field.onChange(range || { from: new Date(), to: new Date() })}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="All Employees" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">All Employees</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">All Events</SelectItem>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalParameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Focus on unauthorized access attempts.'"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Generated Report</CardTitle>
          <CardDescription>
            The AI-generated report will appear below.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isGenerating && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          {report && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted/30 p-4">
              {report}
            </div>
          )}
          {!isGenerating && !report && (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-md border border-dashed">
              <p className="text-muted-foreground">
                Your report will be shown here.
              </p>
            </div>
          )}
        </CardContent>
        {report && (
          <CardFooter className="justify-end gap-2">
             <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(report);
                toast({ title: "Copied to clipboard!" });
              }}
            >
              <Copy className="mr-2" /> Copy
            </Button>
            <Button onClick={() => downloadTxt(report, "ai_report.txt")}>
              <Download className="mr-2" /> Download
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
