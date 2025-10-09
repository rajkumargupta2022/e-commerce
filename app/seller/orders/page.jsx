"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { getRequest, postRequest } from "@/app/utils/api-methods";
import { endPoints } from "@/app/utils/url";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSellerOrders = async () => {
    try {
      const res = await getRequest(endPoints.allOrder);
      // setLoading(true)
      setOrders(res.orders);
    } catch (err) {
      // setLoading(false)
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);
  const orderComplete = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        postRequest(endPoints.orderComplete, { orderId }).then((res) => {
          if (res.success) {
            Swal.fire({
              title: "Compeleted!",
              text: "Your order has been paid and completed.",
              icon: "success",
            });
            fetchSellerOrders()
          }
        }).catch(err=>{
            toast.error("Something went wrong")
        })
      }
    });
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                <div className=" flex gap-3 max-w-50">
                  <Image
                    className="max-w-16 max-h-16 object-cover rounded"
                    src={"/uploads/" + order?.items[0]?.images[0]}
                    alt="box_icon"
                    width={45}
                    height={30}
                  />
                  <p className="flex flex-col gap-1">
                    <span className="font-medium">
                      {order.items
                        .map((item) => item.name + ` x ${item.quantity}`)
                        .join(", ")}
                    </span>
                    <span>Items : {order.items.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">{order.addressId.name}</span>
                    <br />
                    <span>{order.addressId.address}</span>
                    <br />
                    <span>{`${order.addressId.city}, ${order.addressId.state}`}</span>
                    <br />
                    <span>{order.addressId.phoneNumber}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  {currency}
                  {order.totalAmount}
                </p>
                <div>
                  <p className="flex flex-col">
                    <span>Method : {order.paymentMethod}</span>
                    <span>
                      Date : {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>Payment : {order.status}</span>
                  </p>
                </div>
                {order.status!=="Completed" ?  <div
                  className="flex flex-col text-danger cursor-pointer"
                  onClick={() => orderComplete(order._id)}
                >
                  Complete it
                </div>: <div
                  className="flex flex-col text-success"
                >
                  Completed
                </div>}
               
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
