import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Product from "@/app/models/Products";

export async function POST(req) {
  try {
    await connect(); // ✅ connect to MongoDB

    // ✅ Parse the request body
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Return success response
    return NextResponse.json(
      { success: true, data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
