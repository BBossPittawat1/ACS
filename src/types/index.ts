export type AttendanceStatus = 'present' | 'late' | 'absent';

export type ManagementSubTab = 'students' | 'classes';

export interface Student {
  id: number;
  realName: string;
  nickname: string;
  class: string;
  room: string;
  avatar: string;
  no: number;
  gender: 'M' | 'F';
}

export interface TermClassStat {
  name: string;
  percent: number;
  color: string;
}

export interface FinanceTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
  note?: string;
}

export interface FinanceRecord {
  balance: number;
  transactions: FinanceTransaction[];
}

export type FinanceRecords = Record<number, FinanceRecord>;

export interface TermData {
  totalStudents: number;
  avgAttendance: number;
  totalDays: number;
  classes: TermClassStat[];
}

export type AttendanceRecords = Record<string, Record<number, AttendanceStatus>>;

export interface StudentFormData {
  realName: string;
  nickname: string;
  class: string;
  room: string;
  no: number;
  gender: 'M' | 'F';
}

export interface ClassFormData {
  name: string;
}

export interface RoomFormData {
  name: string;
}
