import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: "Order must have items" });

  let totalAmount = 0;
  const lineItems = [];
  for (const line of items) {
    const product = await Product.findById(line.productId);
    if (!product) return res.status(400).json({ message: `Product ${line.productId} not found` });
    const qty = line.quantity || 1;
    const lineTotal = product.price * qty;
    totalAmount += lineTotal;
    lineItems.push({
      product: product._id,
      name: product.name,
      quantity: qty,
      price: product.price,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: lineItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });
  res.status(201).json(order);
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const listAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const update = {};
  if (orderStatus) update.orderStatus = orderStatus;
  if (paymentStatus) update.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });
  
  res.json(order);
});
