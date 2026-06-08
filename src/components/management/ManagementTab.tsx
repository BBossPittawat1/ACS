'use client';

import { Input, Popconfirm, App } from 'antd';
import { BookOpen, Edit2, Home, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ClassModal } from '@/components/management/ClassModal';
import { RoomModal } from '@/components/management/RoomModal';
import { StudentModal } from '@/components/management/StudentModal';
import { useApp } from '@/providers/AppProvider';
import type { ManagementSubTab, Student, StudentFormData } from '@/types';
import { formatStudentDisplay, matchesStudentSearch } from '@/utils/student';

export function ManagementTab() {
  const { message } = App.useApp();
  const {
    students,
    classesList,
    roomsList,
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
  } = useApp();

  const [subTab, setSubTab] = useState<ManagementSubTab>('students');
  const [searchTerm, setSearchTerm] = useState('');

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const filteredStudents = useMemo(
    () => students.filter((s) => matchesStudentSearch(s, searchTerm)),
    [students, searchTerm],
  );

  const openAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (values: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, values);
      message.success('แก้ไขข้อมูลนักเรียนเรียบร้อย');
    } else {
      await addStudent(values);
      message.success('เพิ่มนักเรียนเรียบร้อย');
    }
  };

  const handleDeleteStudent = async (id: number) => {
    await deleteStudent(id);
    message.success('ลบนักเรียนเรียบร้อย');
  };

  const openAddClass = () => {
    setEditingClass(null);
    setIsClassModalOpen(true);
  };

  const openEditClass = (name: string) => {
    setEditingClass(name);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async (name: string) => {
    if (editingClass) {
      if (await updateClass(editingClass, name)) {
        message.success('แก้ไขระดับชั้นเรียบร้อย');
      } else {
        message.error('ไม่สามารถแก้ไขได้ ชื่อซ้ำหรือข้อมูลไม่ถูกต้อง');
      }
    } else if (await addClass(name)) {
      message.success('เพิ่มระดับชั้นเรียบร้อย');
    } else {
      message.warning('ระดับชั้นนี้มีอยู่แล้ว');
    }
  };

  const handleDeleteClass = async (name: string) => {
    const count = countStudentsByClass(name);
    if (count > 0) {
      message.error(`ไม่สามารถลบได้ มีนักเรียน ${count} คนในชั้นนี้`);
      return;
    }
    if (await deleteClass(name)) {
      message.success('ลบระดับชั้นเรียบร้อย');
    }
  };

  const openAddRoom = () => {
    setEditingRoom(null);
    setIsRoomModalOpen(true);
  };

  const openEditRoom = (name: string) => {
    setEditingRoom(name);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async (name: string) => {
    if (editingRoom) {
      if (await updateRoom(editingRoom, name)) {
        message.success('แก้ไขห้องเรียนเรียบร้อย');
      } else {
        message.error('ไม่สามารถแก้ไขได้ ชื่อซ้ำหรือข้อมูลไม่ถูกต้อง');
      }
    } else if (await addRoom(name)) {
      message.success('เพิ่มห้องเรียนเรียบร้อย');
    } else {
      message.warning('ห้องนี้มีอยู่แล้ว');
    }
  };

  const handleDeleteRoom = async (name: string) => {
    const count = countStudentsByRoom(name);
    if (count > 0) {
      message.error(`ไม่สามารถลบได้ มีนักเรียน ${count} คนในห้องนี้`);
      return;
    }
    if (await deleteRoom(name)) {
      message.success('ลบห้องเรียนเรียบร้อย');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="glass-card flex p-2">
        <button
          type="button"
          onClick={() => setSubTab('students')}
          className={`btn flex-1 rounded-2xl border-none text-sm font-bold ${
            subTab === 'students'
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'bg-transparent text-primary/60 hover:bg-primary/5'
          }`}
        >
          รายชื่อนักเรียน
        </button>
        <button
          type="button"
          onClick={() => setSubTab('classes')}
          className={`btn flex-1 rounded-2xl border-none text-sm font-bold ${
            subTab === 'classes'
              ? 'bg-primary/15 text-primary shadow-sm'
              : 'bg-transparent text-primary/60 hover:bg-primary/5'
          }`}
        >
          จัดการชั้น / ห้อง
        </button>
      </div>

      {subTab === 'students' ? (
        <div className="glass-card p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">
              ฐานข้อมูลนักเรียน{' '}
              <span className="text-sm font-medium text-primary/60">({students.length})</span>
            </h3>
            <button
              type="button"
              onClick={openAddStudent}
              className="btn btn-primary btn-sm gap-2 rounded-xl border-none bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/20 md:rounded-2xl md:px-4 md:py-2.5"
            >
              <Plus size={20} />
              <span className="hidden font-medium md:inline">เพิ่มนักเรียน</span>
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/30" />
            <Input
              placeholder="ค้นหาชื่อจริง, ชื่อเล่น, ชั้น หรือ เลขที่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-2xl border-primary/10 bg-primary/5 pl-12"
            />
          </div>

          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <p className="py-10 text-center text-primary/40">ไม่พบรายชื่อนักเรียน</p>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-2xl border border-primary/5 bg-base-100 p-3 shadow-sm transition-colors hover:border-primary/20"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-base-100 bg-primary/5 text-xl shadow-inner">
                      {student.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-base-content">
                        {formatStudentDisplay(student)}
                      </p>
                      <p className="text-xs font-medium text-primary/60">
                        ชั้น {student.class}/{student.room} • เลขที่ {student.no}
                      </p>

                    </div>
                  </div>
                  <div className="ml-2 flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditStudent(student)}
                      className="btn btn-ghost btn-sm rounded-xl text-warning hover:bg-warning/10"
                      aria-label="แก้ไข"
                    >
                      <Edit2 size={18} />
                    </button>
                    <Popconfirm
                      title="ลบนักเรียน"
                      description="คุณต้องการลบรายชื่อนักเรียนคนนี้ใช่หรือไม่?"
                      onConfirm={() => handleDeleteStudent(student.id)}
                      okText="ลบ"
                      cancelText="ยกเลิก"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm rounded-xl text-error hover:bg-error/10"
                        aria-label="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ระดับชั้น */}
          <div className="glass-card flex flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                <BookOpen className="text-accent" size={20} /> ระดับชั้น
              </h3>
              <button
                type="button"
                onClick={openAddClass}
                className="btn btn-primary btn-sm gap-1 rounded-xl border-none bg-primary/80"
              >
                <Plus size={16} /> เพิ่ม
              </button>
            </div>

            <div className="mb-2 flex-1 space-y-2 overflow-y-auto pr-1">
              {classesList.length === 0 ? (
                <p className="py-8 text-center text-sm text-primary/40">ยังไม่มีระดับชั้น</p>
              ) : (
                classesList.map((c) => {
                  const count = countStudentsByClass(c);
                  return (
                    <div
                      key={c}
                      className="flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 p-3"
                    >
                      <div className="ml-1 min-w-0">
                        <span className="font-semibold text-base-content">{c}</span>
                        <p className="text-xs text-primary/50">{count} นักเรียน</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openEditClass(c)}
                          className="btn btn-ghost btn-xs rounded-lg text-warning hover:bg-warning/10"
                          aria-label="แก้ไข"
                        >
                          <Edit2 size={16} />
                        </button>
                        <Popconfirm
                          title="ลบระดับชั้น"
                          description={
                            count > 0
                              ? `มีนักเรียน ${count} คน — ต้องย้ายหรือลบนักเรียนก่อน`
                              : `ต้องการลบ "${c}" ใช่หรือไม่?`
                          }
                          onConfirm={() => handleDeleteClass(c)}
                          okText="ลบ"
                          cancelText="ยกเลิก"
                          okButtonProps={{ danger: true, disabled: count > 0 }}
                          disabled={count > 0}
                        >
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10 disabled:opacity-40"
                            disabled={count > 0}
                            aria-label="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ห้อง */}
          <div className="glass-card flex flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                <Home className="text-accent" size={20} /> ห้องเรียน
              </h3>
              <button
                type="button"
                onClick={openAddRoom}
                className="btn btn-sm gap-1 rounded-xl border-none bg-accent/80 text-accent-content"
              >
                <Plus size={16} /> เพิ่ม
              </button>
            </div>

            <div className="mb-2 flex-1 space-y-2 overflow-y-auto pr-1">
              {roomsList.length === 0 ? (
                <p className="py-8 text-center text-sm text-primary/40">ยังไม่มีห้องเรียน</p>
              ) : (
                roomsList.map((r) => {
                  const count = countStudentsByRoom(r);
                  return (
                    <div
                      key={r}
                      className="flex items-center justify-between rounded-2xl border border-accent/20 bg-accent/10 p-3"
                    >
                      <div className="ml-1 min-w-0">
                        <span className="font-semibold text-base-content">ห้อง {r}</span>
                        <p className="text-xs text-primary/50">{count} นักเรียน</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openEditRoom(r)}
                          className="btn btn-ghost btn-xs rounded-lg text-warning hover:bg-warning/10"
                          aria-label="แก้ไข"
                        >
                          <Edit2 size={16} />
                        </button>
                        <Popconfirm
                          title="ลบห้องเรียน"
                          description={
                            count > 0
                              ? `มีนักเรียน ${count} คน — ต้องย้ายหรือลบนักเรียนก่อน`
                              : `ต้องการลบห้อง "${r}" ใช่หรือไม่?`
                          }
                          onConfirm={() => handleDeleteRoom(r)}
                          okText="ลบ"
                          cancelText="ยกเลิก"
                          okButtonProps={{ danger: true, disabled: count > 0 }}
                          disabled={count > 0}
                        >
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10 disabled:opacity-40"
                            disabled={count > 0}
                            aria-label="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <StudentModal
        open={isStudentModalOpen}
        editingStudent={editingStudent}
        classesList={classesList}
        roomsList={roomsList}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
      />

      <ClassModal
        open={isClassModalOpen}
        editingName={editingClass}
        existingClasses={classesList}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
      />

      <RoomModal
        open={isRoomModalOpen}
        editingName={editingRoom}
        existingRooms={roomsList}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
      />
    </div>
  );
}
