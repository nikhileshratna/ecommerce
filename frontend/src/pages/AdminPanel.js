import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.user?.role !== ROLE.ADMIN) {
      navigate("/login");
    }
    console.log("user in admin panel", user);
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      <aside className="bg-white min-h-full  w-full  max-w-60 customShadow">
        <div className="h-32  flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user.profilePic ? (
              <img
                src={user.user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user.user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user.user?.name}</p>
          <p className="text-sm">{user.user?.role}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="grid p-4">
            <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">
              All Users
            </Link>
            <Link to={"all-products"} className="px-2 py-1 hover:bg-slate-100">
              All product
            </Link>
            <Link to={"all-blogs"} className="px-2 py-1 hover:bg-slate-100">
              All blogs
            </Link>
            <Link to={"all-categories"} className="px-2 py-1 hover:bg-slate-100">
              All categories
            </Link>
            <Link to={"all-orders"} className="px-2 py-1 hover:bg-slate-100">
              All Orders
            </Link>
            <Link to={"add-contact"} className="px-2 py-1 hover:bg-slate-100">
              All Message
            </Link>
            <Link to={"all-carousel"} className="px-2 py-1 hover:bg-slate-100">
              All Carousel
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
