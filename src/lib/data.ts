export type Employee = {
  id: string;
  name: string;
  department: string;
  enrollmentDate: string;
};

export type AttendanceRecord = {
  id: number;
  employeeId: string;
  date: string;
  time: string;
  eventType: 'Entry' | 'Exit';
  status: 'Present' | 'Late' | 'Absent';
};

export const employees: Employee[] = [
  {
    id: 'E1001',
    name: 'Alice Johnson',
    department: 'Engineering',
    enrollmentDate: '2022-08-15',
  },
  {
    id: 'E1002',
    name: 'Bob Williams',
    department: 'Marketing',
    enrollmentDate: '2021-03-10',
  },
  {
    id: 'M2005',
    name: 'Charlie Brown',
    department: 'Engineering',
    enrollmentDate: '2023-01-20',
  },
  {
    id: 'F3108',
    name: 'Diana Miller',
    department: 'Human Resources',
    enrollmentDate: '2020-11-05',
  },
  {
    id: 'S4011',
    name: 'Ethan Davis',
    department: 'Sales',
    enrollmentDate: '2022-09-01',
  },
  {
    id: 'F3109',
    name: 'Fiona Garcia',
    department: 'Human Resources',
    enrollmentDate: '2023-07-12',
  },
];

export const attendanceRecords: (AttendanceRecord & { employeeName: string, department: string })[] = [
  {
    id: 1,
    employeeId: 'E1001',
    employeeName: 'Alice Johnson',
    department: 'Engineering',
    date: '2024-07-28',
    time: '09:05',
    eventType: 'Entry',
    status: 'Present',
  },
  {
    id: 2,
    employeeId: 'E1001',
    employeeName: 'Alice Johnson',
    department: 'Engineering',
    date: '2024-07-28',
    time: '17:30',
    eventType: 'Exit',
    status: 'Present',
  },
  {
    id: 3,
    employeeId: 'E1002',
    employeeName: 'Bob Williams',
    department: 'Marketing',
    date: '2024-07-28',
    time: '09:15',
    eventType: 'Entry',
    status: 'Late',
  },
  {
    id: 4,
    employeeId: 'E1002',
    employeeName: 'Bob Williams',
    department: 'Marketing',
    date: '2024-07-28',
    time: '18:00',
    eventType: 'Exit',
    status: 'Present',
  },
  {
    id: 5,
    employeeId: 'M2005',
    employeeName: 'Charlie Brown',
    department: 'Engineering',
    date: '2024-07-28',
    time: '08:55',
    eventType: 'Entry',
    status: 'Present',
  },
  {
    id: 6,
    employeeId: 'M2005',
    employeeName: 'Charlie Brown',
    department: 'Engineering',
    date: '2024-07-28',
    time: '17:00',
    eventType: 'Exit',
    status: 'Present',
  },
  {
    id: 7,
    employeeId: 'S4011',
    employeeName: 'Ethan Davis',
    department: 'Sales',
    date: '2024-07-28',
    time: '09:30',
    eventType: 'Entry',
    status: 'Late',
  },
   {
    id: 8,
    employeeId: 'S4011',
    employeeName: 'Ethan Davis',
    department: 'Sales',
    date: '2024-07-28',
    time: '17:45',
    eventType: 'Exit',
    status: 'Present',
  },
  {
    id: 9,
    employeeId: 'F3109',
    employeeName: 'Fiona Garcia',
    department: 'Human Resources',
    date: '2024-07-28',
    time: '09:00',
    eventType: 'Entry',
    status: 'Present',
  },
   {
    id: 10,
    employeeId: 'F3109',
    employeeName: 'Fiona Garcia',
    department: 'Human Resources',
    date: '2024-07-28',
    time: '17:10',
    eventType: 'Exit',
    status: 'Present',
  },
];

export const departments = [...new Set(employees.map((e) => e.department))];
export const eventTypes = ['Entry', 'Exit', 'Access Denied', 'System Login'];
