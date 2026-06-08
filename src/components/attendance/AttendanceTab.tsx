'use client';

import { App, DatePicker, Select } from 'antd';
import { Calendar as CalendarIcon, Check, ChevronDown, Clock, X, Save, Undo2 } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);
dayjs.locale('th');
import { useMemo, useState } from 'react';
import { useApp } from '@/providers/AppProvider';
import type { AttendanceStatus } from '@/types';
import { formatStudentDisplay } from '@/utils/student';

interface AttendanceButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  colorClass: string;
  onClick: () => void;
}

function AttendanceButton({
  label,
  icon,
  active,
  colorClass,
  onClick,
}: AttendanceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-sm flex-1 gap-1.5 rounded-xl border-none font-medium md:w-24 ${
        active
          ? `${colorClass} scale-105 text-white shadow-md`
          : 'bg-base-100 text-base-content/50 hover:bg-base-200'
      }`}
    >
      {icon}
      <span className="text-xs sm:text-sm">{label}</span>
    </button>
  );
}

export function AttendanceTab() {
  const {
    students,
    classesList,
    roomsList,
    attendanceDate,
    attendanceRecords,
    setAttendanceDate,
    markAttendance,
    saveAttendance,
  } = useApp();

  const { message } = App.useApp();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedClass, setSelectedClass] = useState(classesList[0] ?? '');
  const [selectedRoom, setSelectedRoom] = useState(roomsList[0] ?? '');

  const filteredStudents = useMemo(
    () =>
      students
        .filter((s) => s.class === selectedClass && s.room === selectedRoom)
        .sort((a, b) => a.no - b.no),
    [students, selectedClass, selectedRoom],
  );

  const currentRecords = attendanceRecords[attendanceDate] ?? {};

  const handleMark = (studentId: number, status: AttendanceStatus | null) => {
    markAttendance(studentId, status);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAttendance(attendanceDate);
      setHasUnsavedChanges(false);
      message.success('บันทึกข้อมูลเรียบร้อย');
    } catch (error) {
      message.error('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 gap-3">
            <div className="flex-1">
              <label className="label ml-1 py-0">
                <span className="label-text text-xs font-medium text-primary/70">
                  ระดับชั้น
                </span>
              </label>
              <Select
                value={selectedClass}
                onChange={setSelectedClass}
                options={classesList.map((c) => ({ value: c, label: c }))}
                className="w-full [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-primary/20 [&_.ant-select-selector]:!bg-primary/5 [&_.ant-select-selector]:!font-medium"
                suffixIcon={<ChevronDown className="h-4 w-4 text-primary/50" />}
              />
            </div>
            <div className="w-24">
              <label className="label ml-1 py-0">
                <span className="label-text text-xs font-medium text-primary/70">ห้อง</span>
              </label>
              <Select
                value={selectedRoom}
                onChange={setSelectedRoom}
                options={roomsList.map((r) => ({ value: r, label: r }))}
                className="w-full [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-primary/20 [&_.ant-select-selector]:!bg-primary/5 [&_.ant-select-selector]:!text-center [&_.ant-select-selector]:!font-medium"
                suffixIcon={<ChevronDown className="h-4 w-4 text-primary/50" />}
              />
            </div>
          </div>

          <div className="md:w-52">
            <label className="label ml-1 py-0">
              <span className="label-text text-xs font-medium text-primary/70">วันที่</span>
            </label>
            <DatePicker
              value={dayjs(attendanceDate)}
              onChange={(date) => {
                if (date) {
                  setAttendanceDate(date.format('YYYY-MM-DD'));
                  setHasUnsavedChanges(false);
                }
              }}
              className="w-full [&_.ant-picker]:!rounded-2xl [&_.ant-picker]:!border-primary/20 [&_.ant-picker]:!bg-primary/5 [&_.ant-picker]:!font-medium"
              suffixIcon={<CalendarIcon className="h-4 w-4 text-primary/50" />}
              format="D-MMM-BB"
              allowClear={false}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-primary">
          รายชื่อนักเรียน{' '}
          <span className="ml-2 text-sm font-medium text-primary/60">
            ({filteredStudents.length} คน)
          </span>
        </h3>
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm rounded-full border-none bg-gradient-to-r from-primary to-accent px-4 font-bold text-primary-content shadow-sm transition-all hover:scale-105"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary/20 bg-base-100/50 py-12 text-center text-primary/50">
            <p>ไม่พบรายชื่อนักเรียนในห้องนี้</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const status = currentRecords[student.id];
            return (
              <div
                key={student.id}
                className="card border border-primary/5 bg-base-100/90 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="card-body flex flex-col items-center gap-4 p-3 md:flex-row md:p-4">
                  <div className="flex w-full items-center gap-4 md:flex-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-base-100 bg-gradient-to-br from-primary/15 to-secondary/30 text-3xl shadow-inner">
                      {student.avatar}
                    </div>
                    <div>
                      <p className="text-base font-bold text-base-content">
                        {formatStudentDisplay(student)}
                      </p>
                      <p className="text-xs font-medium text-primary/60">
                        เลขที่ {student.no} • {student.class}/{student.room}
                      </p>
                      {student.nickname && (
                        <p className="text-xs text-primary/40">{student.realName}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-2 rounded-2xl bg-primary/5 p-1.5 md:w-auto">
                    <AttendanceButton
                      label="มา"
                      icon={<Check className="h-4 w-4" />}
                      active={status === 'present'}
                      colorClass="btn-success"
                      onClick={() => handleMark(student.id, 'present')}
                    />
                    <AttendanceButton
                      label="ลา"
                      icon={<Clock className="h-4 w-4" />}
                      active={status === 'late'}
                      colorClass="btn-warning"
                      onClick={() => handleMark(student.id, 'late')}
                    />
                    <AttendanceButton
                      label="ขาด"
                      icon={<X className="h-4 w-4" />}
                      active={status === 'absent'}
                      colorClass="btn-error"
                      onClick={() => handleMark(student.id, 'absent')}
                    />
                    {status && (
                      <button
                        onClick={() => handleMark(student.id, null)}
                        className="btn btn-ghost btn-circle btn-sm ml-1 text-base-content/40 transition-colors hover:bg-error/10 hover:text-error"
                        title="ยกเลิกการเลือก"
                      >
                        <Undo2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
