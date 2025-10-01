
'use client';
import { DoorClosed, DoorOpen, ShieldAlert } from 'lucide-react';

import {
  accessAreas,
  type AccessArea,
  type Door,
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type DoorStatus = Door['status'];

function getStatusVariant(status: DoorStatus) {
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

function getStatusIcon(status: DoorStatus) {
  switch (status) {
    case 'Locked':
      return <DoorClosed className="text-muted-foreground" size={20} />;
    case 'Unlocked':
      return <DoorOpen className="text-primary" size={20} />;
    case 'Jammed':
      return <ShieldAlert className="text-destructive" size={20} />;
    default:
      return null;
  }
}

export function DoorStatusList() {
    const allDoors = accessAreas.flatMap(area => area.doors.map(door => ({...door, areaName: area.name})));
  
    return (
    <div className="space-y-4">
        <ul className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {allDoors.map((door) => (
                <li key={door.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {getStatusIcon(door.status)}
                        <div>
                            <p className="font-medium">{door.name}</p>
                            <p className="text-xs text-muted-foreground">{door.areaName}</p>
                        </div>
                    </div>
                    <Badge variant={getStatusVariant(door.status)} className="w-20 justify-center">
                        {door.status}
                    </Badge>
                </li>
            ))}
        </ul>
    </div>
  );
}
