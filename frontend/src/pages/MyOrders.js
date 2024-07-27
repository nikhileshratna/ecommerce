import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';

const MyOrders = () => {
  const { token } = useSelector(state => state.auth);
  const [orderDetails, setOrderDetails] = useState([]);
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true)
  const fetchAdditionalDetails = async () => {
    if (!token) return;

    const response = await fetch(SummaryApi.showAdditionalDetails.url, {
      method: SummaryApi.showAdditionalDetails.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (response?.ok) {
      setOrderDetails(responseData?.data?.myOrders ?? []);
      console.log('Additional details fetched successfully:', responseData);
    } else {
      console.error('Failed to fetch additional details:', responseData.message);
    }
  };
  const fetchProductDetails = async (productId) => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    setLoading(false);
    const dataResponse = await response.json();
    console.log(dataResponse);
  
    setData((prevData) => [...prevData, dataResponse?.data]);
  };
  

  useEffect(() => { 
    fetchAdditionalDetails();
  }, []);

  useEffect(() => {
    orderDetails.forEach((item) => {
      fetchProductDetails(item._id);
    })

    console.log(data);
  }, [orderDetails]);

  return (
    <div className="bg-red-50 text-red-900 p-5 rounded-lg">
      <div>
        {
          orderDetails?.length === 0 && <p className="text-red-600 text-center">No orders found</p>
        }
        {
          orderDetails?.map((item, index) => (
            <div key={index} className="bg-red-100 p-3 my-2 rounded-md flex flex-col gap-2">
              <p>{item.quantity}</p>
              <p>{item._id}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MyOrders;
