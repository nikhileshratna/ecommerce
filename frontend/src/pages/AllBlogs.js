import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import AdminBlogCard from "../components/AdminBlogCard";
import UploadBlog from "../components/UploadBlog";

const AllBlogs = () => {
  const [allBlog, setAllBlog] = useState([]);
  const [openUploadBlog, setOpenUploadBlog] = useState(false);

  const fetchAllBlog = async () => {
    const response = await fetch(SummaryApi.allBlog.url);
    const dataResponse = await response.json();
    setAllBlog(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllBlog();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Blogs</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
          onClick={() => setOpenUploadBlog(true)}
        >
          Upload Blog
        </button>
      </div>

      {/**all blog */}
      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allBlog.map((product, index) => {
          return (
            <AdminBlogCard
              data={product}
              key={index + "allProduct"}
              fetchdata={fetchAllBlog}
            />
          );
        })}
      </div>

     
      {/**upload prouct component */}
      {openUploadBlog && (
        <UploadBlog
          onClose={() => setOpenUploadBlog(false)}
          fetchData={fetchAllBlog}
        />
      )}
    </div>
  );
};

export default AllBlogs;
