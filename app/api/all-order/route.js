// app/api/order/all/route.js

import dbConnect from "@/lib/mongodb";
import Order from "@/app/models/order";
import Address from "@/app/models/Address";  // Import the Address model to ensure it's registered
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const orders = await Order.find({})
      .populate("addressId")        // populate full address object
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("Get all orders public error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


