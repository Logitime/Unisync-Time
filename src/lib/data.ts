
import { subDays, format } from 'date-fns';

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod: number; // in minutes
};

export type ShiftAssignment = {
  shiftId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type UserRole = 'admin' | 'supervisor' | 'employee';

export type Employee = {
  id: string;
  name: string;
  imageUrl: string;
  department: string;
  enrollmentDate: string;
  role: UserRole;
  shiftAssignments?: ShiftAssignment[];
  accessRights?: { areaId: string; doorIds: string[] }[];
};

export type AttendanceRecord = {
  id: number;
  employeeId: string;
  date: string; // YYYY-MM-DD
  entryTime: string | null; // HH:MM
  exitTime: string | null; // HH:MM
  status: 'Present' | 'Late' | 'Absent';
};

export type Door = {
  id: string;
  name: string;
  status: 'Locked' | 'Unlocked' | 'Jammed';
  ip?: string;
  port?: number;
  ioPorts?: {
    input: number;
    output: number;
  };
};

export type AccessArea = {
  id: string;
  name:string;
  description: string;
  doors: Door[];
};

export const shifts: Shift[] = [
  {
    id: 'shift-1',
    name: 'Day Shift',
    startTime: '09:00',
    endTime: '17:00',
    gracePeriod: 10,
  },
  {
    id: 'shift-2',
    name: 'Night Shift',
    startTime: '17:00',
    endTime: '01:00',
    gracePeriod: 10,
  },
    {
    id: 'shift-3',
    name: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    gracePeriod: 5,
  },
];

export const employees: Employee[] = [
  {
    id: 'E1001',
    name: 'Alice Johnson',
    imageUrl: 'https://picsum.photos/seed/2/32/32',
    department: 'Engineering',
    enrollmentDate: '2022-08-15',
    role: 'admin',
    shiftAssignments: [
        { shiftId: 'shift-1', startDate: '2024-07-01', endDate: '2024-07-15'},
        { shiftId: 'shift-2', startDate: '2024-07-16', endDate: '2024-07-31'},
    ],
    accessRights: [
      { areaId: 'area-01', doorIds: ['D001', 'D002'] },
      { areaId: 'area-02', doorIds: ['D101'] },
    ],
  },
  {
    id: 'E1002',
    name: 'Bob Williams',
    imageUrl: 'https://picsum.photos/seed/3/32/32',
    department: 'Marketing',
    enrollmentDate: '2021-03-10',
    role: 'supervisor',
    shiftAssignments: [
        { shiftId: 'shift-1', startDate: '2024-07-01', endDate: '2024-07-31'},
    ],
    accessRights: [
        { areaId: 'area-01', doorIds: ['D001'] }
    ],
  },
  {
    id: 'M2005',
    name: 'Charlie Brown',
    imageUrl: 'https://picsum.photos/seed/4/32/32',
    department: 'Engineering',
    enrollmentDate: '2023-01-20',
    role: 'employee',
     shiftAssignments: [
        { shiftId: 'shift-3', startDate: '2024-07-01', endDate: '2024-07-31'},
    ],
    accessRights: [
      { areaId: 'area-01', doorIds: ['D001', 'D002', 'D003'] },
      { areaId: 'area-02', doorIds: ['D101', 'D102'] },
    ],
  },
  {
    id: 'F3108',
    name: 'Diana Miller',
    imageUrl: 'https://picsum.photos/seed/5/32/32',
    department: 'Human Resources',
    enrollmentDate: '2020-11-05',
    role: 'employee',
     shiftAssignments: [
        { shiftId: 'shift-1', startDate: '2024-07-01', endDate: '2024-07-31'},
    ],
    accessRights: [
        { areaId: 'area-01', doorIds: ['D001', 'D002'] },
        { areaId: 'area-03', doorIds: ['D202'] },
    ],
  },
  {
    id: 'S4011',
    name: 'Ethan Davis',
    imageUrl: 'https://picsum.photos/seed/6/32/32',
    department: 'Sales',
    enrollmentDate: '2022-09-01',
    role: 'employee',
    shiftAssignments: [
        { shiftId: 'shift-2', startDate: '2024-07-01', endDate: '2024-07-31'},
    ],
     accessRights: [
        { areaId: 'area-01', doorIds: ['D001'] }
    ],
  },
  {
    id: 'F3109',
    name: 'Fiona Garcia',
    imageUrl: 'https://picsum.photos/seed/7/32/32',
    department: 'Human Resources',
    enrollmentDate: '2023-07-12',
    role: 'supervisor',
    shiftAssignments: [],
    accessRights: [
        { areaId: 'area-01', doorIds: ['D001', 'D002'] },
        { areaId: 'area-03', doorIds: ['D202'] },
    ],
  },
];

export const userRoles: UserRole[] = ['admin', 'supervisor', 'employee'];

export const rawAttendanceRecords: (Omit<AttendanceRecord, 'entryTime' | 'exitTime'> & {time: string, eventType: 'Entry' | 'Exit' | 'Absent', employeeName: string, department: string, status: AttendanceRecord['status']})[] = [
  { id: 1, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-01', time: '09:05', eventType: 'Entry', status: 'Present' },
  { id: 2, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-01', time: '17:30', eventType: 'Exit', status: 'Present' },
  { id: 3, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-01', time: '09:15', eventType: 'Entry', status: 'Late' },
  { id: 4, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-01', time: '18:00', eventType: 'Exit', status: 'Present' },
  { id: 5, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-01', time: '06:00', eventType: 'Entry', status: 'Present' },
  { id: 6, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-01', time: '14:00', eventType: 'Exit', status: 'Present' },
  { id: 7, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-01', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 8, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-01', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 9, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-01', time: '17:30', eventType: 'Entry', status: 'Late' },
  { id: 10, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-01', time: '01:00', eventType: 'Exit', status: 'Present' },
  { id: 11, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-01', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 12, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-01', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 13, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-02', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 14, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-02', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 15, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-02', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 16, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-02', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 17, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-03', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 18, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-03', time: '06:05', eventType: 'Entry', status: 'Present' },
  { id: 19, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-03', time: '14:00', eventType: 'Exit', status: 'Present' },
  { id: 20, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-03', time: '17:00', eventType: 'Entry', status: 'Present' },
  { id: 21, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-03', time: '01:00', eventType: 'Exit', status: 'Present' },
  { id: 22, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-04', time: '09:20', eventType: 'Entry', status: 'Late' },
  { id: 23, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-04', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 24, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-04', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 25, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-04', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 26, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-05', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 27, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-05', time: '09:12', eventType: 'Entry', status: 'Late' },
  { id: 28, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-05', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 29, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-06', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 30, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-06', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 31, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-05', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 32, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-05', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 33, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-04', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 34, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-04', time: '17:15', eventType: 'Entry', status: 'Late' },
  { id: 35, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-04', time: '01:30', eventType: 'Exit', status: 'Present' },
  { id: 36, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-06', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 37, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-06', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 38, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-08', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 39, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-08', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 40, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-08', time: '09:30', eventType: 'Entry', status: 'Late' },
  { id: 41, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-08', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 42, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-08', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 43, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-08', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 44, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-08', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 45, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-08', time: '17:00', eventType: 'Entry', status: 'Present' },
  { id: 46, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-08', time: '01:00', eventType: 'Exit', status: 'Present' },
  { id: 47, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-08', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 48, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-08', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 49, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-09', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 50, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-09', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 51, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-09', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 52, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-09', time: '06:00', eventType: 'Entry', status: 'Present' },
  { id: 53, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-09', time: '14:00', eventType: 'Exit', status: 'Present' },
  { id: 54, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-10', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 55, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-10', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 56, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-10', time: '09:05', eventType: 'Entry', status: 'Present' },
  { id: 57, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-10', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 58, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-10', time: '06:10', eventType: 'Entry', status: 'Late' },
  { id: 59, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-10', time: '14:00', eventType: 'Exit', status: 'Present' },
  { id: 60, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-10', time: '00:00', eventType: 'Absent', status: 'Absent' },
  { id: 61, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-10', time: '17:00', eventType: 'Entry', status: 'Present' },
  { id: 62, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-10', time: '01:00', eventType: 'Exit', status: 'Present' },
  { id: 63, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-10', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 64, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-10', time: '17:00', eventType: 'Exit', status: 'Present' }
];

const processAttendanceData = (
  records: Array<Omit<AttendanceRecord, 'entryTime' | 'exitTime'> & {time: string, eventType: string, status: AttendanceRecord['status']}>
): AttendanceRecord[] => {
    const attendanceMap: Map<string, Partial<AttendanceRecord> & { statuses: Set<AttendanceRecord['status']> }> = new Map();

    records.forEach(record => {
        const key = `${record.employeeId}|${record.date}`;
        if (!attendanceMap.has(key)) {
            attendanceMap.set(key, { 
                id: record.id,
                employeeId: record.employeeId,
                date: record.date,
                entryTime: null,
                exitTime: null,
                statuses: new Set()
            });
        }

        const current = attendanceMap.get(key)!;
        if (record.id < current.id!) {
            current.id = record.id;
        }

        current.statuses.add(record.status);

        if (record.eventType === 'Entry' && (!current.entryTime || record.time < current.entryTime)) {
            current.entryTime = record.time;
        }

        if (record.eventType === 'Exit' && (!current.exitTime || record.time > current.exitTime)) {
            current.exitTime = record.time;
        }
    });

    return Array.from(attendanceMap.values()).map(val => {
        let status: AttendanceRecord['status'] = 'Present';
        if (val.statuses.has('Absent')) {
            status = 'Absent';
             val.entryTime = null;
             val.exitTime = null;
        } else if (val.statuses.has('Late')) {
            status = 'Late';
        }
        
        return {
            id: val.id!,
            employeeId: val.employeeId!,
            date: val.date!,
            entryTime: val.entryTime,
            exitTime: val.exitTime,
            status: status
        };
    }).sort((a, b) => a.id - b.id);
};


export const attendanceRecords: AttendanceRecord[] = processAttendanceData(rawAttendanceRecords);


export const accessAreas: AccessArea[] = [
  {
    id: 'area-01',
    name: 'Main Office',
    description: 'General access area for all employees.',
    doors: [
      { id: 'D001', name: 'Main Entrance', status: 'Unlocked', ip: '192.168.1.10', port: 8080, ioPorts: { input: 1, output: 2 } },
      { id: 'D002', name: 'Lobby', status: 'Unlocked', ip: '192.168.1.11', port: 8080, ioPorts: { input: 1, output: 2 } },
      { id: 'D003', name: 'East Wing Hallway', status: 'Locked', ip: '192.168.1.12', port: 8080, ioPorts: { input: 1, output: 2 } },
    ],
  },
  {
    id: 'area-02',
    name: 'Server Room',
    description: 'Restricted access for IT personnel only.',
    doors: [
      { id: 'D101', name: 'Server Room Door', status: 'Locked', ip: '192.168.2.10', port: 9000, ioPorts: { input: 3, output: 4 } },
      { id: 'D102', name: 'Maintenance Hatch', status: 'Locked' },
    ],
  },
  {
    id: 'area-03',
    name: 'Executive Suite',
    description: 'Access limited to executive staff.',
    doors: [
      { id: 'D201', name: 'CEO Office', status: 'Locked' },
      { id: 'D202', name: 'Boardroom', status: 'Unlocked' },
    ],
  },
   {
    id: 'area-04',
    name: 'Warehouse',
    description: 'Shipping and receiving area.',
    doors: [
      { id: 'D301', name: 'Loading Bay 1', status: 'Unlocked' },
      { id: 'D302', name: 'Loading Bay 2', status: 'Jammed' },
      { id: 'D303', name: 'Staff Entrance', status: 'Locked' },
    ],
  },
];


export const departments = [...new Set(employees.map((e) => e.department))];
export const eventTypes = ['Entry', 'Exit', 'Access Denied', 'System Login'];


// Data for Charts

// 1. Daily Attendance Trends
const last5Days = Array.from({ length: 5 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();

export const dailyAttendanceData = last5Days.map(date => {
  const recordsForDay = attendanceRecords.filter(r => r.date === date);
  return {
    date,
    present: recordsForDay.filter(r => r.status === 'Present').length,
    late: recordsForDay.filter(r => r.status === 'Late').length,
    absent: recordsForDay.filter(r => r.status === 'Absent').length,
  };
});

// 2. Door Status Overview
const allDoors = accessAreas.flatMap(area => area.doors);
const doorStatusCounts = allDoors.reduce((acc, door) => {
  const status = door.status.toLowerCase();
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const doorStatusData = Object.entries(doorStatusCounts).map(([status, count]) => ({
  status: status.charAt(0).toUpperCase() + status.slice(1),
  count,
  fill: status === 'unlocked' ? 'hsl(var(--chart-2))' : status === 'locked' ? 'hsl(var(--chart-3))' : 'hsl(var(--destructive))',
}));
