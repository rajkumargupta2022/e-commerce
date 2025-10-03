import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    cartTotal: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
