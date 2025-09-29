"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { AppContext, useAppContext } from "@/context/AppContext";
import React from "react";
import { getRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";

const Category = () => {
  const { id } = useParams();
  const {addToCart} = useAppContext()
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productList, setProductList] = useState(null);

 
  const fetchDataBycategory = async () => {
    console.log("sss",id)
    try {
      const res = await getRequest(
        endPoints.productsByFebric+"/" +"?febric=" + id
      );
      if (res.success) {
        setProductList(res.data);
      }
    } catch (err) {
      setProductList([]);
    }
  };
  useEffect(() => {
    console.log("dsssssssss");
    
    fetchDataBycategory();
  }, []);

  return  (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
         
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              <span className="font-medium text-orange-600">{id?.charAt(0)?.toUpperCase() + id?.slice(1)} Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {productList?.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
};

export default Category;
