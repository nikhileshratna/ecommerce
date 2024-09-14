import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminOrderCard = ({ data, fetchData }) => {
    const { productIds, quantities, totalPrice, orderStatus, createdAt, _id } = data;
    const [editOrder, setEditOrder] = useState(false);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            fetch(SummaryApi.deleteOrder.url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id })
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Order deleted successfully");
                    fetchData();
                } else {
                    return res.json().then((data) => {
                        throw new Error(data.message || "Failed to delete order");
                    });
                }
            })
            .catch((error) => {
                toast.error("Failed to delete order");
                console.error('Error deleting order:', error);
            });
        }
    };

    return (
        <div className='bg-white p-4 rounded shadow-md'>
            <div className='w-40'>
                <h1 className='font-bold mb-2'>Order #{_id}</h1>
                <p className='text-ellipsis line-clamp-2 mb-2'>Order Date: {new Date(createdAt).toLocaleDateString()}</p>
                <div>
                    <p className='font-semibold'>Total Price: ₹{totalPrice}</p>
                    <p className='mb-2'>Order Status: <span className={`font-bold ${orderStatus === "completed" ? "text-green-600" : "text-red-600"}`}>{orderStatus}</span></p>
                    
                    <div>
                        <strong>Products:</strong>
                        <ul>
                            {productIds.map((productId, index) => (
                                <li key={index} className='text-sm'>
                                    Product ID: {productId} | Quantity: {quantities[index]}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex justify-end mt-4'>
                        <div 
                            className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer mr-2' 
                            onClick={() => setEditOrder(true)}>
                            <MdModeEditOutline />
                        </div>
                        <div 
                            className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' 
                            onClick={handleDelete}>
                            <MdDelete />
                        </div>
                    </div>
                </div>
            </div>

            {editOrder && (
                <div>
                    {/* Add your AdminEditOrder component here for editing */}
                    {/* <AdminEditOrder orderData={data} onClose={() => setEditOrder(false)} fetchData={fetchData} /> */}
                </div>
            )}
        </div>
    );
};

export default AdminOrderCard;
