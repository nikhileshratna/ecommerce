import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import ProductDetailsModal from './ProductDetailsModal';
import CustomerDetailsModal from './CustomerDetailsModal';

const AdminOrderCard = ({ data, fetchData }) => {
    const { productIds, quantities, totalPrice, orderStatus, createdAt, _id } = data;
    const [editOrder, setEditOrder] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);

    const toggleProductDetails = () => {
        setShowProductDetails(!showProductDetails);
    };

    const toggleCustomerDetails = () => {
        setShowCustomerDetails(!showCustomerDetails);
    };

    return (
        <div className='bg-white p-4 rounded shadow-md w-full md:w-[49%] h-full'>
            <div className='w-full'>
                <h1 className='font-bold mb-2'>Order #{_id}</h1>
                <p className='text-ellipsis line-clamp-2 mb-2'>Order Date: {new Date(createdAt).toLocaleDateString()}</p>
                <div>
                    <p className='font-semibold'>Total Price: ₹{totalPrice}</p>
                    <p className='mb-2'>Order Status: 
                        <span className={`font-bold ${orderStatus === "completed" ? "text-green-600" : "text-red-600"}`}>
                            {orderStatus}
                        </span>
                    </p>
                    
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

                    <div className='flex flex-col sm:flex-row justify-end mt-4 w-full gap-2'>
                        <button 
                            className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-3 rounded w-full sm:w-auto'
                            onClick={toggleProductDetails}
                        >
                            See Product Details
                        </button>
                        <button 
                            className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-3 rounded w-full sm:w-auto'
                            onClick={toggleCustomerDetails}
                        >
                            See Customer Details
                        </button>
                    </div>
                </div>
            </div>

            {editOrder && (
                <div>
                    {/* Add your AdminEditOrder component here for editing */}
                    {/* <AdminEditOrder orderData={data} onClose={() => setEditOrder(false)} fetchData={fetchData} /> */}
                </div>
            )}

            {showProductDetails && (
                <ProductDetailsModal
                    productIds={productIds}
                    quantities={quantities}
                    onClose={toggleProductDetails}
                />
            )}

            {showCustomerDetails && (
                <CustomerDetailsModal
                    customerId={data.customerId}
                    onClose={toggleCustomerDetails}
                />
            )}
        </div>
    );
};

export default AdminOrderCard;