import type { Student, TermData } from '@/types';

export const INITIAL_CLASSES = ['ป.5'];

export const INITIAL_ROOMS = ['1'];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    realName: 'ด.ญ. พิมพ์ลภัส ใจดี',
    nickname: 'พิม',
    class: 'ป.5',
    room: '1',
    avatar: '👧🏻',
    no: 1,
    gender: 'F',
  },
  {
    id: 2,
    realName: 'ด.ช. อชิระ รักเรียน',
    nickname: 'อชิ',
    class: 'ป.5',
    room: '1',
    avatar: '👦🏽',
    no: 2,
    gender: 'M',
  },
  {
    id: 3,
    realName: 'ด.ญ. ณัฐริกา สดใส',
    nickname: 'มิ้นท์',
    class: 'ป.5',
    room: '1',
    avatar: '👧🏼',
    no: 3,
    gender: 'F',
  },
];

export const MOCK_TERM_DATA: Record<string, TermData> = {
  '1/2569': {
    totalStudents: 3,
    avgAttendance: 96.5,
    totalDays: 42,
    classes: [{ name: 'ประถมศึกษาปีที่ 5', percent: 98, color: 'bg-primary' }],
  },
  '2/2568': {
    totalStudents: 3,
    avgAttendance: 91.2,
    totalDays: 100,
    classes: [{ name: 'ประถมศึกษาปีที่ 5', percent: 92, color: 'bg-primary' }],
  },
};

export const TERMS = Object.keys(MOCK_TERM_DATA);

export const STUDENT_AVATARS = [
  '👧🏻',
  '👦🏽',
  '👧🏼',
  '👦🏻',
  '👧🏽',
  '👱🏻‍♀️',
  '🧒🏻',
  '👩🏻',
];
