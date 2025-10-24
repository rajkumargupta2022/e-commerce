import dbConnect from "@/lib/mongodb";
import Order from "@/app/models/order";
import Cart from "@/app/models/Cart";
import Address from "@/app/models/Address";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";


function generateShortOrderID() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const millis = now.getTime().toString(); // last 5 digits
    return `ORDLA${dateStr}-${millis}`;
}


export async function POST(req) {
  try {
    await dbConnect();

    // 🔐 Check authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔑 Decode token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // 🧾 Get request body
    const { addressId, paymentMethod } = await req.json();

    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Address ID and payment method required" },
        { status: 400 }
      );
    }

    // 📦 Validate address ownership
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // 🛒 Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // 🧠 Verify product availability & prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${item.name}" not found.`,
          },
          { status: 404 }
        );
      }

      if (product.quantity < item.cartQuantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.quantity} units available for "${item.name}" (${item.size}).`,
          },
          { status: 400 }
        );
      }

      // Add to order items (using data already stored in Cart)
      orderItems.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        category: item.category,
        febricCategory: item.febricCategory,
        color: item.color,
        size: item.size,
        images: item.images,
        description: item.description,
        quantity: item.cartQuantity,
      });
    }

    // 💰 Calculate total amount
    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 🆔 Generate unique order ID
    const orderId = generateShortOrderID();

    // 📝 Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      addressId,
      paymentMethod,
      orderId,
    });

    // 📉 Decrease stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    // 🧹 Clear cart
    await Cart.findOneAndDelete({ userId });

    // ✅ Response
    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: order,
      },
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
