import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  cartQuantity: { type: Number, required: true, default: 1 },
  name: { type: String, required: true },
  category: { type: String, required: true },
  febricCategory: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  images: { type: [String] },
  description: { type: String },
  color: { type: String },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
    cartTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
