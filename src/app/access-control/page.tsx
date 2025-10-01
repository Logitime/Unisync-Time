'use client';

import * as React from 'react';
import { DoorClosed, DoorOpen, PlusCircle, ShieldAlert } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { accessAreas, type AccessArea, type Door } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function getStatusVariant(status: Door['status']) {
  switch (status) {
    case 'Locked':
      return 'secondary';
    case 'Unlocked':
      return 'default';
    case 'Jammed':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getStatusIcon(status: Door['status']) {
  switch (status) {
    case 'Locked':
      return <DoorClosed className="text-muted-foreground" />;
    case 'Unlocked':
      return <DoorOpen className="text-primary" />;
    case 'Jammed':
      return <ShieldAlert className="text-destructive" />;
    default:
      return null;
  }
}

export default function AccessControlPage() {
  const [areas, setAreas] = React.useState<AccessArea[]>(accessAreas);

  const handleDoorToggle = (areaId: string, doorId: string) => {
    setAreas((prevAreas) =>
      prevAreas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              doors: area.doors.map((door) =>
                door.id === doorId
                  ? {
                      ...door,
                      status:
                        door.status === 'Locked' ? 'Unlocked' : 'Locked',
                    }
                  : door
              ),
            }
          : area
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
        <Button>
          <PlusCircle className="mr-2" /> Add New Area
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage security zones, door controls, and access permissions.
      </p>

      <Accordion type="multiple" defaultValue={['area-01']} className="w-full space-y-4">
        {areas.map((area) => (
          <AccordionItem key={area.id} value={area.id} className="rounded-lg border bg-card shadow-sm">
            <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                <div>
                    {area.name}
                    <p className="text-sm font-normal text-muted-foreground">{area.description}</p>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="border-t">
                    <ul className="divide-y">
                        {area.doors.map((door) => (
                            <li key={door.id} className="flex items-center justify-between p-4 px-6">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(door.status)}
                                    <span className="font-medium">{door.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant={getStatusVariant(door.status)} className="w-24 justify-center">
                                        {door.status}
                                    </Badge>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id={`door-switch-${door.id}`}
                                            checked={door.status === 'Unlocked'}
                                            onCheckedChange={() => handleDoorToggle(area.id, door.id)}
                                            disabled={door.status === 'Jammed'}
                                            aria-label={`Toggle lock for ${door.name}`}
                                        />
                                        <Label htmlFor={`door-switch-${door.id}`} className="text-sm text-muted-foreground">
                                            {door.status === 'Unlocked' ? 'Unlocked' : 'Locked'}
                                        </Label>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
