
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employees } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (selectedEmployeeId) {
      login(selectedEmployeeId);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
            <div className="flex items-center gap-2 mb-4">
                 <Logo className="size-8 text-primary" />
                <span className="text-2xl font-semibold tracking-tight">
                UniSync
                </span>
                <span className="text-2xl font-light tracking-tight text-muted-foreground">
                Time
                </span>
            </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Select an employee to simulate logging in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee-select">Select User</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger id="employee-select">
                <SelectValue placeholder="Select an employee to log in as" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin} disabled={!selectedEmployeeId}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
