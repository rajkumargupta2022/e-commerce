// app/api/products/route.js

import { NextResponse } from "next/server";
import Product from "@/app/models/Products";
import connect from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import { log } from "console";

// Helper to save uploaded file
async function saveFile(file) {
  if (!file) return null;
  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = Date.now() + "-" + file.name;
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadDir, fileName), bytes);
  return fileName;
}

// -------------------- ADD / UPDATE PRODUCT --------------------
export async function POST(req) {
  try {
    await connect();
    
    // 👇 Otherwise → normal add product
    const formData = await req.formData();

    const imageFiles = formData.getAll("images");
console.log("====== Received Files ======", imageFiles);

// 👇 await Promise.all directly instead of wrapping in async/await in map
const savedImages = await Promise.all(
  imageFiles.map(file => saveFile(file))
);

   
    const product = new Product({
      name: formData.get("name"),
      category: formData.get("category"),
      febricCategory: formData.get("febricCategory"),
      price: formData.get("price"),
      size: formData.get("size"),
      description: formData.get("description"),
      quantity: formData.get("quantity"),
      color: formData.get("color"),
     images: savedImages,
    });

    await product.save();
    return NextResponse.json({ msg: "Added successfully" ,success:true}, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// -------------------- GET PRODUCTS --------------------
export async function GET() {
  try {
    await connect();
    console.log("i am here")
    const products = await Product.find();
    return NextResponse.json({success:true,
      data: products }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}



// helper function to remove file
function removeFile(fileName) {
  if (!fileName) return;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function DELETE(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // get id from query ?id=123

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // remove images from folder
    removeFile(product.image1);
    removeFile(product.image2);

    // delete product from DB
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

