import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json(cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) cart.items[idx].quantity += quantity;
  else cart.items.push({ product: productId, quantity });

  await cart.save();
  const populated = await cart.populate("items.product");
  res.json(populated);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Item not in cart" });
  item.quantity = quantity;
  if (item.quantity < 1) item.deleteOne();
  await cart.save();
  const populated = await cart.populate("items.product");
  res.json(populated);
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: "Cart cleared" });
});
