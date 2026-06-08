import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import type { FinanceRecords, FinanceTransaction } from '@/types';

const FILE = 'finance.json';

export async function GET() {
  try {
    const records = await readDb<FinanceRecords>(FILE, {});
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch finance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { studentId, amount, type, note } = data;

    if (!studentId || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const records = await readDb<FinanceRecords>(FILE, {});
    
    if (!records[studentId]) {
      records[studentId] = { balance: 0, transactions: [] };
    }

    const transaction: FinanceTransaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      amount: Number(amount),
      type,
      date: new Date().toISOString(),
      note,
    };

    records[studentId].transactions.push(transaction);
    if (type === 'deposit') {
      records[studentId].balance += Number(amount);
    } else if (type === 'withdraw') {
      records[studentId].balance -= Number(amount);
    }

    await writeDb(FILE, records);
    
    return NextResponse.json({ success: true, transaction, balance: records[studentId].balance });
  } catch (error) {
    console.error('Error saving finance record:', error);
    return NextResponse.json({ error: 'Failed to save finance record' }, { status: 500 });
  }
}
