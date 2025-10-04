import dbConnect from "@/lib/mongodb";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/app/utils/url";

export async function POST(req) {
  try {
    await dbConnect();

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
    
     const userId = decoded.userId; 

    // ✅ Body params
    const { items } = await req.json(); 
    // items = [{ productId: "xxx", quantity: 2 }, { productId: "yyy", quantity: 1 }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    // ✅ Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], cartTotal: 0 });
    }

    for (const { productId, quantity } of items) {
      const product = await Product.findById(productId);
      if (!product) continue; // skip invalid product

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // update quantity
        cart.items[itemIndex].quantity += quantity;

        // remove if <= 0
        if (cart.items[itemIndex].quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        // only add if quantity > 0
        if (quantity > 0) {
          cart.items.push({ productId, quantity });
        }
      }
    }

    // ✅ Recalculate total
    cart.cartTotal = 0;
    for (let item of cart.items) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        cart.cartTotal += prod.price * item.quantity;
      }
    }

    await cart.save();

    return NextResponse.json({ msg: "Cart updated",success:true, data:cart }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
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

    // ✅ Find cart and populate product details
    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price size images"
    );

    if (!cart) {
      return NextResponse.json(
        { success: true, message: "Cart is empty", data: { items: [], cartTotal: 0 } },
        { status: 200 }
      );
    }

    // ✅ Flatten items
    const formattedItems = cart.items.map((item) => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      size: item.productId.size,
      images: item.productId.images,
      quantity: item.quantity,
    }));

    const responseData = {
      _id: cart._id,
      userId: cart.userId,
      cartTotal: cart.cartTotal,
      items: formattedItems,
    };

    return NextResponse.json(
      { success: true, message: "Cart fetched successfully", data: responseData },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}