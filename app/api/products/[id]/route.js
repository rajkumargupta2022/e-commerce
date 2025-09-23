import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Product from "@/app/models/Products";

export async function GET(req, { params }) {
  try {
    await connect();

    const { id } = params; // get id from dynamic route

    const product = await Product.findById(id);
   
    if (!product) {
      return NextResponse.json({data:[],success:false}, { status: 404 });
    }

    return NextResponse.json({data:product,success:true}, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
