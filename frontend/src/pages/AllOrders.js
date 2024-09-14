import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import AdminOrderCard from '../components/AdminOrderCard'; // Assuming you have or will create this component

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await fetch(SummaryApi.getMyOrder.url); // Replace with your actual endpoint
    const dataResponse = await response.json();

    console.log("order data", dataResponse);

    setAllOrders(dataResponse?.data || []);
    
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Orders</h2>
      </div>

      {/** All Orders */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {
          allOrders?.map((order, index) => {
            return (
              <AdminOrderCard data={order} key={index + "allOrders"} fetchData={fetchAllOrders} />
            );
          })
        }
      </div>
    </div>
  );
};

export default AllOrders;
