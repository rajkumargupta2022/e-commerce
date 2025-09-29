"use client";
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Signup from "./sign-up";
import Login from "./Login";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isSeller, router, cartItems } = useAppContext();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFebricOpen, setIsFebricOpen] = useState(false);

  const categoryButtonRef = useRef(null);
  const febricButtonRef = useRef(null);
  const [token, setToken] = useState("");
  const [loginModel, setLoginModel] = useState(false);
 

  const categories = [
    { name: "short-kurtas", href: "/category/short-kurtas" },
    { name: "long-kurtas", href: "/category/long-kurtas" },
    { name: "bottom-wear", href: "/category/bottom-wear" },
    { name: "dresses", href: "/category/dresses" },
  ];

  const febric = [
    { name: "chanderic", href: "/by-febric/chanderic" },
    { name: "cotton", href: "/by-febric/cotton" },
    { name: "modal", href: "/by-febric/modal" },
    { name: "organza", href: "/by-febric/organza" },
  ];

  const handleCategoryClick = (href) => {
    setIsCategoryOpen(false);
    router.push(href);
  };

  const handleFebricClick = (href) => {
    setIsFebricOpen(false);
    router.push(href);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const handleClickOutside = (event) => {
      if (
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        febricButtonRef.current &&
        !febricButtonRef.current.contains(event.target)
      ) {
        setIsFebricOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const logout = ()=>{
    localStorage.removeItem("token")
    toast.success("Logout successfully")
  }

  return (
    <nav className="sticky top-0 bg-white z-50 flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        {/* <Link href="/all-products" className="hover:text-gray-900 transition">
          New Arrivals
        </Link> */}

        {/* Shop by Category */}
        <div className="relative" ref={categoryButtonRef}>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="hover:text-gray-900 transition flex items-center gap-1"
          >
            Shop by Category
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              <ul>
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => handleCategoryClick(category.href)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Short by Febric */}
        <div className="relative" ref={febricButtonRef}>
          <button
            onClick={() => setIsFebricOpen(!isFebricOpen)}
            className="hover:text-gray-900 transition flex items-center gap-1"
          >
            Short by Febric
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isFebricOpen && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              <ul>
                {febric.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleFebricClick(item.href)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-6 cursor-pointer">
        <div
          className="relative flex flex-col items-center"
          onClick={() => router.push("/cart")}
        >
          {/* Cart Icon */}
          <Image className="w-5 h-5 " src={assets.cart} alt="cart icon" />

          {/* Badge Above */}
          {cartItems?.cart?.length > 0 && (
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 
                       bg-red-500 text-white text-xs  
                       rounded-full px-2 py-0.5 shadow"
            >
              {cartItems.cart.length}
            </span>
          )}
        </div>

        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </ul>
    {!token ? (
          <button className="text-xs border px-4 py-1.5 rounded-full" onClick={()=>setLoginModel(true)}>
            Login
          </button>
        ) : (
          <button className="text-xs border px-4 py-1.5 rounded-full" onClick={logout}>
            Logout
          </button>
        )}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
    
      </div>
      <Login show={loginModel} setShow={setLoginModel}/>
  
    </nav>
  );
};

export default Navbar;
