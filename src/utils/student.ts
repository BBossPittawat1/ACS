import type { Student } from '@/types';

export function formatStudentDisplay(student: Student): string {
  if (student.nickname.trim()) {
    return `${student.realName} (${student.nickname})`;
  }
  return student.realName;
}

export function matchesStudentSearch(student: Student, term: string): boolean {
  const q = term.trim().toLowerCase();
  if (!q) return true;
  return (
    student.realName.toLowerCase().includes(q) ||
    student.nickname.toLowerCase().includes(q) ||
    student.class.toLowerCase().includes(q) ||
    String(student.no).includes(q)
  );
}
