// app/api/products/byfebricCategory/route.js
import { NextResponse } from "next/server";
import Product from "@/app/models/Products"; // your Product model
import connect from "@/lib/mongodb"

export async function GET(req) {
  try {
    await connect();

    // get category from query string
    const { searchParams } = new URL(req.url);
    const febricCategory = searchParams.get("febric");

    if (!febricCategory) {
      return NextResponse.json(
        { error: "Febric is required" },
        { status: 400 }
      );
    }

    // find products by febricCategory
    const products = await Product.find({ febricCategory });

    return NextResponse.json({ data:products, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
