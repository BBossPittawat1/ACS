'use client';

import { Form, Input, Modal } from 'antd';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';

interface RoomModalProps {
  open: boolean;
  editingName: string | null;
  existingRooms: string[];
  onClose: () => void;
  onSave: (name: string) => void;
}

export function RoomModal({
  open,
  editingName,
  existingRooms,
  onClose,
  onSave,
}: RoomModalProps) {
  const [form] = Form.useForm<{ name: string }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name: editingName ?? '' });
    }
  }, [open, editingName, form]);

  const handleSubmit = async () => {
    try {
      const { name } = await form.validateFields();
      onSave(name.trim());
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
          {editingName ? 'แก้ไขห้องเรียน' : 'เพิ่มห้องเรียน'}
        </span>
      }
      className="[&_.ant-modal-content]:!p-6"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label={<span className="font-bold text-primary/80">เลขห้อง / ชื่อห้อง</span>}
          rules={[
            { required: true, message: 'กรุณากรอกห้องเรียน' },
            {
              validator: (_, value) => {
                const trimmed = (value as string)?.trim();
                if (!trimmed) return Promise.resolve();
                if (trimmed !== editingName && existingRooms.includes(trimmed)) {
                  return Promise.reject(new Error('ห้องนี้มีอยู่แล้ว'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="เช่น 1, 2, 3" className="rounded-2xl" />
        </Form.Item>
      </Form>

      <button
        type="button"
        onClick={handleSubmit}
        className="btn btn-primary mt-4 w-full gap-2 rounded-2xl border-none bg-gradient-to-r from-primary to-accent text-lg font-bold text-primary-content shadow-lg shadow-primary/20 hover:scale-[1.02]"
      >
        <Save className="h-5 w-5" /> บันทึก
      </button>
    </Modal>
  );
}
