import dbConnect from "@/lib/mongodb";
import Order from "@/app/models/order";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

  
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find the order and verify ownership
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Update order status
    order.status = "Completed";
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order marked as completed", data: order },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order Status Update Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
