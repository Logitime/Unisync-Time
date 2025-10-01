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

export type Employee = {
  id: string;
  name: string;
  department: string;
  enrollmentDate: string;
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
  name: string;
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
    department: 'Engineering',
    enrollmentDate: '2022-08-15',
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
    department: 'Marketing',
    enrollmentDate: '2021-03-10',
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
    department: 'Engineering',
    enrollmentDate: '2023-01-20',
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
    department: 'Human Resources',
    enrollmentDate: '2020-11-05',
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
    department: 'Sales',
    enrollmentDate: '2022-09-01',
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
    department: 'Human Resources',
    enrollmentDate: '2023-07-12',
    shiftAssignments: [],
    accessRights: [
        { areaId: 'area-01', doorIds: ['D001', 'D002'] },
        { areaId: 'area-03', doorIds: ['D202'] },
    ],
  },
];

export const rawAttendanceRecords: (Omit<AttendanceRecord, 'entryTime' | 'exitTime' | 'status'> & {time: string, eventType: 'Entry' | 'Exit', employeeName: string, department: string, status: AttendanceRecord['status']})[] = [
  { id: 1, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-28', time: '09:05', eventType: 'Entry', status: 'Present' },
  { id: 2, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-28', time: '17:30', eventType: 'Exit', status: 'Present' },
  { id: 3, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-28', time: '09:15', eventType: 'Entry', status: 'Late' },
  { id: 4, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-28', time: '18:00', eventType: 'Exit', status: 'Present' },
  { id: 5, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-28', time: '08:55', eventType: 'Entry', status: 'Present' },
  { id: 6, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-28', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 7, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-28', time: '09:30', eventType: 'Entry', status: 'Late' },
  { id: 8, employeeId: 'S4011', employeeName: 'Ethan Davis', department: 'Sales', date: '2024-07-28', time: '17:45', eventType: 'Exit', status: 'Present' },
  { id: 9, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-28', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 10, employeeId: 'F3109', employeeName: 'Fiona Garcia', department: 'Human Resources', date: '2024-07-28', time: '17:10', eventType: 'Exit', status: 'Present' },
  { id: 11, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-29', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 12, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-29', time: '17:05', eventType: 'Exit', status: 'Present' },
  { id: 13, employeeId: 'E1002', employeeName: 'Bob Williams', department: 'Marketing', date: '2024-07-29', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 14, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-29', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 15, employeeId: 'M2005', employeeName: 'Charlie Brown', department: 'Engineering', date: '2024-07-29', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 16, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-29', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 17, employeeId: 'F3108', employeeName: 'Diana Miller', department: 'Human Resources', date: '2024-07-29', time: '17:00', eventType: 'Exit', status: 'Present' },
  { id: 18, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-27', time: '09:00', eventType: 'Entry', status: 'Present' },
  { id: 19, employeeId: 'E1001', employeeName: 'Alice Johnson', department: 'Engineering', date: '2024-07-27', time: '17:00', eventType: 'Exit', status: 'Present' },
];

export const attendanceRecords: AttendanceRecord[] = rawAttendanceRecords.reduce((acc: AttendanceRecord[], record) => {
  let existing = acc.find(r => r.employeeId === record.employeeId && r.date === record.date);
  if (!existing) {
    existing = {
      id: record.id,
      employeeId: record.employeeId,
      date: record.date,
      entryTime: null,
      exitTime: null,
      status: record.status, // Default status from first event
    };
    acc.push(existing);
  }

  if (record.eventType === 'Entry') {
    existing.entryTime = record.time;
    // Entry status (Late/Present) is more important
    existing.status = record.status; 
  } else if (record.eventType === 'Exit') {
    existing.exitTime = record.time;
  }
  
  return acc;
}, []);


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
