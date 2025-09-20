"use client"
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {
  const { isSeller, router } = useAppContext();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFebricOpen, setIsFebricOpen] = useState(false);

  const categoryButtonRef = useRef(null);
  const febricButtonRef = useRef(null);

  const categories = [
    { name: "Short Kurtas", href: "/category/short-kurtas" },
    { name: "Long Kurtas", href: "/category/long-kurtas" },
    { name: "Bottom Wear", href: "/category/bottom-wear" },
    { name: "Dresses", href: "/category/dresses" },
  ];

  const febric = [
    { name: "Chanderic", href: "/category/chanderic" },
    { name: "Cotton", href: "/category/cotton" },
    { name: "Modal", href: "/category/modal" },
    { name: "Organza", href: "/category/organza" },
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

  return (
    <nav className="sticky top-0 bg-white z-50 flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          New Arrivals
        </Link>

       {/* Shop by Category */}
<div className="relative" ref={categoryButtonRef}>
  <button
    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
    className="hover:text-gray-900 transition flex items-center gap-1"
  >
    Shop by Category
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
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
    </nav>
  );
};

export default Navbar;
