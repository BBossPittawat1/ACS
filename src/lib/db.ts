import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

export async function readDb<T>(key: string, defaultValue: T): Promise<T> {
  await ensureConnection();
  try {
    const data = await client.get(key);
    if (!data) {
      await writeDb(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${key} from Redis:`, error);
    return defaultValue;
  }
}

export async function writeDb<T>(key: string, data: T): Promise<void> {
  await ensureConnection();
  try {
    await client.set(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to Redis:`, error);
    throw error;
  }
}
