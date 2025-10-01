import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Data Source Settings
      </h1>
      <p className="text-muted-foreground">
        Configure connection details for your access control and time attendance
        databases.
      </p>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Access Control DB 1 (Master)</CardTitle>
            <CardDescription>
              Primary access control system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Successfully connected to the database.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="ac1-url">Database URL</Label>
              <Input
                id="ac1-url"
                defaultValue="mysql://server.example.com"
                placeholder="e.g., mysql://server.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac1-user">Username</Label>
              <Input id="ac1-user" defaultValue="admin" placeholder="e.g., admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac1-pass">Password</Label>
              <Input id="ac1-pass" type="password" defaultValue="password" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Attendance DB</CardTitle>
            <CardDescription>
              Main time and attendance database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Successfully connected to the database.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="ta-url">Database URL</Label>
              <Input
                id="ta-url"
                defaultValue="mssql://timeserver.example.com"
                placeholder="e.g., mssql://timeserver.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ta-user">Username</Label>
              <Input id="ta-user" defaultValue="time_admin" placeholder="e.g., time_admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ta-pass">Password</Label>
              <Input id="ta-pass" type="password" defaultValue="password" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Control DB 2</CardTitle>
            <CardDescription>
              Secondary access control system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                Could not connect. Please check credentials.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="ac2-url">Database URL</Label>
              <Input
                id="ac2-url"
                placeholder="e.g., postgres://server2.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac2-user">Username</Label>
              <Input id="ac2-user" placeholder="e.g., user" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac2-pass">Password</Label>
              <Input id="ac2-pass" type="password" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
