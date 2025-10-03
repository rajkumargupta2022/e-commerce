import dbConnect from "@/lib/mongodb";
import Address from "@/app/models/address";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

    // get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET); // your JWT secret
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }
   
    const userId = decoded.userId; // comes from token payload

    // parse body
    const body = await req.json();
    const {name, pincode, city, state, address, phoneNumber, isDefault } = body;

    if (!pincode || !city || !state || !address) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // fetch user details
    const user = await User.findById(userId).select("name email");
 
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // unset old defaults if this one is default
    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = new Address({
      userId,
      pincode,
      city,
      name,
      state,
      address,
      phoneNumber,
      isDefault,
    });

    await newAddress.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully",
        data: {
          ...newAddress.toObject(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving address:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await dbConnect();

    // get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // fetch all addresses of this user
    const addresses = await Address.find({ userId });

    return NextResponse.json(
      {
        success: true,
        message: "Addresses fetched successfully",
        data: addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}