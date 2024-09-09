import React, { useEffect, useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditBlog from './AdminEditBlog';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminBlogCard = ({ data, fetchdata }) => {
    const [editBlog, setEditBlog] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(SummaryApi.deleteBlog.url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: data._id })
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Blog deleted successfully");
                    fetchdata();
                } else {
                    return res.json().then((data) => {
                        throw new Error(data.message || "Failed to delete blog");
                    });
                }
            })
            .catch((error) => {
                toast.error("Failed to delete blog");
                console.error('Error deleting blog:', error);
            });
        }
    };

    // useEffect(() => {
    //     console.log(data);
    // })

    return (
        <div className='bg-white p-4 rounded'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.blogImage[0]} className='mx-auto object-fill h-full' alt={data.title} />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.title}</h1>

                <div>
                    <button 
                        className='text-blue-500 hover:underline'
                        onClick={() => setShowDescription(prev => !prev)}
                    >
                        {showDescription ? 'Hide Description' : 'Read Description'}
                    </button>

                    {showDescription && (
                        <p className='mt-2 text-gray-700'>{data.description}</p>
                    )}

                    <div className='flex justify-end mt-2'>
                        <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer mr-2' onClick={() => setEditBlog(true)}>
                            <MdModeEditOutline />
                        </div>
                        <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={handleDelete}>
                            <MdDelete />
                        </div>
                    </div>
                </div>
            </div>

            {editBlog && (
                <AdminEditBlog blogData={data} onClose={() => setEditBlog(false)} fetchdata={fetchdata} />
            )}
        </div>
    );
}

export default AdminBlogCard;
