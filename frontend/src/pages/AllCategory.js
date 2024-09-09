import React, { useEffect, useState } from "react";
import UploadCategory from "../components/UploadCategory";
import SummaryApi from "../common";

const AllCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [openUploadCategory, setOpenUploadCategory] = useState(false);

  const fetchAllCategories = async () => {
    const response = await fetch(SummaryApi.getCategory.url);
    const dataResponse = await response.json();
    setAllCategories(dataResponse?.data || []);
    console.log(dataResponse?.data);
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Categories</h2>
        <button
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenUploadCategory(true)}
        >
          Upload Category
        </button>
      </div>

      {/** all categories */}
      <div className="flex flex-col gap-3 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allCategories.map((category, index) => (
          <div
            key={index}
            className="bg-slate-100 border rounded p-3 flex flex-col justify-between items-center"
          >
            <p className="text-sm">{category?.categoryName}</p>
          </div>
        ))}
      </div>

      {/** upload category component */}
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
