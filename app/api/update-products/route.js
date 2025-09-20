import { NextResponse } from "next/server";
import Product from "@/app/models/Products";
import connect from "@/lib/mongodb";
import fs from "fs";
import path from "path";

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

function removeFile(fileName) {
  if (!fileName) return;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function POST(req) {
  try {
    await connect();
    const formData = await req.formData();
    const id = formData.get("id");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update fields
    product.name = formData.get("name") || product.name;
    product.category = formData.get("category") || product.category;
    product.price = formData.get("price") || product.price;
    product.size = formData.get("size") || product.size;
    product.description = formData.get("description") || product.description;

    // Update images if provided
    const image1 = formData.get("image1");
    const image2 = formData.get("image2");

    if (image1 && typeof image1 !== "string") {
      // Remove old file before saving new one
      removeFile(product.image1);
      product.image1 = await saveFile(image1);
    }

    if (image2 && typeof image2 !== "string") {
      removeFile(product.image2);
      product.image2 = await saveFile(image2);
    }

    await product.save();
    return NextResponse.json({ msg: "Updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
