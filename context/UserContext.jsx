"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const a ="Dsds"




  useEffect(() => {
    fetchCartData();
  }, []);

  const value = {
    a
  }

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
