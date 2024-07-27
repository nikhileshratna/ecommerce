import React, { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../services/operations/profileAPI';

const EditProfileDetails = ({ onClose, additionalDetails }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth); 
    const { user } = useSelector(state => state.profile);

    const [data, setData] = useState({
        ...additionalDetails,
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    useEffect(() => {
        if (!user) {
            dispatch(getUserDetails(token, navigate));
        }
        setData({
            ...additionalDetails,
        });
        localStorage.setItem('userProfilePic', user?.profilePic);
    }, [dispatch, user, navigate, additionalDetails, token]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(SummaryApi.editAdditionalDetails.url, {
            method: SummaryApi.editAdditionalDetails.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`, // Use token from Redux
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (responseData.success) {
            toast.success(responseData?.message);
            onClose();
        } else if (responseData.error) {
            toast.error(responseData?.message);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Profile Details</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>
                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='gender' className='mt-3'>Gender:</label>
                    <input
                        type='text'
                        id='gender'
                        placeholder='Enter gender'
                        value={data.gender}
                        name='gender'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='dateOfBirth' className='mt-3'>Date of Birth:</label>
                    <input
                        type='date'
                        id='dateOfBirth'
                        placeholder='Enter date of birth'
                        value={data.dateOfBirth}
                        name='dateOfBirth'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='address' className='mt-3'>Address:</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='Enter address'
                        rows={3}
                        onChange={handleOnChange}
                        name='address'
                        value={data.address}
                    />
                    <label htmlFor='contactNumber' className='mt-3'>Contact Number:</label>
                    <input
                        type='text'
                        id='contactNumber'
                        placeholder='Enter contact number'
                        value={data.contactNumber}
                        name='contactNumber'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Update Profile</button>
                </form>
            </div>
            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}
        </div>
    );
};

export default EditProfileDetails;
