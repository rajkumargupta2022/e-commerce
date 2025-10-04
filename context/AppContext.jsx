"use client";
import { postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const fetchCartData = async () => {
    let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
      cart: [],
      cartTotal: 0,
    };
    setCartItems(cartStore);
  };

  const addToCart = async (item) => {
    // Get previous cart store
   
    let token = localStorage.getItem("token")
    if(token){
        forServer(item)
    }else{
       forLocal(item)
    }
  
  };
  const forLocal=()=>{
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
    toast.success(item.name + " added successfully in cart");
    setCartItems(cartStore);
  }


const forServer = async (cartData) => {
  try {
 
console.log("carData",cartData)
    // API call with wrapper
    return
    const res = await postRequest(endPoints.cart, { items:cartData }, token);

    if (res.success) {
      console.log("✅ Cart synced with server");
      toast.success("Cart updated");
    } else {
      toast.error(res.data?.error || "Something went wrong");
    }
  } catch (err) {
    toast.error("Error syncing cart");
  }
};


  const deleteCart = (_id) => {
    let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
      cart: [],
      cartTotal: 0,
    };
    if (cartStore?.cart?.length > 0) {
      let filtered = cartStore.cart.filter((item) => {
        return item._id !== _id;
      });
      cartStore.cart = filtered;
      localStorage.setItem("cartStore", JSON.stringify(cartStore));
      setCartItems(cartStore);
      toast.success("Product delete successfully from cart");
    }
  };
  const decreaseCartQuantity = (_id) => {
  let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
    cart: [],
    cartTotal: 0,
  };

  if (cartStore?.cart?.length > 0) {
    let updatedCart = cartStore.cart.map((item) => {
      if (item._id === _id) {
        return { ...item, cartQuantity: item.cartQuantity - 1 };
      }
      return item;
    }).filter(item => item.cartQuantity > 0); // remove if qty = 0

    cartStore.cart = updatedCart;

    // update localStorage
    localStorage.setItem("cartStore", JSON.stringify(cartStore));

    // update state
    setCartItems(cartStore);

    toast.success("Product quantity updated");
  }
};


  useEffect(() => {
    fetchCartData();
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
    deleteCart,
    fetchCartData,
    decreaseCartQuantity
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
