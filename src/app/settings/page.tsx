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
            <CardTitle>Access Control DB 1</CardTitle>
            <CardDescription>
              Primary access control system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ac1-url">Database URL</Label>
              <Input
                id="ac1-url"
                placeholder="e.g., mysql://server.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac1-user">Username</Label>
              <Input id="ac1-user" placeholder="e.g., admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac1-pass">Password</Label>
              <Input id="ac1-pass" type="password" />
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

        <Card>
          <CardHeader>
            <CardTitle>Time Attendance DB</CardTitle>
            <CardDescription>
              Main time and attendance database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ta-url">Database URL</Label>
              <Input
                id="ta-url"
                placeholder="e.g., mssql://timeserver.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ta-user">Username</Label>
              <Input id="ta-user" placeholder="e.g., time_admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ta-pass">Password</Label>
              <Input id="ta-pass" type="password" />
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
