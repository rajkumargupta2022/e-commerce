'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { getRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";

const Orders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSellerOrders = async () => {
           try{
        
                  const res = await getRequest(endPoints.allOrder)
                  // setLoading(true)
                  setOrders(res.orders)
                }catch(err){
                  // setLoading(false)
                  setOrders([])
                }
       
    }

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => item.name + ` x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.addressId.name}</span>
                                    <br />
                                    <span >{order.addressId.address}</span>
                                    <br />
                                    <span>{`${order.addressId.city}, ${order.addressId.state}`}</span>
                                    <br />
                                    <span>{order.addressId.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.totalAmount}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : {order.paymentMethod}</span>
                                    <span>Date : {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>Payment : {order.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;