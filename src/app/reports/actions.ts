'use server';

import {
  generateAttendanceReport,
  type GenerateAttendanceReportInput,
} from '@/ai/flows/generate-attendance-report';
import { z } from 'zod';

const ActionInputSchema = z.object({
  dateRange: z.string(),
  employeeId: z.string(),
  department: z.string(),
  eventType: z.string(),
  additionalParameters: z.string().optional(),
});

export async function handleGenerateReport(
  rawInput: GenerateAttendanceReportInput
) {
  const parseResult = ActionInputSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await generateAttendanceReport(parseResult.data);
    return { success: true, report: result.report };
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, error: 'Failed to generate report.' };
  }
}
