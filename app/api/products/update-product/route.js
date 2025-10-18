import { NextResponse } from "next/server";
import Product from "@/app/models/Products";
import connect from "@/lib/mongodb";
import fs from "fs";
import path from "path";

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

// Helper to delete old images
function deleteOldImages(images) {
  if (!images || !Array.isArray(images)) return;
  const uploadDir = path.join(process.cwd(), "public/uploads");

  images.forEach((img) => {
    const filePath = path.join(uploadDir, img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
}

// -------------------- UPDATE PRODUCT --------------------
export async function POST(req) {
  try {
    await connect();

    const formData = await req.formData();
    const productId = formData.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Get image files
    const imageFiles = formData.getAll("images").filter((file) => file && file.size > 0);
    let updatedImages = product.images; // keep existing images if none uploaded

    if (imageFiles.length > 0) {
      // Remove old images from /public/uploads
      deleteOldImages(product.images);

      // Save new ones
      const savedImages = await Promise.all(imageFiles.map((file) => saveFile(file)));
      updatedImages = savedImages;
    }
 const size = formData.getAll("size");
   console.log("size======",size)
    product.name = formData.get("name") || product.name;
    product.category = formData.get("category") || product.category;
    product.febricCategory = formData.get("febricCategory") || product.febricCategory;
    product.price = formData.get("price") || product.price;
    product.size = size || product.size;
    product.description = formData.get("description") || product.description;
    product.quantity = formData.get("quantity") || product.quantity;
    product.color = formData.get("color") || product.color;
    product.images = updatedImages;

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}
