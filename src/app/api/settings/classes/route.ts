import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

const FILE = 'classes.json';

export async function GET() {
  try {
    const classes = await readDb<string[]>(FILE, []);
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const classes = await readDb<string[]>(FILE, []);
    if (!classes.includes(data.name)) {
      classes.push(data.name);
      await writeDb(FILE, classes);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding class:', error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const classes = await readDb<string[]>(FILE, []);
    const index = classes.indexOf(data.oldName);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    classes[index] = data.newName;
    await writeDb(FILE, classes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

    let classes = await readDb<string[]>(FILE, []);
    const initialLength = classes.length;
    classes = classes.filter((c) => c !== name);

    if (classes.length === initialLength) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    await writeDb(FILE, classes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
