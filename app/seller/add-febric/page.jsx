"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRequest, postRequest } from "@/app/utils/api-methods";
import { endPoints, mainUrl } from "@/app/utils/url";
import Swal from "sweetalert2";
import axios from "axios";

const AddFebric = () => {
  const [febricName, setFebricName] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    fecthFebricList();
  }, []);

  const fecthFebricList = async () => {
    try {
      const res = await getRequest(endPoints.febric);
      if (res.success) {
        setCategoryList(res.data);
      }
    } catch (err) {
      setCategoryList([]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!febricName) {
        toast.error("Please add febric");
        return;
      }

      const reqBody = {
        febricName,
      };

      const res = await postRequest(endPoints.febric, reqBody);

      if (res?.success) {
        toast.success("Febric added successfully!");
        setFebricName("");
        fecthFebricList()
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting Category");
    }
  };

  const deleteFebric = (id)=>{
    try{
        Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(mainUrl+endPoints.febric+"?id="+id).then((res) => {
          if (res.data.success) {
            fecthFebricList()
            Swal.fire({
              title: "Deleted!",
              text: "Your febric has been deleted succesfully",
              icon: "success",
            });
          }
        }).catch(err=>{
            toast.error("Something went wrong")
        })
      }
    });
    }catch(err){

    }
  }
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Febric Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setFebricName(e.target.value)}
            value={febricName}
            required
          />
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          ADD
        </button>
          <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Febric Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryList?.map((item,index)=>{
              return <tr key={index}>
              <th scope="row">{index+1}</th>
              <td>{item.febricName}</td>
              <td className="text-danger cursor-pointer" onClick={()=>deleteFebric(item._id)}>Delete</td>
            </tr>
            })}
            
          </tbody>
        </table>
      </div>
      </form>
      
    
    </div>
  );
};

export default AddFebric;
