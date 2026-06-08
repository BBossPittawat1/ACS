import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

const FILE = 'rooms.json';

export async function GET() {
  try {
    const rooms = await readDb<string[]>(FILE, []);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const rooms = await readDb<string[]>(FILE, []);
    if (!rooms.includes(data.name)) {
      rooms.push(data.name);
      await writeDb(FILE, rooms);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding room:', error);
    return NextResponse.json({ error: 'Failed to add room' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const rooms = await readDb<string[]>(FILE, []);
    const index = rooms.indexOf(data.oldName);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    rooms[index] = data.newName;
    await writeDb(FILE, rooms);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

    let rooms = await readDb<string[]>(FILE, []);
    const initialLength = rooms.length;
    rooms = rooms.filter((r) => r !== name);

    if (rooms.length === initialLength) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    await writeDb(FILE, rooms);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
