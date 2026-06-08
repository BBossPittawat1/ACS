import fs from 'fs/promises';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'database');

async function ensureDbDir() {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

export async function readDb<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await writeDb(filename, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

export async function writeDb<T>(filename: string, data: T): Promise<void> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
