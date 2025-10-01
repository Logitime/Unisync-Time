'use client';

import {
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Pencil,
  PlusCircle,
  Timer,
  Trash2,
} from 'lucide-react';
import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  accessAreas as initialAccessAreas,
  shifts as initialShifts,
  type AccessArea,
  type Shift,
} from '@/lib/data';

function ShiftForm({
  shift,
  onSave,
  onCancel,
}: {
  shift?: Shift | null;
  onSave: (shift: Omit<Shift, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState({
    name: shift?.name || '',
    startTime: shift?.startTime || '09:00',
    endTime: shift?.endTime || '17:00',
    gracePeriod: shift?.gracePeriod || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: shift?.id, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shift-name">Shift Name</Label>
        <Input
          id="shift-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Day Shift"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shift-start">Start Time</Label>
          <Input
            id="shift-start"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shift-end">End Time</Label>
          <Input
            id="shift-end"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="grace-period">Grace Period (minutes)</Label>
        <Input
          id="grace-period"
          type="number"
          value={formData.gracePeriod}
          onChange={(e) =>
            setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })
          }
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}

export default function SettingsPage() {
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [accessAreas, setAccessAreas] = React.useState<AccessArea[]>(initialAccessAreas);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);
  const [editingShift, setEditingShift] = React.useState<Shift | null>(null);

  const handleSaveShift = (
    shiftData: Omit<Shift, 'id'> & { id?: string }
  ) => {
    if (shiftData.id) {
      setShifts(
        shifts.map((s) => (s.id === shiftData.id ? { ...s, ...shiftData } as Shift : s))
      );
    } else {
      setShifts([
        ...shifts,
        { ...shiftData, id: `shift-${Date.now()}` } as Shift,
      ]);
    }
    setIsAddFormOpen(false);
    setEditingShift(null);
  };

  const handleAddNew = () => {
    setEditingShift(null);
    setIsAddFormOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
  };

  const handleDelete = (shiftId: string) => {
    setShifts(shifts.filter((s) => s.id !== shiftId));
  };
  
  const handleHardwareChange = (areaId: string, doorId: string, field: string, value: string | number) => {
    setAccessAreas(prevAreas => 
      prevAreas.map(area => 
        area.id === areaId 
        ? {
            ...area,
            doors: area.doors.map(door => 
              door.id === doorId 
              ? {
                  ...door,
                  [field]: value
                }
              : door
            )
          }
        : area
      )
    )
  }

  const handleIoPortChange = (areaId: string, doorId: string, portType: 'input' | 'output', value: number) => {
     setAccessAreas(prevAreas => 
      prevAreas.map(area => 
        area.id === areaId 
        ? {
            ...area,
            doors: area.doors.map(door => 
              door.id === doorId 
              ? {
                  ...door,
                  ioPorts: {
                    ...door.ioPorts,
                    [portType]: value
                  }
                }
              : door
            )
          }
        : area
      )
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Data Source Settings
        </h1>
        <p className="text-muted-foreground">
          Configure connection details for your access control and time
          attendance databases.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Access Control DB 1 (Master)</CardTitle>
              <CardDescription>Primary access control system.</CardDescription>
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
                <Input
                  id="ac1-user"
                  defaultValue="admin"
                  placeholder="e.g., admin"
                />
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
                <Input
                  id="ta-user"
                  defaultValue="time_admin"
                  placeholder="e.g., time_admin"
                />
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
              <CardDescription>Secondary access control system.</CardDescription>
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

        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Timer className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Shift &amp; Attendance</CardTitle>
                    <CardDescription>
                      Define company-wide shift times and policies.
                    </CardDescription>
                  </div>
                </div>
                 <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAddNew}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>Add new shift</TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Shift</DialogTitle>
                      <DialogDescription>
                        Create a new shift schedule.
                      </DialogDescription>
                    </DialogHeader>
                    <ShiftForm
                      shift={null}
                      onSave={handleSaveShift}
                      onCancel={() => setIsAddFormOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {shifts.length > 0 ? (
                <ul className="space-y-2">
                  {shifts.map((shift) => (
                    <li
                      key={shift.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="font-medium">{shift.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime} (
                          {shift.gracePeriod} min grace)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog open={editingShift?.id === shift.id} onOpenChange={(isOpen) => !isOpen && setEditingShift(null)}>
                           <DialogTrigger asChild>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEdit(shift)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit shift</TooltipContent>
                              </Tooltip>
                           </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Shift</DialogTitle>
                              <DialogDescription>
                                Update the details for this shift.
                              </DialogDescription>
                            </DialogHeader>
                            <ShiftForm
                              shift={editingShift}
                              onSave={handleSaveShift}
                              onCancel={() => setEditingShift(null)}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete shift</TooltipContent>
                            </Tooltip>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the shift.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(shift.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  No shifts defined.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
               <div className="flex items-center gap-4">
                  <HardDrive className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Access Control Hardware</CardTitle>
                    <CardDescription>
                      Configure door controller settings.
                    </CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-2">
                {accessAreas.map(area => (
                  <AccordionItem key={area.id} value={area.id} className="rounded-md border bg-card text-sm shadow-sm">
                    <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">
                      {area.name}
                    </AccordionTrigger>
                    <AccordionContent className="border-t p-4 space-y-4">
                      {area.doors.map(door => (
                        <div key={door.id} className="rounded-md border p-4 space-y-4">
                          <h4 className="font-medium">{door.name}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`ip-${door.id}`}>IP Address</Label>
                              <Input id={`ip-${door.id}`} value={door.ip || ''} onChange={e => handleHardwareChange(area.id, door.id, 'ip', e.target.value)} placeholder="e.g., 192.168.1.10" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`port-${door.id}`}>Port</Label>
                              <Input id={`port-${door.id}`} type="number" value={door.port || ''} onChange={e => handleHardwareChange(area.id, door.id, 'port', parseInt(e.target.value))} placeholder="e.g., 8080" />
                            </div>
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`input-${door.id}`}>Input Port</Label>
                              <Input id={`input-${door.id}`} type="number" value={door.ioPorts?.input || ''} onChange={e => handleIoPortChange(area.id, door.id, 'input', parseInt(e.target.value))} placeholder="e.g., 1" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`output-${door.id}`}>Output Port</Label>
                              <Input id={`output-${door.id}`} type="number" value={door.ioPorts?.output || ''} onChange={e => handleIoPortChange(area.id, door.id, 'output', parseInt(e.target.value))} placeholder="e.g., 2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
