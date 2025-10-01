'use client';

import * as React from 'react';
import { Fingerprint, User } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Enrollment
        </h1>
        <div className="flex items-center gap-4">
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
                  {emp.name} ({emp.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Personal Data</CardTitle>
              <CardDescription>Basic employee information.</CardDescription>
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
              <div className="text-sm text-muted-foreground flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Enrolled
                </Badge>
                <Button variant="link" size="sm">
                  Re-enroll
                </Button>
              </div>
            </div>
            
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
      </div>
    </div>
  );
}