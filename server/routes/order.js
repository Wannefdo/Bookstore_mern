// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// POST /api/order
// Create a new order
router.post("/", auth, async (req, res) => {
  const { shippingInfo, paymentMethod, items, totalAmount, orderDate } =
    req.body;

  try {
    const newOrder = new Order({
      shippingInfo,
      paymentMethod,
      items,
      totalAmount,
      userId: req.user.id,
      orderDate: orderDate || new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

// GET /api/order/my
// Get all orders for the logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      orderDate: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve orders" });
  }
});

module.exports = router;
