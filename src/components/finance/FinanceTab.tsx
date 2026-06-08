'use client';

import { App, Modal, InputNumber } from 'antd';
import { PiggyBank, Receipt, ArrowDownToLine, ArrowUpFromLine, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '@/providers/AppProvider';

export function FinanceTab() {
  const { students, financeRecords, addTransaction } = useApp();
  const { message } = App.useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const studentFinance = selectedStudent ? financeRecords[selectedStudent.id] : null;
  const currentBalance = studentFinance?.balance || 0;

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!selectedStudentId || amount <= 0) {
      message.error('กรุณาระบุจำนวนเงินให้ถูกต้อง');
      return;
    }
    
    if (type === 'withdraw' && amount > currentBalance) {
      message.error('ยอดเงินไม่เพียงพอสำหรับการถอน');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction(selectedStudentId, amount, type, note);
      message.success(type === 'deposit' ? 'ทำรายการฝากเงินสำเร็จ' : 'ทำรายการถอนเงินสำเร็จ');
      setAmount(0);
      setNote('');
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการทำรายการ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBankMoney = Object.values(financeRecords).reduce((sum, record) => sum + record.balance, 0);

  return (
    <div className="space-y-6">
      <div className="glass-card relative overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/20 p-4">
            <PiggyBank className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary/70">ยอดเงินฝากรวมทั้งหมด</p>
            <p className="text-3xl font-bold text-primary">
              {totalBankMoney.toLocaleString()} <span className="text-lg font-normal">฿</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/40" />
        <input
          type="text"
          placeholder="ค้นหานักเรียน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border-2 border-primary/10 bg-white/50 py-3 pl-12 pr-4 text-primary outline-none backdrop-blur-sm transition-all focus:border-primary/30 focus:bg-white/80"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filteredStudents.map((student) => {
          const balance = financeRecords[student.id]?.balance || 0;
          return (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className="glass-card group flex items-center justify-between p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/20 text-2xl shadow-inner">
                  {student.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{student.realName} ({student.nickname})</h4>
                  <p className="text-xs text-primary/60">เลขที่ {student.no} • {student.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-primary/50 mb-0.5">ยอดเงิน</p>
                <p className="font-bold text-accent text-lg">
                  {balance.toLocaleString()} <span className="text-xs">฿</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!selectedStudentId}
        onCancel={() => {
          setSelectedStudentId(null);
          setAmount(0);
          setNote('');
        }}
        footer={null}
        destroyOnHidden
        className="[&_.ant-modal-content]:rounded-3xl [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:overflow-hidden"
      >
        {selectedStudent && (
          <div className="bg-base-100">
            <div className="bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-content">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl shadow-inner backdrop-blur-md">
                {selectedStudent.avatar}
              </div>
              <h2 className="text-2xl font-bold">{selectedStudent.realName}</h2>
              <p className="text-primary-content/80">({selectedStudent.nickname})</p>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-primary-content/80">ยอดเงินคงเหลือ</p>
                <p className="text-4xl font-bold tracking-tight">
                  {currentBalance.toLocaleString()} <span className="text-xl font-normal">฿</span>
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-primary/70">จำนวนเงิน (บาท)</label>
                  <InputNumber
                    min={1}
                    value={amount}
                    onChange={(v) => setAmount(v || 0)}
                    className="w-full !rounded-xl !border-primary/20 [&_.ant-input-number-input]:!py-3 [&_.ant-input-number-input]:!text-lg [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary"
                    placeholder="0"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[10, 20, 50, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`flex-1 rounded-xl py-2 font-bold transition-all ${amount === val ? 'bg-primary text-primary-content shadow-md' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                    >
                      +{val}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-primary/70">บันทึกช่วยจำ (ถ้ามี)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="เช่น ค่าขนม, คืนเงิน..."
                    className="w-full rounded-xl border-2 border-primary/10 bg-primary/5 px-4 py-2 text-primary outline-none transition-colors focus:border-primary/30"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleTransaction('deposit')}
                  disabled={isSubmitting || amount <= 0}
                  className="btn btn-success flex-1 rounded-2xl text-lg font-bold shadow-lg shadow-success/20 transition-all hover:scale-105"
                >
                  <ArrowDownToLine className="mr-2 h-5 w-5" />
                  ฝากเงิน
                </button>
                <button
                  onClick={() => handleTransaction('withdraw')}
                  disabled={isSubmitting || amount <= 0 || amount > currentBalance}
                  className="btn btn-error flex-1 rounded-2xl text-lg font-bold shadow-lg shadow-error/20 transition-all hover:scale-105"
                >
                  <ArrowUpFromLine className="mr-2 h-5 w-5" />
                  ถอนเงิน
                </button>
              </div>

              {studentFinance && studentFinance.transactions.length > 0 && (
                <div className="mt-8">
                  <h4 className="mb-4 flex items-center font-bold text-primary">
                    <Receipt className="mr-2 h-5 w-5" /> ประวัติรายการ
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {studentFinance.transactions.slice().reverse().map(tx => (
                      <div key={tx.id} className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 p-3">
                        <div className="flex flex-col">
                          <span className={`font-bold ${tx.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                            {tx.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'}
                          </span>
                          <span className="text-xs text-primary/50">
                            {new Date(tx.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {tx.note && <span className="text-xs text-primary/70 mt-1">{tx.note}</span>}
                        </div>
                        <span className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ฿
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
