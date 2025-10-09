"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { getRequest, postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import { useRouter } from "next/navigation";

const EditProduct = () => {
  const { id } = useParams();
   const router = useRouter();
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Short Kurtas");
  const [febricCategory, setFebricCategory] = useState("Cotton");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [color, setColor] = useState("");

 const productById = async () => {
  try {
    console.log("idddd",id)
    const res = await postRequest(endPoints.editProduct,{id});
    if (res?.success && res.data) {
      setName(res.data.name ?? "");
      setDescription(res.data.description ?? "");
      setColor(res.data.color ?? "");
      setCategory(res.data.category ?? "");
      setFebricCategory(res.data.febricCategory ?? "");
      setSize(res.data.size ?? "");
      setPrice(res.data.price ?? 0);
      setQuantity(res.data.quantity)
    } else {
      console.warn("No product found or API returned false");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  }
};


  useEffect(() => {
    if(id){
      productById();
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // if (!image1 || !image2) {
      //   toast.error("Please upload at least two images!");
      //   return;
      // }

      // ✅ Build FormData
      const formData = new FormData();
      const images = [image1, image2, image3, image4];

      images.forEach((img) => {
        if (img) formData.append("images", img); // append File objects
      });

      // other fields
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("febricCategory", febricCategory);
      formData.append("size", size);
      formData.append("price", Number(price));
      formData.append("quantity", Number(quantity));
      formData.append("color", color);
      formData.append("id", id);

      // Debug: check what’s inside FormData
      for (let [key, value] of formData.entries()) {
        console.log("➡️", key, value);
      }

      // ✅ Don’t set Content-Type manually
      const res = await postRequest(endPoints.updateProduct, formData);

      if (res?.success) {
        toast.success("Product added successfully!");
        // reset form
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setName("");
        setDescription("");
        setColor("");
        setCategory("Short Kurtas");
        setFebricCategory("Cotton");
        setSize("M");
        setPrice("");
         router.push("/seller/product-list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting product");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Image 1 */}
        <div>
          <p className="text-base font-medium">Product Image 1</p>
         <div className="flex flex-wrap items-center gap-3 mt-2">
                     <label htmlFor="image1">
                       <input
                         type="file"
                         id="image1"
                         hidden
                         accept="image/*"
                         onChange={(e) => e.target.files && setImage1(e.target.files[0])}
                       />
                       <Image
                         className="max-w-24 cursor-pointer"
                         src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
                         alt="Image 1"
                         width={100}
                         height={100}
                       />
                     </label>
                     <label htmlFor="image2">
                       <input
                         type="file"
                         id="image2"
                         hidden
                         accept="image/*"
                         onChange={(e) => e.target.files && setImage2(e.target.files[0])}
                       />
                       <Image
                         className="max-w-24 cursor-pointer"
                         src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
                         alt="Image 2"
                         width={100}
                         height={100}
                       />
                     </label>
                     <label htmlFor="image3">
                       <input
                         type="file"
                         id="image3"
                         hidden
                         accept="image/*"
                         onChange={(e) => e.target.files && setImage3(e.target.files[0])}
                       />
                       <Image
                         className="max-w-24 cursor-pointer"
                         src={image3 ? URL.createObjectURL(image3) : assets.upload_area}
                         alt="Image 2"
                         width={100}
                         height={100}
                       />
                     </label>
                     <label htmlFor="image4">
                       <input
                         type="file"
                         id="image4"
                         hidden
                         accept="image/*"
                         onChange={(e) => e.target.files && setImage4(e.target.files[0])}
                       />
                       <Image
                         className="max-w-24 cursor-pointer"
                         src={image4 ? URL.createObjectURL(image4) : assets.upload_area}
                         alt="Image 2"
                         width={100}
                         height={100}
                       />
                     </label>
                   </div>
        </div>

        {/* Image 2 */}

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Category & Size & Price */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Short Kurtas">Short Kurtas</option>
              <option value="Long Kurtas">Long Kurtas</option>
              <option value="Bottom Wear<">Bottom Wear</option>
              <option value="Dresses">Dresses</option>
              <option value="Kurta Sets">Kurta Sets</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Febric Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setFebricCategory(e.target.value)}
              value={category}
            >
              <option value="Cotton">Cotton</option>
              <option value="Chanderi">Chanderi</option>
              <option value="Georgette">Georgette</option>
              <option value="Modal<">Modal</option>
              <option value="Orgnaza">Orgnaza</option>
              <option value="Mulmul">Mulmul</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="size">
              Size
            </label>
            <select
              id="size"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setSize(e.target.value)}
              value={size}
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="2XL">2XL</option>
              <option value="3XL">3XL</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Add Quantity
            </label>
            <input
              id="qantity-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="color">
              Color
            </label>
            <input
              id="color"
              type="text"
              placeholder=""
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setColor(e.target.value)}
              value={color}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
