import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadCategory = ({
  onClose,
  fetchData
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleOnChange = (e) => {
    setCategoryName(e.target.value);
  };

  {/** Handle form submission to upload category */}
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.uploadCategory.url, {
      method: SummaryApi.uploadCategory.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ categoryName })
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-md h-auto overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Category</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2' onSubmit={handleSubmit}>
          <label htmlFor='categoryName'>Category Name:</label>
          <input
            type='text'
            id='categoryName'
            placeholder='Enter category name'
            value={categoryName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <button className='px-3 py-2 bg-blue-600 text-white hover:bg-blue-700'>
            Upload Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCategory;
