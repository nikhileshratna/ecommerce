import { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";

const AddToCart = async (e, id, quantity, token, dispatch) => {
  e?.stopPropagation();
  e?.preventDefault();
  if (token === null) {
    toast.error("Please Login");
    return;
  }
  console.log("id", id);
  console.log("quantity", quantity);
  const response = await fetch(SummaryApi.addToCartProduct.url, {
    method: SummaryApi.addToCartProduct.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    includeCredentials: true,
    body: JSON.stringify({
      productId: id,
      quantity: quantity,
    }),
  });
  console.log("token", token);
  console.log("response", response);
  const responseData = await response.json();
  console.log("response data", responseData);

  if (responseData.success) {
    // toast.success("Added to cart");
    dispatch(addToCart());
    toast.success(responseData.message);
  } else {
    toast.error(responseData.message);
  }

  return responseData;
};

export default AddToCart;
