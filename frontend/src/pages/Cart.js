import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BuyProduct } from "../components/BuyProduct";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { emptyCart, removeFromCart } from "../slices/cartSlice";
import CODModal from "../components/CODModal";
import { getUserDetails } from '../services/operations/profileAPI';
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import EditProfileDetails from "../components/BuyerEditDetails";

const Cart = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cod, setCod] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingCart = new Array(4).fill(null);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [additionalDetails, setAdditionalDetails] = useState({});
  const [editModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAdditionalDetails = async () => {
    if (!token) return;

    const response = await fetch(SummaryApi.showAdditionalDetails.url, {
      method: SummaryApi.showAdditionalDetails.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      setAdditionalDetails(responseData?.data ?? {});
    } else {
      console.error('Failed to fetch additional details:', responseData.message);
    }
  };

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserDetails(token, navigate));
    }
  }, [dispatch, navigate, token, user]);

  useEffect(() => {
    fetchAdditionalDetails();
    if (user) {
      setAdditionalDetails(user.additionalDetails ?? {});
    }
    console.log(additionalDetails);
  }, [user]);

  const handleCashOnDelivery = () => {
    let products = data.map((product) => ({
      _id: product.productId._id,
      quantity: product.quantity,
    }));

    setShowModal(false);

    if (products.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    BuyProduct(products, totalPrice, token, user, navigate, dispatch, data, true);
  };

  const handleBuyProduct = async () => {
    let products = data.map((product) => ({
      _id: product.productId._id,
      quantity: product.quantity,
    }));

    if (products.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    BuyProduct(products, totalPrice, token, user, navigate, dispatch, data, cod);
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

    if (responseData.success) {
      setData(responseData.cart);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleLoading = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  useEffect(() => {
    handleLoading();
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

  const decreaseQty = async (id, qty) => {
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

    if (responseData.success) {
      dispatch(removeFromCart());
      toast.success(responseData.message);
      fetchData();
    } else {
      toast.error(responseData.message);
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );

  const totalPrice = data.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.quantity * currentValue?.productId?.sellingPrice,
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
        {/*** View Product Section ***/}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((el, index) => (
              <div
                key={el + "Add To Cart Loading" + index}
                className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
              ></div>
            ))
            : data.map((product, index) => (
              <div
                key={product.productId?._id + "Add To Cart Loading"}
                className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
              >
                <div className="w-32 h-32 bg-slate-200">
                  <img
                    src={product.productId?.productImage[0]}
                    alt={product.productId?.productName}
                    className="w-full h-full object-scale-down mix-blend-multiply"
                  />
                </div>
                <div className="px-4 py-2 relative">
                  {/*** Delete Product ***/}
                  <div
                    className="absolute top-2 right-2 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
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
                      onClick={() =>
                        decreaseQty(product.productId?._id, product.quantity)
                      }
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                      onClick={() =>
                        increaseQty(product.productId?._id, product.quantity)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/*** Additional Details and Summary Section ***/}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-red-600 mb-4">
                Your Address
              </h3>
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                {Object.keys(additionalDetails).length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-700">Address Line1:</p>
                      <p>{additionalDetails.address1} { }</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-700">Address Line2:</p>
                      <p                  >{additionalDetails.address2}</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="text-gray-700">City:</p>
                      <p>{additionalDetails.city}</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="text-gray-700">State:</p>
                      <p>{additionalDetails.state}</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="text-gray-700">Pincode:</p>
                      <p>{additionalDetails.pincode}</p>
                    </div>

                    <button
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit Address
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No Address Available</p>
                )}
              </div>

              <h3 className="text-2xl font-semibold text-red-600 mb-4">Summary</h3>
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-700">Total Quantity:</p>
                  <p>{totalQty}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-700">Total Price:</p>
                  <p>{displayINRCurrency(totalPrice)}</p>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <button
                    className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                    onClick={handleBuyProduct}
                  >
                    Pay Now
                  </button>
                  <button
                    className="bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
                    onClick={() => setShowModal(true)}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*** COD Modal ***/}
      {showModal && (
        <CODModal
          onConfirm={handleCashOnDelivery}
          onClose={() => setShowModal(false)}
        />
      )}
      {
        editModal && <EditProfileDetails onClose={() => setShowEditModal(false)} additionalDetails={additionalDetails} />
      }
    </div>
  );
};

export default Cart;
