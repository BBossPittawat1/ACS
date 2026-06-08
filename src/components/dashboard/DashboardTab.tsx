'use client';

import { Select, DatePicker } from 'antd';
import { Check, ChevronDown, Clock, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);
dayjs.locale('th');

import { ProgressBar, StatCard } from '@/components/dashboard/DashboardWidgets';
import { useApp } from '@/providers/AppProvider';

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'term1' | 'term2';

const TIME_FRAMES: { value: TimeFrame; label: string }[] = [
  { value: 'daily', label: 'รายวัน' },
  { value: 'weekly', label: 'รายสัปดาห์' },
  { value: 'monthly', label: 'รายเดือน' },
  { value: 'term1', label: 'เทอม 1' },
  { value: 'term2', label: 'เทอม 2' },
];

function isDateInFrame(dateStr: string, frame: TimeFrame, targetDate: dayjs.Dayjs): boolean {
  const date = dayjs(dateStr);
  const target = targetDate;
  
  if (frame === 'daily') return date.isSame(target, 'day');
  if (frame === 'weekly') {
    return date.isAfter(target.startOf('week').subtract(1, 'day')) && 
           date.isBefore(target.endOf('week').add(1, 'day'));
  }
  if (frame === 'monthly') return date.isSame(target, 'month');
  
  const targetMonth = target.month() + 1; // 1 to 12
  const targetYear = target.year();
  const academicYear = (frame === 'term1' || frame === 'term2') ? targetYear : (targetMonth >= 5 ? targetYear : targetYear - 1);
  
  if (frame === 'term1') {
    const start = dayjs(`${academicYear}-05-01`).startOf('month');
    const end = dayjs(`${academicYear}-10-31`).endOf('month');
    return date.isAfter(start.subtract(1, 'day')) && date.isBefore(end.add(1, 'day'));
  }
  
  if (frame === 'term2') {
    const start = dayjs(`${academicYear}-11-01`).startOf('month');
    const end = dayjs(`${academicYear + 1}-03-31`).endOf('month');
    return date.isAfter(start.subtract(1, 'day')) && date.isBefore(end.add(1, 'day'));
  }
  
  return true;
}

export function DashboardTab() {
  const { students, attendanceRecords } = useApp();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  const stats = useMemo(() => {
    const filteredDates = Object.keys(attendanceRecords).filter(d => isDateInFrame(d, timeFrame, selectedDate));
    const totalDays = filteredDates.length;
    
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;
    const classStats: Record<string, { present: number; total: number }> = {};
    
    filteredDates.forEach(d => {
      const records = attendanceRecords[d];
      Object.entries(records).forEach(([studentIdStr, status]) => {
        const studentId = Number(studentIdStr);
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        if (!classStats[student.class]) {
          classStats[student.class] = { present: 0, total: 0 };
        }
        classStats[student.class].total += 1;
        
        if (status === 'present') {
          totalPresent += 1;
          classStats[student.class].present += 1;
        } else if (status === 'late') {
          totalLate += 1;
        } else if (status === 'absent') {
          totalAbsent += 1;
        }
      });
    });
    
    const totalRecords = totalPresent + totalLate + totalAbsent;
    const avgAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
    
    const classProgress = Object.entries(classStats)
      .map(([name, stat]) => {
        const percent = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
        let color = 'bg-primary';
        if (percent >= 80) color = 'bg-success';
        else if (percent >= 60) color = 'bg-warning';
        else color = 'bg-error';
        return { name, percent, color };
      })
      .sort((a, b) => b.percent - a.percent);

    return {
      totalDays,
      avgAttendance,
      present: totalPresent,
      late: totalLate,
      absent: totalAbsent,
      classProgress
    };
  }, [attendanceRecords, students, timeFrame, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="glass-card relative overflow-hidden p-6">
        <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
          <Sparkles className="h-24 w-24" />
        </div>

        <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-primary">สวัสดีคุณครูเก้า 🌸</h2>
            <p className="text-primary/70">สรุปข้อมูลภาพรวมของนักเรียน</p>
          </div>

          <div className="relative w-full md:w-auto flex gap-2">
            <Select
              value={timeFrame}
              onChange={setTimeFrame}
              options={TIME_FRAMES}
              className="w-full min-w-[140px] [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-primary/20 [&_.ant-select-selector]:!bg-primary/5 [&_.ant-select-selector]:!font-bold [&_.ant-select-selector]:!text-primary"
              suffixIcon={<ChevronDown className="h-4 w-4 text-primary/50" />}
            />
            <DatePicker
              value={selectedDate}
              onChange={(d) => d && setSelectedDate(d)}
              picker={
                timeFrame === 'daily'
                  ? 'date'
                  : timeFrame === 'weekly'
                  ? 'week'
                  : timeFrame === 'monthly'
                  ? 'month'
                  : 'year'
              }
              format={
                timeFrame === 'daily'
                  ? 'D-MMM-BB'
                  : timeFrame === 'weekly'
                  ? 'ww-BB'
                  : timeFrame === 'monthly'
                  ? 'MMMM BB'
                  : 'BBBB'
              }
              allowClear={false}
              className="min-w-[140px] [&_.ant-picker]:!rounded-2xl [&_.ant-picker]:!border-primary/20 [&_.ant-picker]:!bg-primary/5 [&_.ant-picker]:!font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <p className="mb-1 text-sm font-medium text-primary/70">นักเรียนทั้งหมด</p>
            <p className="text-3xl font-bold text-primary">
              {students.length}{' '}
              <span className="text-base font-normal text-primary/50">คน</span>
            </p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="mb-1 text-sm font-medium text-accent/80">มาเรียนเฉลี่ย</p>
            <p className="text-3xl font-bold text-accent">
              {stats.avgAttendance}
              <span className="text-base font-normal text-accent/60">%</span>
            </p>
          </div>
          <div className="col-span-2 hidden rounded-2xl border border-secondary/30 bg-secondary/20 p-4 md:col-span-1 md:block">
            <p className="mb-1 text-sm font-medium text-secondary-content/70">
              บันทึกข้อมูลแล้ว
            </p>
            <p className="text-3xl font-bold text-secondary-content">
              {stats.totalDays}{' '}
              <span className="text-base font-normal text-secondary-content/60">วัน</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 px-2 text-lg font-bold text-primary">
          <Clock className="h-5 w-5 text-primary/60" /> สถานะ ({TIME_FRAMES.find(t => t.value === timeFrame)?.label})
        </h3>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatCard
            title="มาเรียน"
            count={stats.present}
            icon={<Check className="h-5 w-5" />}
            colorClass="bg-success/10 text-success border-success/20"
          />
          <StatCard
            title="ลา"
            count={stats.late}
            icon={<Clock className="h-5 w-5" />}
            colorClass="bg-warning/10 text-warning border-warning/20"
          />
          <StatCard
            title="ขาด"
            count={stats.absent}
            icon={<X className="h-5 w-5" />}
            colorClass="bg-error/10 text-error border-error/20"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-6 text-lg font-bold text-primary">
          อัตราการเข้าเรียนแยกตามชั้น
        </h3>
        <div className="space-y-5">
          {stats.classProgress.length === 0 ? (
            <p className="text-center text-primary/50 py-4">ไม่มีข้อมูลในช่วงเวลานี้</p>
          ) : (
            stats.classProgress.map((cls) => (
              <ProgressBar
                key={cls.name}
                label={cls.name}
                percent={cls.percent}
                colorClass={cls.color}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
