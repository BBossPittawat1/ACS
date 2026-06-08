'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AttendanceRecords,
  AttendanceStatus,
  Student,
  FinanceRecords,
} from '@/types';
import { STUDENT_AVATARS } from '@/data/mockData';

interface AppContextValue {
  students: Student[];
  classesList: string[];
  roomsList: string[];
  attendanceDate: string;
  attendanceRecords: AttendanceRecords;
  financeRecords: FinanceRecords;
  isLoading: boolean;
  setAttendanceDate: (date: string) => void;
  markAttendance: (studentId: number, status: AttendanceStatus | null) => void;
  saveAttendance: (date: string) => Promise<void>;
  addTransaction: (studentId: number, amount: number, type: 'deposit' | 'withdraw', note?: string) => Promise<void>;
  addStudent: (data: Omit<Student, 'id' | 'avatar'>) => Promise<void>;
  updateStudent: (id: number, data: Omit<Student, 'id' | 'avatar'>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  addClass: (name: string) => Promise<boolean>;
  updateClass: (oldName: string, newName: string) => Promise<boolean>;
  deleteClass: (name: string) => Promise<boolean>;
  addRoom: (name: string) => Promise<boolean>;
  updateRoom: (oldName: string, newName: string) => Promise<boolean>;
  deleteRoom: (name: string) => Promise<boolean>;
  countStudentsByClass: (className: string) => number;
  countStudentsByRoom: (roomName: string) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classesList, setClassesList] = useState<string[]>([]);
  const [roomsList, setRoomsList] = useState<string[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(todayISO);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecords>({});
  const [financeRecords, setFinanceRecords] = useState<FinanceRecords>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsRes, classesRes, roomsRes, attendanceRes, financeRes] = await Promise.all([
        fetch('/api/settings/students'),
        fetch('/api/settings/classes'),
        fetch('/api/settings/rooms'),
        fetch('/api/attendance'),
        fetch('/api/finance'),
      ]);

      if (!studentsRes.ok || !classesRes.ok || !roomsRes.ok || !attendanceRes.ok || !financeRes.ok) {
        throw new Error('Failed to fetch initial data');
      }

