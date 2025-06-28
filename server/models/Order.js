const mongoose = require("mongoose");

const shippingInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, default: "" },
    city: { type: String, required: true },
    stateProvince: { type: String, required: true },
    zipPostal: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // product or item id
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  shippingInfo: { type: shippingInfoSchema, required: true },
  paymentMethod: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
