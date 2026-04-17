import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly sales", error: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.status(200).json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent orders", error: error.message });
  }
};

export const getAdvancedReports = async (req, res) => {
  try {
    // 1. Top Customers (Join Orders + Users)
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalSpent: 1,
          orderCount: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    // 2. Top Products (Unwind items + Group)
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // 3. Category Distribution (Unwind items + Join Products + Join Categories)
    const categoryStats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({
      topCustomers,
      topProducts,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching advanced reports", error: error.message });
  }
};
