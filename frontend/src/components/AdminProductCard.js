import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch(SummaryApi.deleteProduct.url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: data._id })
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Product deleted successfully");
                    fetchdata();
                } else {
                    return res.json().then((data) => {
                        throw new Error(data.message || "Failed to delete product");
                    });
                }
            })
            .catch((error) => {
                toast.error("Failed to delete product");
                console.error('Error deleting product:', error);
            });
        }
    };

    return (
        <div className='bg-white p-4 rounded'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full' alt={data.productName} />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

                <div>
                    <p className='font-semibold'>
                        {displayINRCurrency(data.sellingPrice)}
                    </p>

                    <div className='flex justify-end'>
                        <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer mr-2' onClick={() => setEditProduct(true)}>
                            <MdModeEditOutline />
                        </div>
                        <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={handleDelete}>
                            <MdDelete />
                        </div>
                    </div>
                </div>
            </div>

            {editProduct && (
                <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
            )}
        </div>
    );
}

export default AdminProductCard;
