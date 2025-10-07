import dbConnect from "@/lib/mongodb";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Products";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

    // Check authorization header
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
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    // Find cart for user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Find item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Decrease quantity by 1
    cart.items[itemIndex].cartQuantity -= 1;

    // If quantity reaches 0, remove the item
    if (cart.items[itemIndex].cartQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    // Recalculate cart total
    cart.cartTotal = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        cart.cartTotal += product.price * item.cartQuantity;
      }
    }

    // Save updated cart
    await cart.save();

    return NextResponse.json(
      { success: true, message: "Item quantity updated", data: cart },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
