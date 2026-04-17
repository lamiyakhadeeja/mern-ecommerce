import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SALT_ROUNDS = 10;

export function generateOtpCode() {
  const n = Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1));
  return String(n).padStart(OTP_LENGTH, "0");
}

export async function saveOtp(email, purpose, plainCode) {
  const codeHash = await bcrypt.hash(plainCode, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await Otp.findOneAndUpdate(
    { email, purpose },
    { codeHash, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );
}

export async function verifyOtp(email, purpose, plainCode) {
  const doc = await Otp.findOne({ email, purpose });
  if (!doc) {
    return { ok: false, reason: "invalid" };
  }
  if (doc.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: doc._id });
    return { ok: false, reason: "expired" };
  }
  if (doc.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: doc._id });
    return { ok: false, reason: "locked" };
  }
  const match = await bcrypt.compare(plainCode, doc.codeHash);
  if (!match) {
    doc.attempts += 1;
    await doc.save();
    return { ok: false, reason: "invalid" };
  }
  await Otp.deleteOne({ _id: doc._id });
  return { ok: true };
}

export { OTP_TTL_MS, MAX_ATTEMPTS };