      const [studentsData, classesData, roomsData, attendanceData, financeData] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
        roomsRes.json(),
        attendanceRes.json(),
        financeRes.json(),
      ]);

      setStudents(studentsData || []);
      setClassesList(classesData || []);
      setRoomsList(roomsData || []);
      setAttendanceRecords(attendanceData || {});
      setFinanceRecords(financeData || {});
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const countStudentsByClass = useCallback(
    (className: string) => students.filter((s) => s.class === className).length,
    [students],
  );

  const countStudentsByRoom = useCallback(
    (roomName: string) => students.filter((s) => s.room === roomName).length,
    [students],
  );

  const markAttendance = useCallback(
    (studentId: number, status: AttendanceStatus | null) => {
      setAttendanceRecords((prev) => {
        const currentRecords = { ...(prev[attendanceDate] || {}) };
        if (status === null) {
          delete currentRecords[studentId];
        } else {
          currentRecords[studentId] = status;
        }
        return {
          ...prev,
          [attendanceDate]: currentRecords,
        };
      });
    },
    [attendanceDate],
  );

  const saveAttendance = useCallback(
    async (date: string) => {
      const recordsToSave = attendanceRecords[date] ?? {};
      try {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          body: JSON.stringify({ date, records: recordsToSave }),
        });
        if (!res.ok) throw new Error('Failed to save attendance');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [attendanceRecords],
  );

  const addTransaction = useCallback(async (studentId: number, amount: number, type: 'deposit' | 'withdraw', note?: string) => {
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        body: JSON.stringify({ studentId, amount, type, note }),
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      const data = await res.json();
      
      setFinanceRecords(prev => ({
        ...prev,
        [studentId]: {
          balance: data.balance,
          transactions: prev[studentId]?.transactions ? [...prev[studentId].transactions, data.transaction] : [data.transaction]
        }
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const addStudent = useCallback(async (data: Omit<Student, 'id' | 'avatar'>) => {
    const avatar = data.gender === 'M' ? '👦🏻' : '👧🏻';
    const newStudent = { ...data, id: Date.now(), avatar };
    
    // Optimistic update
    setStudents((prev) => [...prev, newStudent]);
    
    try {
      const res = await fetch('/api/settings/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) throw new Error('Failed to save student');
    } catch (error) {
      console.error(error);
      // Revert on error
      setStudents((prev) => prev.filter((s) => s.id !== newStudent.id));
      throw error;
    }
  }, []);

  const updateStudent = useCallback(
    async (id: number, data: Omit<Student, 'id' | 'avatar'>) => {
      const originalStudents = [...students];
      const avatar = data.gender === 'M' ? '👦🏻' : '👧🏻';
      const updatedData = { ...data, avatar };
      
      // Optimistic update
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)),
      );

      try {
        const res = await fetch('/api/settings/students', {
          method: 'PUT',
          body: JSON.stringify({ id, ...updatedData }),
        });
        if (!res.ok) throw new Error('Failed to update student');
      } catch (error) {
        console.error(error);
        // Revert on error
        setStudents(originalStudents);
        throw error;
      }
    },
    [students],
  );

  const deleteStudent = useCallback(async (id: number) => {
    const originalStudents = [...students];
    
    // Optimistic update
    setStudents((prev) => prev.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/settings/students?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete student');
    } catch (error) {
      console.error(error);
      // Revert on error
      setStudents(originalStudents);
      throw error;
    }
  }, [students]);

  const addClass = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (classesList.includes(trimmed)) return false;

    const originalClasses = [...classesList];
    setClassesList((prev) => [...prev, trimmed]);

    try {
      const res = await fetch('/api/settings/classes', {
        method: 'POST',
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to add class');
      return true;
    } catch (error) {
      console.error(error);
      setClassesList(originalClasses);
      return false;
    }
  }, [classesList]);

  const updateClass = useCallback(async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return false;
    if (classesList.includes(trimmed)) return false;

    const originalClasses = [...classesList];
    const originalStudents = [...students];

    setClassesList((prev) => prev.map((c) => (c === oldName ? trimmed : c)));
    setStudents((prev) => prev.map((s) => (s.class === oldName ? { ...s, class: trimmed } : s)));

    try {
      const res = await fetch('/api/settings/classes', {
        method: 'PUT',
        body: JSON.stringify({ oldName, newName: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to update class');
      return true;
    } catch (error) {
      console.error(error);
      setClassesList(originalClasses);
      setStudents(originalStudents);
      return false;
    }
  }, [classesList, students]);

  const deleteClass = useCallback(async (name: string) => {
    const inUse = students.some((s) => s.class === name);
    if (inUse) return false;

    const originalClasses = [...classesList];
    setClassesList((prev) => prev.filter((c) => c !== name));

    try {
      const res = await fetch(`/api/settings/classes?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete class');
      return true;
    } catch (error) {
      console.error(error);
      setClassesList(originalClasses);
      return false;
    }
  }, [students, classesList]);

  const addRoom = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (roomsList.includes(trimmed)) return false;

    const originalRooms = [...roomsList];
    setRoomsList((prev) => [...prev, trimmed]);

    try {
      const res = await fetch('/api/settings/rooms', {
        method: 'POST',
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to add room');
      return true;
    } catch (error) {
      console.error(error);
      setRoomsList(originalRooms);
      return false;
    }
  }, [roomsList]);

  const updateRoom = useCallback(async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return false;
    if (roomsList.includes(trimmed)) return false;

    const originalRooms = [...roomsList];
    const originalStudents = [...students];

    setRoomsList((prev) => prev.map((r) => (r === oldName ? trimmed : r)));
    setStudents((prev) => prev.map((s) => (s.room === oldName ? { ...s, room: trimmed } : s)));

    try {
      const res = await fetch('/api/settings/rooms', {
        method: 'PUT',
        body: JSON.stringify({ oldName, newName: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to update room');
      return true;
    } catch (error) {
      console.error(error);
      setRoomsList(originalRooms);
      setStudents(originalStudents);
      return false;
    }
  }, [roomsList, students]);

  const deleteRoom = useCallback(async (name: string) => {
    const inUse = students.some((s) => s.room === name);
    if (inUse) return false;

    const originalRooms = [...roomsList];
    setRoomsList((prev) => prev.filter((r) => r !== name));

    try {
      const res = await fetch(`/api/settings/rooms?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete room');
      return true;
    } catch (error) {
      console.error(error);
      setRoomsList(originalRooms);
      return false;
    }
  }, [students, roomsList]);

  const value = useMemo<AppContextValue>(
    () => ({
      students,
      classesList,
      roomsList,
      attendanceDate,
      attendanceRecords,
      financeRecords,
      isLoading,
      setAttendanceDate,
      markAttendance,
      saveAttendance,
      addTransaction,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      addRoom,
      updateRoom,
      deleteRoom,
      countStudentsByClass,
      countStudentsByRoom,
    }),
    [
      students,
      classesList,
      roomsList,
      attendanceDate,
      attendanceRecords,
      financeRecords,
      isLoading,
      markAttendance,
      saveAttendance,
      addTransaction,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      addRoom,
      updateRoom,
      deleteRoom,
      countStudentsByClass,
      countStudentsByRoom,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
