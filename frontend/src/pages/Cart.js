import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BuyProduct } from "../components/BuyProduct";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCart = new Array(4).fill(null);
  const { token } = useSelector((state) => state.auth);
  // const { total, cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleBuyProduct = async () => {
    let products = [];
    data?.map((product) => {
      products.push({
        _id: product.productId._id,
        quantity: product.quantity,
      });
    });
    BuyProduct(products,totalPrice,token,user, navigate, dispatch);
  };

  const fetchData = async () => {
    const response = await fetch(SummaryApi.cartProductView.url, {
      method: SummaryApi.cartProductView.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    console.log("response data", responseData);

    if (responseData.success) {
      setData(responseData.cart);
    }
    else{
      toast.error("Something went wrong");
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();
      console.log("response data", responseData);

      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: id,
      }),
    });

    const responseData = await response.json();
    console.log("response data", responseData);
    if (responseData.success) {
      fetchData();
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  const totalPrice = data.reduce(
    (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
    0
  );
  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/***view product */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart?.map((el, index) => {
                return (
                  <div
                    key={el + "Add To Cart Loading" + index}
                    className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                  ></div>
                );
              })
            : data.map((product, index) => {
                return (
                  <div
                    key={product.productId?._id + "Add To Cart Loading"}
                    className="w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]"
                  >
                    <div className="w-32 h-32 bg-slate-200">
                      <img
                        src={product.productId?.productImage[0]}
                        className="w-full h-full object-scale-down mix-blend-multiply"
                      />
                    </div>
                    <div className="px-4 py-2 relative">
                      {/**delete product */}
                      <div
                        className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                        onClick={() => deleteCartProduct(product.productId?._id)}
                      >
                        <MdDelete />
                      </div>

                      <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                        {product.productId?.productName}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product.productId.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 font-medium text-lg">
                          {displayINRCurrency(product.productId?.sellingPrice)}
                        </p>
                        <p className="text-slate-600 font-semibold text-lg">
                          {displayINRCurrency(
                            product.productId?.sellingPrice * product.quantity
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() => decraseQty(product.productId?._id, product.quantity)}
                        >
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() => increaseQty(product.productId?._id, product.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/***summary  */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>

              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>

              <button
                className="bg-blue-600 p-2 text-white w-full mt-2"
                onClick={handleBuyProduct}
              >
                Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
