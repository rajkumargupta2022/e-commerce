// app/api/products/byCategory/route.js
import { NextResponse } from "next/server";
import Product from "@/app/models/Products"; // your Product model
import connect from "@/lib/mongodb"

export async function GET(req) {
  try {
    await connect();

    // get category from query string
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // find products by category
    const products = await Product.find({ category });

    return NextResponse.json({ products, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
