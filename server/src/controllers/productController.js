import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { category, categorySlug, search, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) {
    filter.category = category;
  } else if (categorySlug) {
    const cat = await Category.findOne({ slug: String(categorySlug).toLowerCase() });
    if (cat) filter.category = cat._id;
  }
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / limitNum) || 1,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, price, category } = req.body;
  if (!name?.trim() || !slug?.trim() || price === undefined || price === null || !category) {
    const err = new Error("name, slug, price, and category are required");
    err.statusCode = 400;
    throw err;
  }

  const product = await Product.create(req.body);
  await product.populate("category", "name slug");
  res.status(201).json(product);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  res.json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ message: "Product removed" });
});
