import dbConnect from "@/lib/mongodb";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

    // Verify JWT token
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

    // Parse request body
    const { items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], cartTotal: 0 });
    }

    // Iterate over each item
    for (const { _id, cartQuantity } of items) {
      if (!cartQuantity || cartQuantity <= 0) continue; // Skip invalid cartQuantity

      // Find product
      const product = await Product.findById(_id);
      if (!product) continue; // Skip if product doesn't exist

      // Find item in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === _id);

      if (itemIndex > -1) {
        // Product already in cart, update cartQuantity
        cart.items[itemIndex].cartQuantity += cartQuantity;

        // Remove item if cartQuantity becomes 0 or less
        if (cart.items[itemIndex].cartQuantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        // Product not in cart, add new item
        cart.items.push({ productId: _id, cartQuantity });
      }
    }

    // Recalculate cart total
    cart.cartTotal = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        cart.cartTotal += product.price * item.cartQuantity;
      }
    }

    // Save the cart
    await cart.save();

    return NextResponse.json({ msg: "Cart updated", success: true, data: cart }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req) {
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

    // Verify JWT token
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

    // Find cart by userId
    let cart = await Cart.findOne({ userId }).populate("items.productId cartTotal");

    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    // Format the response data
    const cartData = cart.items.map(item => {
      const product = item.productId;
      return {
        productId: product._id,
        name: product.name, // Assuming the Product model has a `name` field
        price: product.price, // Assuming the Product model has a `price` field
        cartQuantity: item.cartQuantity,
        size: product.size || "N/A", 
        images:product.images
      };
    });

    // Add cart total to the response
    const cartTotal = cartData.reduce((total, item) => total + item.price * item.quantity, 0);

    return NextResponse.json({ success: true, data: { cart: cartData, cartTotal:cart.cartTotal } }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}