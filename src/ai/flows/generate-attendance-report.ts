// src/ai/flows/generate-attendance-report.ts
'use server';

/**
 * @fileOverview Generates attendance reports based on specified parameters using a generative AI tool.
 *
 * - generateAttendanceReport - A function that generates a custom report about attendance, access events, and enrollment status.
 * - GenerateAttendanceReportInput - The input type for the generateAttendanceReport function, including parameters like date range and employee ID.
 * - GenerateAttendanceReportOutput - The return type for the generateAttendanceReport function, providing the generated report as a string.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAttendanceReportInputSchema = z.object({
  dateRange: z
    .string()
    .describe('The date range for the report (e.g., YYYY-MM-DD to YYYY-MM-DD).'),
  employeeId: z.string().describe('The employee ID to filter the report.'),
  department: z.string().describe('The department to filter the report.'),
  eventType: z.string().describe('The type of event to include in the report.'),
  additionalParameters: z
    .string()
    .optional()
    .describe('Any additional parameters for the report.'),
});

export type GenerateAttendanceReportInput = z.infer<
  typeof GenerateAttendanceReportInputSchema
>;

const GenerateAttendanceReportOutputSchema = z.object({
  report: z.string().describe('The generated attendance report.'),
});

export type GenerateAttendanceReportOutput = z.infer<
  typeof GenerateAttendanceReportOutputSchema
>;

export async function generateAttendanceReport(
  input: GenerateAttendanceReportInput
): Promise<GenerateAttendanceReportOutput> {
  return generateAttendanceReportFlow(input);
}

const generateAttendanceReportPrompt = ai.definePrompt({
  name: 'generateAttendanceReportPrompt',
  input: {schema: GenerateAttendanceReportInputSchema},
  output: {schema: GenerateAttendanceReportOutputSchema},
  prompt: `You are an AI assistant that generates custom reports about attendance, access events, and enrollment status based on specified parameters.

  You will pull data from three distinct databases:
  1. Master DB (AC1): Contains employee personal data and access rights for the primary system.
  2. Time & Attendance DB: Contains all clock-in/clock-out records.
  3. Access Control DB 2: Contains access control data for a separate, secondary system.

  Date Range: {{{dateRange}}}
  Employee ID: {{{employeeId}}}
  Department: {{{department}}}
  Event Type: {{{eventType}}}
  Additional Parameters: {{{additionalParameters}}}

  Generate a detailed report based on the above parameters, correlating data from the different sources as needed. The report should be well-formatted and easy to understand.`,
});

const generateAttendanceReportFlow = ai.defineFlow(
  {
    name: 'generateAttendanceReportFlow',
    inputSchema: GenerateAttendanceReportInputSchema,
    outputSchema: GenerateAttendanceReportOutputSchema,
  },
  async input => {
    const {output} = await generateAttendanceReportPrompt(input);
    return output!;
  }
);
