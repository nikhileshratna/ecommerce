import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';

const MyOrders = () => {
  const { token } = useSelector(state => state.auth);
  const [orderDetails, setOrderDetails] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdditionalDetails = async () => {
    if (!token) return;

    try {
      const response = await fetch(SummaryApi.showAdditionalDetails.url, {
        method: SummaryApi.showAdditionalDetails.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        setOrderDetails(responseData?.data?.myOrders ?? []);
        console.log('Additional details fetched successfully:', responseData?.data?.myOrders);
      } else {
        console.error('Failed to fetch additional details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching additional details:', error);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const dataResponse = await response.json();
      console.log("product data", dataResponse)
      if (response.ok) {
        setData((prevData) => {
          const existingIds = new Set(prevData.map(item => item?._id));
          if (!existingIds.has(dataResponse.data?._id)) {
            return [...prevData, dataResponse.data];
          }
          return prevData;
        });
      } else {
        console.error('Failed to fetch product details:', dataResponse.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAdditionalDetails();
      setLoading(false);
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchAllProductDetails = async () => {
      setLoading(true);
      const promises = orderDetails.map(item => fetchProductDetails(item.productId));
      await Promise.all(promises);
      setLoading(false);
    };

    if (orderDetails.length > 0) {
      fetchAllProductDetails();
    }
  }, [orderDetails]);

  return (
    <div className="bg-red-50 text-red-900 p-5 rounded-lg flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {
          data.length === 0 && !loading && <div className="text-center">No Orders Found</div> 
        }
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          data?.map((product) => (
            <div
              key={product?._id}
              className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
            >
              <div className="w-32 h-32 bg-slate-200">
                {product?.productImage && (
                  <img
                    src={product?.productImage[0]}
                    alt={product?.productName}
                    className="w-full h-full object-scale-down mix-blend-multiply"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col justify-center">
                <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                  {product?.productName}
                </h2>
                <p className="capitalize text-slate-500">{product?.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
