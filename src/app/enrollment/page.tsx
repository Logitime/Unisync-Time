
'use client';

import * as React from 'react';
import { Fingerprint, User, CheckCircle2, AlertCircle, Hourglass, Database, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { employees, accessAreas, type Employee } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function EnrollmentPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState(
    employees[0].id
  );
  const [employeeData, setEmployeeData] = React.useState<Employee[]>(employees);

  const selectedEmployee = employeeData.find(
    (emp) => emp.id === selectedEmployeeId
  )!;

  const handleAccessRightChange = (
    areaId: string,
    doorId: string,
    checked: boolean
  ) => {
    setEmployeeData((prevData) =>
      prevData.map((emp) => {
        if (emp.id !== selectedEmployeeId) return emp;

        const otherAccessRights =
          emp.accessRights?.filter((ar) => ar.areaId !== areaId) || [];
        const currentAreaRights = emp.accessRights?.find(
          (ar) => ar.areaId === areaId
        );
        let newDoorIds: string[];

        if (checked) {
          newDoorIds = [...(currentAreaRights?.doorIds || []), doorId];
        } else {
          newDoorIds =
            currentAreaRights?.doorIds.filter((id) => id !== doorId) || [];
        }

        const newAccessRights =
          newDoorIds.length > 0
            ? [
                ...otherAccessRights,
                { areaId: areaId, doorIds: newDoorIds },
              ]
            : otherAccessRights;
        
        return { ...emp, accessRights: newAccessRights };
      })
    );
  };

  return (
    <TooltipProvider>
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Enrollment
        </h1>
        <div className="flex items-center gap-2">
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={emp.imageUrl} alt={emp.name} data-ai-hint="person avatar" />
                      <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {emp.name} ({emp.id})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon"><PlusCircle /></Button>
            </TooltipTrigger>
            <TooltipContent>Add New Employee</TooltipContent>
          </Tooltip>
           <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon"><Pencil /></Button>
            </TooltipTrigger>
            <TooltipContent>Edit Employee</TooltipContent>
          </Tooltip>
           <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="destructive" size="icon"><Trash2 /></Button>
            </TooltipTrigger>
            <TooltipContent>Delete Employee</TooltipContent>
          </Tooltip>

          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-start gap-4">
             <Avatar className="h-20 w-20 border">
                <AvatarImage src={selectedEmployee.imageUrl} alt={selectedEmployee.name} data-ai-hint="person" />
                <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{selectedEmployee.name}</CardTitle>
              <CardDescription>
                ID: {selectedEmployee.id} <br />
                {selectedEmployee.department}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={selectedEmployee.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                defaultValue={selectedEmployee.id}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                defaultValue={selectedEmployee.department}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input
                id="enrollmentDate"
                defaultValue={selectedEmployee.enrollmentDate}
                type="date"
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
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
                    <Label>Access Permissions</Label>
                    <Accordion type="multiple" className="w-full space-y-2">
                        {accessAreas.map((area) => (
                            <AccordionItem key={area.id} value={area.id} className="rounded-md border bg-card text-sm shadow-sm">
                                <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">
                                    {area.name}
                                </AccordionTrigger>
                                <AccordionContent className="border-t">
                                    <ul className="divide-y">
                                        {area.doors.map((door) => {
                                            const hasAccess = selectedEmployee.accessRights?.find(ar => ar.areaId === area.id)?.doorIds.includes(door.id) ?? false;
                                            return (
                                                <li key={door.id} className="flex items-center justify-between p-3 px-4">
                                                    <span>{door.name}</span>
                                                    <Checkbox
                                                        checked={hasAccess}
                                                        onCheckedChange={(checked) => handleAccessRightChange(area.id, door.id, !!checked)}
                                                        id={`checkbox-${area.id}-${door.id}`}
                                                    />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Database className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Sync Status</CardTitle>
                        <CardDescription>Enrollment status across all databases.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500" />
                                <span className="font-medium">Master Database (AC1)</span>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Synced</Badge>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Hourglass className="text-amber-500 animate-spin" />
                                <span className="font-medium">Time & Attendance DB</span>
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">Syncing</Badge>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-red-500" />
                                <span className="font-medium">Access Control DB 2</span>
                            </div>
                            <Badge variant="destructive">Error</Badge>
                        </li>
                    </ul>
                    <Progress value={33} />
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
