"use client"
import axios from "axios";
import { mainUrl } from "./url";

// POST request
export const postRequest = async (endPoint, body,token) => {
  try {
    const response = await axios.post(
      mainUrl + endPoint,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // attach token here
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET request
export const getRequest = async (endPoint) => {
  try {
    const response = await axios.get(mainUrl+endPoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT request
export const putRequest = async (endPoint, body) => {
  try {
    const response = await axios.put(mainUrl+endPoint, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const deleteRequest = async (endPoint) => {
  try {
    const response = await axios.delete(mainUrl+endPoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};
