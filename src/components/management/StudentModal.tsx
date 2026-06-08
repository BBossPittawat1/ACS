'use client';

import { Form, Input, InputNumber, Modal, Select, Radio } from 'antd';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';
import type { Student, StudentFormData } from '@/types';

interface StudentModalProps {
  open: boolean;
  editingStudent: Student | null;
  classesList: string[];
  roomsList: string[];
  onClose: () => void;
  onSave: (values: StudentFormData) => void;
}

export function StudentModal({
  open,
  editingStudent,
  classesList,
  roomsList,
  onClose,
  onSave,
}: StudentModalProps) {
  const [form] = Form.useForm<StudentFormData>();

  useEffect(() => {
    if (open) {
      if (editingStudent) {
        form.setFieldsValue({
          realName: editingStudent.realName,
          nickname: editingStudent.nickname,
          class: editingStudent.class,
          room: editingStudent.room,
          no: editingStudent.no,
          gender: editingStudent.gender,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          class: classesList[0] ?? '',
          room: roomsList[0] ?? '',
          gender: 'M',
        });
      }
    }
  }, [open, editingStudent, classesList, roomsList, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...values,
        nickname: values.nickname?.trim() ?? '',
      });
      onClose();
    } catch {
      // validation failed
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={<X className="h-5 w-5 text-primary/50" />}
      title={
        <span className="text-xl font-bold text-primary">
          {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
        </span>
      }
      className="[&_.ant-modal-content]:!p-6"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="realName"
          label={<span className="font-bold text-primary/80">ชื่อจริง</span>}
          rules={[{ required: true, message: 'กรุณากรอกชื่อจริง' }]}
        >
          <Input placeholder="ด.ช. / ด.ญ. ชื่อ-นามสกุล" className="rounded-2xl" />
        </Form.Item>

        <Form.Item
          name="gender"
          label={<span className="font-bold text-primary/80">เพศ</span>}
          rules={[{ required: true, message: 'กรุณาเลือกเพศ' }]}
        >
          <Radio.Group className="flex gap-4">
            <Radio value="M">เด็กชาย</Radio>
            <Radio value="F">เด็กหญิง</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="nickname"
          label={<span className="font-bold text-primary/80">ชื่อเล่น</span>}
        >
          <Input placeholder="เช่น พิม, อชิ (ไม่บังคับ)" className="rounded-2xl" />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="class"
            label={<span className="font-bold text-primary/80">ระดับชั้น</span>}
            rules={[{ required: true, message: 'กรุณาเลือกชั้น' }]}
            className="flex-1"
          >
            <Select
              options={classesList.map((c) => ({ value: c, label: c }))}
              placeholder="เลือกชั้น"
              notFoundContent="ไม่มีชั้นเรียน"
            />
          </Form.Item>

          <Form.Item
            name="room"
            label={<span className="font-bold text-primary/80">ห้อง</span>}
            rules={[{ required: true, message: 'กรุณาเลือกห้อง' }]}
            className="w-28"
          >
            <Select
              options={roomsList.map((r) => ({ value: r, label: r }))}
              placeholder="-"
              notFoundContent="-"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="no"
          label={<span className="font-bold text-primary/80">เลขที่</span>}
          rules={[{ required: true, message: 'กรุณากรอกเลขที่' }]}
        >
          <InputNumber placeholder="เช่น 1" min={1} className="w-full rounded-2xl" />
        </Form.Item>
      </Form>

      <button
        type="button"
        onClick={handleSubmit}
        className="btn btn-primary mt-4 w-full gap-2 rounded-2xl border-none bg-gradient-to-r from-primary to-accent text-lg font-bold text-primary-content shadow-lg shadow-primary/20 hover:scale-[1.02]"
      >
        <Save className="h-5 w-5" /> บันทึกข้อมูล
      </button>
    </Modal>
  );
}
