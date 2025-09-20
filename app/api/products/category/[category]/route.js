import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Product from "@/app/models/Products";

export async function GET(req, { params }) {
  try {
    await connect();

    const { category } = params; // get category from dynamic route

    const products = await Product.find({ category });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products found in this category" },
        { status: 404 }
      );
    }

    return NextResponse.json({success:true,data:products}, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
