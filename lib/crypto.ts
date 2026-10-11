import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export type EncryptedPayload = {
  version: 1;
  algorithm: "aes-256-gcm";
  iv: string;
  tag: string;
  data: string;
};

const runtime = globalThis as typeof globalThis & { __gileadDevEncryptionKey?: Buffer };

function encryptionKey() {
  const configured = process.env.PATIENT_DATA_ENCRYPTION_KEY;
  if (configured) {
    const decoded = Buffer.from(configured, "base64");
    if (decoded.length !== 32 || decoded.toString("base64") !== configured) {
      throw new Error("PATIENT_DATA_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
    }
    return decoded;
  }
  if (process.env.NODE_ENV === "production") throw new Error("Patient data encryption is not configured.");
  return (runtime.__gileadDevEncryptionKey ??= randomBytes(32));
}

export function hashPatientIdentifier(value: string) {
  return createHmac("sha256", encryptionKey()).update(value.trim().normalize("NFKC").toLowerCase()).digest("hex");
}

export function encryptJson<T>(value: T): EncryptedPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return {
    version: 1,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

export function decryptJson<T>(payload: EncryptedPayload): T {
  if (payload.version !== 1 || payload.algorithm !== "aes-256-gcm") throw new Error("Unsupported encrypted record.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const clear = Buffer.concat([decipher.update(Buffer.from(payload.data, "base64")), decipher.final()]).toString("utf8");
  return JSON.parse(clear) as T;
}
