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
import { getRequest, postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import Login from "@/components/Login";

const Product = () => {
  const { id } = useParams();
  const { addToCart, router } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productList, setProductList] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loginModel, setLoginModel] = useState(false);

  const fetchProductData = async () => {
    try {
      const res = await postRequest(endPoints.editProduct, { id });
      if (res?.success && res.data) {
        console.log(res.data.size);
        fetchDataBycategory(res.data?.category);
        setProductData(res.data);
      }
    } catch (err) {
      setProductData([]);
    }
  };
  const fetchDataBycategory = async (categoryName) => {
    try {
      const res = await getRequest(
        endPoints.productsByCategory + "?category=" + categoryName
      );
      if (res.success) {
        setProductList(res.data);
      }
    } catch (err) {
      setProductList([]);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, []);

  const byNow = (data, size) => {
    const token = localStorage.getItem("token");
    if (token) {
      addToCart(data, size);
      router.push("/cart");
    } else {
      setLoginModel(true);
    }
  };
  const inCart = (data, size) => {
    const token = localStorage.getItem("token");
    if (token) {
      addToCart(data, size);
    } else {
      setLoginModel(true);
    }
  };
  return productData ? (
    <>
      <Navbar />
      <Login show={loginModel} setShow={setLoginModel} />

      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="relative rounded-lg overflow-hidden bg-gray-500/10 mb-4 w-[250px] h-[290px]">
              <Image
                src={`/uploads/${mainImage || productData?.images[0]}`}
                alt="alt"
                fill
                className="object-cover mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={`/uploads/${image}`}
                    alt="alt"
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>

            <p className="text-gray-600">{productData.description}</p>
            <p className="text-3xl font-medium">₹{productData?.price}</p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Color</td>
                    <td className="text-gray-800/50 ">{productData.color}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Size</td>
                    <td className="text-gray-800/50">
                      <div className="flex flex-wrap gap-2">
                        {productData?.size.map((item, index) => {
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
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => inCart(productData, selectedSize)}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => byNow(productData, selectedSize)}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-orange-600">Products</span>
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
  ) : (
    <Loading />
  );
};

export default Product;
