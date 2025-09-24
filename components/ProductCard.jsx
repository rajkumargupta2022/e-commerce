import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { router,addToCart } = useAppContext();

  return (
    <div
    
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
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

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">₹{product.price}</p>
        <button onClick={()=>addToCart(product)} className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
