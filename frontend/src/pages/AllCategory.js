import React, { useEffect, useState } from "react";
import UploadCategory from "../components/UploadCategory";
import SummaryApi from "../common";
import { MdDelete } from "react-icons/md";

const AllCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [openUploadCategory, setOpenUploadCategory] = useState(false);

  const fetchAllCategories = async () => {
    const response = await fetch(SummaryApi.getCategory.url);
    const dataResponse = await response.json();
    setAllCategories(dataResponse?.data || []);
    console.log(dataResponse?.data);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log("id");
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-4 px-6 flex justify-between items-center shadow-md">
        <h2 className="font-bold text-xl text-gray-800">All Categories</h2>
        <button
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-lg"
          onClick={() => setOpenUploadCategory(true)}
        >
          Upload Category
        </button>
      </div>

      {/** All categories */}
      <div className="flex flex-col gap-4 py-6 px-4 h-[calc(100vh-190px)] overflow-y-auto bg-white shadow-sm rounded-lg mx-4 mt-4">
        {allCategories.map((category, index) => (
          <div
            key={index}
            className="bg-slate-100 border border-gray-300 rounded-lg p-4 flex justify-between items-center"
          >
            <p className="text-sm font-medium text-gray-700">
              {category?.categoryName}
            </p>
            <div
              className="w-8 h-8 flex items-center justify-center p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer transition-colors duration-300"
              onClick={handleDelete}
            >
              <MdDelete className="text-lg" />
            </div>
          </div>
        ))}
      </div>

      {/** Upload category component */}
      {openUploadCategory && (
        <UploadCategory
          onClose={() => setOpenUploadCategory(false)}
          fetchData={fetchAllCategories}
        />
      )}
    </div>
  );
};

export default AllCategories;
