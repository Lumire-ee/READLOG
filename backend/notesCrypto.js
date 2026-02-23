import crypto from "crypto";

const ENCRYPTED_PREFIX = "enc:v1";

function getKey() {
  const raw = process.env.NOTES_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("NOTES_ENCRYPTION_KEY is required");
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("NOTES_ENCRYPTION_KEY must be base64-encoded 32 bytes");
  }

  return key;
}

export function encryptNote(plainText) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTED_PREFIX,
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptNote(value) {
  if (value == null) return null;
  if (typeof value !== "string") return value;

  if (!value.startsWith(`${ENCRYPTED_PREFIX}:`)) {
    // Backward compatibility for legacy plain-text rows.
    return value;
  }

  const parts = value.split(":");
  if (parts.length !== 5) {
    throw new Error("Invalid encrypted note format");
  }

  const [, , ivB64, tagB64, encryptedB64] = parts;
  const key = getKey();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
