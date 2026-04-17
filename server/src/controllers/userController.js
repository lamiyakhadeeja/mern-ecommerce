import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, address } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (address) user.address = { ...user.address, ...address };
  await user.save();
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
  });
});
