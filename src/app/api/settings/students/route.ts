import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import type { Student } from '@/types';

const FILE = 'students.json';

export async function GET() {
  try {
    const students = await readDb<Student[]>(FILE, []);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const students = await readDb<Student[]>(FILE, []);
    students.push(data);
    await writeDb(FILE, students);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const students = await readDb<Student[]>(FILE, []);
    const index = students.findIndex((s) => s.id === data.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    students[index] = { ...students[index], ...data };
    await writeDb(FILE, students);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const id = Number(idStr);

    let students = await readDb<Student[]>(FILE, []);
    const initialLength = students.length;
    students = students.filter((s) => s.id !== id);

    if (students.length === initialLength) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    await writeDb(FILE, students);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
