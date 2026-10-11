import { kv } from "@vercel/kv";

type LocalState = { values: Map<string, unknown> };
const runtime = globalThis as typeof globalThis & { __gileadLocalKv?: LocalState };
const localState = (runtime.__gileadLocalKv ??= { values: new Map() });

export function hasPersistentKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function assertKvConfigured() {
  if (!hasPersistentKv() && process.env.NODE_ENV === "production") {
    throw new Error("Persistent patient storage is not configured.");
  }
}

export async function getJson<T>(key: string): Promise<T | null> {
  assertKvConfigured();
  if (hasPersistentKv()) return (await kv.get<T>(key)) ?? null;
  return (localState.values.get(key) as T | undefined) ?? null;
}

export async function setJson<T>(key: string, value: T, ttlSeconds?: number) {
  assertKvConfigured();
  if (hasPersistentKv()) {
    if (ttlSeconds) await kv.set(key, value, { ex: ttlSeconds });
    else await kv.set(key, value);
    return;
  }
  localState.values.set(key, value);
}

export async function deleteKey(key: string) {
  assertKvConfigured();
  if (hasPersistentKv()) {
    await kv.del(key);
    return;
  }
  localState.values.delete(key);
}

export async function reserveSlot(slotKey: string, bookingId: string) {
  assertKvConfigured();
  if (hasPersistentKv()) {
    const result = await kv.set(`slot:${slotKey}`, bookingId, { nx: true, ex: 60 * 60 * 24 * 120 });
    return result === "OK";
  }
  const key = `slot:${slotKey}`;
  if (localState.values.has(key)) return false;
  localState.values.set(key, bookingId);
  return true;
}

export async function releaseSlot(slotKey: string) {
  await deleteKey(`slot:${slotKey}`);
}
