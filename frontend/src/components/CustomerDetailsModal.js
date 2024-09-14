import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const CustomerDetailsModal = ({ customerId, onClose }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(SummaryApi.userDetailById.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: customerId,
        }),
      });
      const dataResponse = await response.json();
      console.log(dataResponse?.data);
      setData(dataResponse?.data);
    } catch (error) {
      console.error("Failed to fetch customer details", error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-md">
          <p>Loading...</p> {/* Loading state */}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center  ">
      <div className="bg-white p-4 rounded shadow-md max-h-[80vh] overflow-y-auto w-[50%] mt-10 mx-auto" >
        <h2 className="font-bold mb-2">Customer Details</h2>
        <p><strong>Customer ID:</strong> {customerId}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Role:</strong> {data.role}</p>
        <p><strong>Account Type:</strong> {data.accountType}</p>
        <p><strong>Gender:</strong> {data.additionalDetails?.gender}</p>
        <p><strong>Date of Birth:</strong> {data.additionalDetails?.dateOfBirth}</p>
        <p><strong>Contact Number:</strong> {data.additionalDetails?.contactNumber}</p>
        <p><strong>Address 1:</strong> {data.additionalDetails?.address1}</p>
        <p><strong>Address 2:</strong> {data.additionalDetails?.address2}</p>
        <p><strong>City:</strong> {data.additionalDetails?.city}</p>
        <p><strong>Pincode:</strong> {data.additionalDetails?.pincode}</p>
        <p><strong>State:</strong> {data.additionalDetails?.state}</p>
        <p><strong>Country:</strong> {data.additionalDetails?.country}</p>
        {/* <h3 className="font-bold mt-4">Orders:</h3>
        {data.additionalDetails?.myOrders?.map((order, index) => (
          <div key={order._id} className="border-b py-2">
            <p><strong>Order {index + 1}:</strong></p>
            <p>Product ID: {order.productId}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Shipment ID: {order.shipment_id}</p>
          </div>
        ))} */}
        <button
          className="mt-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
