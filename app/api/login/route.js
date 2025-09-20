// app/api/users/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import connect from "@/lib/mongodb";
import { JWT_SECRET } from "@/app/utils/url";



export async function POST(req) {
  try {
    await connect();

    const { identifier, password } = await req.json(); // email or phone

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    // find user by email or phoneNumber
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET
    );

    return NextResponse.json({ success:true,msg: "Login successful", token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
