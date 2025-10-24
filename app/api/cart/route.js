import dbConnect from "@/lib/mongodb";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

    // 🔒 Verify token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
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

    // 🧾 Parse request body (single item)
    const {
      _id,
      name,
      category,
      febricCategory,
      price,
      size,
      images,
      description,
      color,
      cartQuantity,
    } = await req.json();

    // 🛒 Validate required fields
    if (!_id || !cartQuantity || !size) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID, size, and quantity are required",
        },
        { status: 400 }
      );
    }

    // 🧩 Check if product exists and available
    const product = await Product.findById(_id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (cartQuantity > product.quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${product.quantity} units of "${product.name}" (size: ${size}) are available.`,
        },
        { status: 200 }
      );
    }

    // 🛍 Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], cartTotal: 0 });
    }

    // 🧠 Find existing item (same productId + size)
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === _id && item.size === size
    );

    if (existingItem) {
      // Update existing quantity
      const totalAfterAdd = existingItem.cartQuantity + cartQuantity;
      if (totalAfterAdd > product.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.quantity} units of "${product.name}" (size: ${size}) are available.`,
          },
          { status: 200 }
        );
      }
      existingItem.cartQuantity = totalAfterAdd;
    } else {
      // Add new item with all details
      cart.items.push({
        productId: _id,
        name,
        category,
        febricCategory,
        price,
        size,
        images,
        description,
        color,
        cartQuantity,
      });
    }

    // 🧮 Recalculate total
    cart.cartTotal = cart.items.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );

    await cart.save();

    return NextResponse.json(
      { success: true, message: "Cart updated successfully", data: cart },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in Cart POST:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await dbConnect();

    // 🔒 Check authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 🔍 Verify JWT token
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

    // 🛒 Find cart by userId (no need to populate — data is stored directly)
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty", data: { cart: [], cartTotal: 0 } },
        { status: 200 }
      );
    }

    // 🧾 Prepare cart response data
    const cartData = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      category: item.category,
      febricCategory: item.febricCategory,
      price: item.price,
      size: item.size,
      images: item.images,
      description: item.description,
      color: item.color,
      cartQuantity: item.cartQuantity,
    }));

    // 🧮 Calculate total
    const cartTotal = cartData.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );

    // ✅ Return response
    return NextResponse.json(
      { success: true, data: { cart: cartData, cartTotal } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in Cart GET:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
