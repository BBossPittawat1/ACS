import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import type { AttendanceRecords } from '@/types';

const FILE = 'attendance.json';

export async function GET() {
  try {
    const records = await readDb<AttendanceRecords>(FILE, {});
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { date, records: newRecords } = data;

    if (!date || !newRecords) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dbRecords = await readDb<AttendanceRecords>(FILE, {});
    
    // Merge or replace the date's records
    dbRecords[date] = { ...dbRecords[date], ...newRecords };
    
    await writeDb(FILE, dbRecords);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
