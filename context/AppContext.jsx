"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
  };
    const fetchCartData= async () => {
         let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
      cart: [],
      cartTotal: 0,
    };
    setCartItems(cartStore);
  };

  const addToCart = async (item) => {
    // Get previous cart store
    let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
      cart: [],
      cartTotal: 0,
    };

    let cartData = cartStore.cart;
    let flag = false;

    if (cartData.length === 0) {
      item.cartQuantity = 1;
      cartData.push(item);
    } else {
      for (let i = 0; i < cartData.length; i++) {
        if (cartData[i]._id === item._id) {
          cartData[i].cartQuantity++;
          flag = true;
          break;
        }
      }

      if (!flag) {
        item.cartQuantity = 1;
        cartData.push(item);
      }
    }

    const cartTotal = cartData.reduce(
      (sum, cartItem) => sum + cartItem.price * cartItem.cartQuantity,
      0
    );
    cartStore = { cartTotal, cart: cartData };
    localStorage.setItem("cartStore", JSON.stringify(cartStore));
   
    setCartItems(cartStore);
  };






  useEffect(() => {
    fetchCartData()
  }, []);

  

  const value = {
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,

    fetchCartData
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
