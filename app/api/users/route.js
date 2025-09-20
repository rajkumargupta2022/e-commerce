// app/api/users/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "@/lib/mongodb";
import User from "@/app/models/User"; 
import { JWT_SECRET } from "@/app/utils/url";



// ---------------- REGISTER USER -----------------
export async function POST(req) {
  try {
    await connect();

    const { name, phoneNumber, email, password } = await req.json();

    if (!name || !phoneNumber || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, email }, JWT_SECRET);

    return NextResponse.json(
      { success: true, msg: "User registered successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "User registration failed" },
      { status: 500 }
    );
  }
}
