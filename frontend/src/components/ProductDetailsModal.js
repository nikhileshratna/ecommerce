import React, { useEffect, useState } from "react";
import AdminProductCard from "./AdminProductCard";
import SummaryApi from "../common";

const ProductDetailsModal = ({ productIds, quantities, onClose }) => {
  const [activeImage, setActiveImage] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductDetails = async (id) => {
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });
    const dataResponse = await response.json();
    return dataResponse?.data;
  };

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      const productDetails = await Promise.all(
        productIds?.map((id) => fetchProductDetails(id))
      );
      setData(productDetails);
      setLoading(false);
    };

    loadProductDetails();
  }, [productIds]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-10">
      <div className="relative bg-white p-4 rounded shadow-md w-[50%] max-w-[600px] max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div>Loading......</div>
        ) : (
          <>
            <h2 className="font-bold mb-2 text-center">Product Details</h2>
            <ul>
              {data.map((product, index) => (
                <div key={index} className="mb-4">
                  <div className="mb-2">
                    <AdminProductCard data={product} />
                  </div>
                  <li className="text-sm">
                    Product Name: {product?.productName} | Quantity Ordered: {quantities[index]}
                  </li>
                </div>
              ))}
            </ul>
            <div className="flex justify-center">
              <button
                className="mt-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
