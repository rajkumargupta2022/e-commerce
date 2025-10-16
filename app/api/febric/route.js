import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Febric from "@/app/models/FebricCategory";

// -------------------- ADD FEBRIC --------------------
export async function POST(req) {
  try {
    await connect();

    const data = await req.json();
    const { febricName } = data;

    if (!febricName || febricName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Febric name is required" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await Febric.findOne({ febricName });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Febric already exists" },
        { status: 409 }
      );
    }

    const febric = new Febric({ febricName });
    await febric.save();

    return NextResponse.json(
      { success: true, message: "Febric added successfully", data: febric },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding febric:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// -------------------- GET ALL FEBRICS --------------------
export async function GET() {
  try {
    await connect();
    const febrics = await Febric.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: febrics }, { status: 200 });
  } catch (error) {
    console.error("Error fetching febrics:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}

// -------------------- DELETE FEBRIC --------------------
export async function DELETE(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Febric ID is required" },
        { status: 400 }
      );
    }

    await Febric.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Febric deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting febric:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
