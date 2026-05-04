import crypto from "node:crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";

// Cryptographically secure 12-char temp password. Uses rejection sampling to
// avoid modulo bias from raw randomBytes.
export function generateTempPassword(length = 12): string {
  const out: string[] = [];
  while (out.length < length) {
    const buf = crypto.randomBytes(length * 2);
    for (let i = 0; i < buf.length && out.length < length; i++) {
      const byte = buf[i];
      if (byte < Math.floor(256 / CHARS.length) * CHARS.length) {
        out.push(CHARS[byte % CHARS.length]);
      }
    }
  }
  return out.join("");
}
