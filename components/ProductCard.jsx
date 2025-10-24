"use client"
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Login from "./Login";

const ProductCard = ({ product }) => {
  const { router, addToCart } = useAppContext();
  const [selectedSize, setSelectedSize] = useState("");
   const [loginModel, setLoginModel] = useState(false);
   const inCart = (data, size) => {
    const token = localStorage.getItem("token");
    if (token) {
      addToCart(data, size);
    } else {
      setLoginModel(true);
    }
  };


  return (
    <div className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer">
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
        <Image
          src={`/uploads/${product?.images[0]}`}
          onClick={() => {
            router.push("/product/" + product._id);
            scrollTo(0, 0);
          }}
          alt={product.name}
          className="transition-transform duration-500 transform group-hover:scale-[1.7] object-cover w-4/5 h-4/5 md:w-full md:h-full rounded"
          width={800}
          height={800}
        />
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {product&& product?.size?.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => setSelectedSize(item)}
              className={`px-2 py-1 rounded-full border transition 
            ${
              selectedSize === item
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-400"
            }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      {!product?.quantity && (
        <p className="w-full text-xs text-red-500/70 max-sm:hidden truncate">
          Out of stock
        </p>
      )}
      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">₹{product?.price}</p>
        <button
            onClick={() => inCart(product, selectedSize)}
          className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
        >
          Add to cart
        </button>
      </div>
          <Login show={loginModel} setShow={setLoginModel} />

    </div>
  );
};

export default ProductCard;
