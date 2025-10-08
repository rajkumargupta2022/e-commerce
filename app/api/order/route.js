import dbConnect from "@/lib/mongodb";
import Order from "@/app/models/order";
import Cart from "@/app/models/Cart";
import Address from "@/app/models/Address";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { addressId, paymentMethod } = await req.json();

    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Address ID and payment method required" },
        { status: 400 }
      );
    }

    // ✅ Validate address ownership
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // ✅ Get user's cart with populated products
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // ✅ Build order items and total
    const orderItems = cart.items.map((item) => {
      const product = item.productId;
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        febricCategory: product.febricCategory,
        color: product.color || "N/A",
        quantity: item.cartQuantity,
        size: product.size || "",
      };
    });

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
console.log("orderItems===========",orderItems)
    // ✅ Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      addressId,
      paymentMethod,
    });

    // ✅ Decrease product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }, // Decrease stock count
        { new: true }
      );
    }

    // ✅ Clear cart after order placed
    await Cart.findOneAndDelete({ userId });

    return NextResponse.json(
      { success: true, message: "Order placed successfully", data: order },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Fetch orders for this user, and populate addressId to get full address fields
    const orders = await Order.find({ userId })
      .populate("addressId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data:orders }, { status: 200 });
  } catch (err) {
    console.error("Get my orders error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
