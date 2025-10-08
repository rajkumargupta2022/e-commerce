"use client";
import { getRequest, postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { ToastBar } from "react-hot-toast";

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
    const token = localStorage.getItem("token");
    if (!token) {
      let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
        cart: [],
        cartTotal: 0,
      };
      console.log("fddddddddd from local", cartStore);
      setCartItems({ ...cartStore });
    } else {
      try {
        const res = await getRequest(endPoints.cart, token);
        if (res) {
          setCartItems(res.data);
          console.log("fddddddddd from server", res.data);
        }
      } catch (err) {
        setCartItems({});
      }
    }
  };

  const addToCart = async (item) => {
    // Get previous cart store

    let token = localStorage.getItem("token");
    if (token) {
      forServer(item);
    } else {
      forLocal(item);
    }
  };
  const forLocal = (item) => {
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
  };

  const forServer = async (cartData) => {
    console.log("cartdata from api calling",cartData);
    
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        items: [
          {
            _id: cartData._id ? cartData._id : cartData.productId, // Assuming cartData has the _id for productId
            cartQuantity: 1,
          },
        ],
      };

      // Send the request to the API
      const res = await postRequest(endPoints.cart, requestData, token);

      // Check the response
      if (res.success) {
        fetchCartData();
        console.log("✅ Cart synced with server");
        toast.success("Cart updated");
      } else {
        toast.error(res.msg || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const deleteCart = async (_id) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await postRequest(
          endPoints.remove,
          { productId: _id },
          token
        );
        if (res.success) {
          fetchCartData()
          toast.success("Cart remove successfully");
        } else {
          toast.success("Cart remove failed");
        }
      } catch (err) {
        toast.success("Cart remove failed");
      }
    } else {
        let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
    cart: [],
    cartTotal: 0,
  };

  if (cartStore?.cart?.length > 0) {
    // Loop through cart items and decrease quantity if found
    const updatedCart = cartStore.cart
      .map((item) => {
        if (item._id === _id) {
          const updatedQuantity = (item.cartQuantity || 1) - 1;
          // Only keep item if quantity > 0
          return updatedQuantity > 0
            ? { ...item, cartQuantity: updatedQuantity }
            : null;
        }
        return item;
      })
      .filter(Boolean); // remove null items (quantity 0)

    // Recalculate total
    const newTotal = updatedCart.reduce(
      (sum, item) => sum + item.price * (item.cartQuantity || 1),
      0
    );

    // Update cart store
    cartStore = {
      ...cartStore,
      cart: updatedCart,
      cartTotal: newTotal,
    };

    // Save to localStorage
    localStorage.setItem("cartStore", JSON.stringify(cartStore));

    // Update state
    setCartItems(cartStore);

    toast.success("Product quantity updated successfully");
  } else {
    toast.info("Cart is empty");
  }}
  };
  const decreaseCartQuantity = (_id) => {
    let cartStore = JSON.parse(localStorage.getItem("cartStore")) || {
      cart: [],
      cartTotal: 0,
    };

    if (cartStore?.cart?.length > 0) {
      let updatedCart = cartStore.cart
        .map((item) => {
          if (item._id === _id) {
            return { ...item, cartQuantity: item.cartQuantity - 1 };
          }
          return item;
        })
        .filter((item) => item.cartQuantity > 0); // remove if qty = 0

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
    decreaseCartQuantity,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
