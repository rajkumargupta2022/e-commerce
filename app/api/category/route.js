import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Category from "@/app/models/Category";

// -------------------- ADD CATEGORY --------------------
export async function POST(req) {
  try {
    await connect();

    const data = await req.json();
    const { categoryName } = data;

    if (!categoryName || categoryName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await Category.findOne({ categoryName });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 409 }
      );
    }

    const category = new Category({ categoryName });
    await category.save();

    return NextResponse.json(
      { success: true, message: "Category added successfully", data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// -------------------- GET ALL CATEGORIES --------------------
export async function GET() {
  try {
    await connect();
    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
