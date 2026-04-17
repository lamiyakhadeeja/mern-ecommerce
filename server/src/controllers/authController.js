import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMail } from "../services/mail.js";
import { generateOtpCode, saveOtp, verifyOtp } from "../services/otp.js";

const SALT_ROUNDS = 10;
const MIN_PASSWORD = 6;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    const err = new Error("JWT_SECRET is not configured on the server");
    err.statusCode = 500;
    throw err;
  }
  return secret;
}

function signToken(userId) {
  return jwt.sign({ id: userId.toString() }, getJwtSecret(), { expiresIn: "7d" });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function authResponse(user, token) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified !== false,
    token,
  };
}

async function sendSignupOtpEmail(email, code) {
  await sendMail({
    to: email,
    subject: "Verify your TechStore account",
    text: `Your verification code is: ${code}\n\nIt expires in 15 minutes.\nIf you didn't create an account, ignore this email.`,
    html: `<p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p><p>It expires in 15 minutes.</p>`,
  });
}

async function sendPasswordResetOtpEmail(email, code) {
  await sendMail({
    to: email,
    subject: "Reset your TechStore password",
    text: `Your password reset code is: ${code}\n\nIt expires in 15 minutes.\nIf you didn't request this, ignore this email.`,
    html: `<p>Your password reset code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p><p>It expires in 15 minutes.</p>`,
  });
}

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !email || !password) {
    const err = new Error("Please provide name, email, and password");
    err.statusCode = 400;
    throw err;
  }
  if (!isValidEmail(email)) {
    const err = new Error("Please provide a valid email address");
    err.statusCode = 400;
    throw err;
  }
  if (password.length < MIN_PASSWORD) {
    const err = new Error(`Password must be at least ${MIN_PASSWORD} characters`);
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const existing = await User.findOne({ email });

  if (existing && existing.emailVerified !== false) {
    const err = new Error("An account with this email already exists");
    err.statusCode = 400;
    throw err;
  }

  if (existing) {
    existing.name = name;
    existing.password = hashed;
    await existing.save();
  } else {
    await User.create({ name, email, password: hashed, emailVerified: false });
  }

  const code = generateOtpCode();
  await saveOtp(email, "signup", code);
  await sendSignupOtpEmail(email, code);

  res.status(201).json({
    message: "Verification code sent to your email.",
    requiresVerification: true,
    email,
  });
});

export const verifySignup = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").replace(/\s/g, "");

  if (!email || !code) {
    const err = new Error("Please provide email and verification code");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid request");
    err.statusCode = 400;
    throw err;
  }
  if (user.emailVerified !== false) {
    const err = new Error("Email already verified");
    err.statusCode = 400;
    throw err;
  }

  const result = await verifyOtp(email, "signup", code);
  if (!result.ok) {
    const msg =
      result.reason === "expired"
        ? "Code expired. Request a new one."
        : result.reason === "locked"
          ? "Too many attempts. Request a new code."
          : "Invalid verification code";
    const err = new Error(msg);
    err.statusCode = 400;
    throw err;
  }

  user.emailVerified = true;
  await user.save();

  res.json(authResponse(user, signToken(user._id)));
});

export const resendSignupOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    const err = new Error("Please provide a valid email");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user || user.emailVerified !== false) {
    res.json({ message: "If an account exists and needs verification, a code was sent." });
    return;
  }

  const code = generateOtpCode();
  await saveOtp(email, "signup", code);
  await sendSignupOtpEmail(email, code);

  res.json({ message: "Verification code sent." });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    const err = new Error("Please provide email and password");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  if (user.emailVerified === false) {
    const err = new Error("Please verify your email before signing in. Check your inbox or resend the code from registration.");
    err.statusCode = 403;
    throw err;
  }

  res.json(authResponse(user, signToken(user._id)));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    const err = new Error("Please provide a valid email");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (user) {
    const code = generateOtpCode();
    await saveOtp(email, "password_reset", code);
    await sendPasswordResetOtpEmail(email, code);
  }

  res.json({
    message: "If an account exists for that email, password reset instructions have been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").replace(/\s/g, "");
  const newPassword = String(req.body.newPassword || "");

  if (!email || !code || !newPassword) {
    const err = new Error("Please provide email, code, and new password");
    err.statusCode = 400;
    throw err;
  }
  if (newPassword.length < MIN_PASSWORD) {
    const err = new Error(`Password must be at least ${MIN_PASSWORD} characters`);
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid or expired reset request");
    err.statusCode = 400;
    throw err;
  }

  const result = await verifyOtp(email, "password_reset", code);
  if (!result.ok) {
    const msg =
      result.reason === "expired"
        ? "Code expired. Request a new reset link."
        : result.reason === "locked"
          ? "Too many attempts. Request a new code."
          : "Invalid reset code";
    const err = new Error(msg);
    err.statusCode = 400;
    throw err;
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.emailVerified = true;
  await user.save();

  res.json(authResponse(user, signToken(user._id)));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    emailVerified: req.user.emailVerified !== false,
    address: req.user.address,
  });
});
