// models/Order.js

import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number },
  category: { type: String},
  febricCategory: { type: String},
  images:{ type: [String]},
  color:{type:String},
  size: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    status: { type: String, default: "Pending" },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
