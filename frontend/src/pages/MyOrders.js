import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';
import CancelOrderModal from '../components/CancelOrderModal';

const MyOrders = () => {
  const { token } = useSelector(state => state.auth);
  const [orderDetails, setOrderDetails] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal , setOpenModal] = useState(false);

  const onClose = () => {
    setOpenModal(false);
  };

  const fetchAdditionalDetails = async () => {
    if (!token) return;

    try {
      const response = await fetch(SummaryApi.showAdditionalDetails.url, {
        method: SummaryApi.showAdditionalDetails.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        setOrderDetails(responseData?.data?.myOrders ?? []);
        console.log('Additional details fetched successfully:', responseData?.data?.myOrders);
      } else {
        console.error('Failed to fetch additional details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching additional details:', error);
    }
  };

  const fetchProductDetails = async (productId, quantity, shipment_id) => {
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const dataResponse = await response.json();
      if (response.ok) {
        setData((prevData) => {
          const existingProduct = prevData.find(p => p._id === productId);
          if (existingProduct) {
            return prevData.map(p =>
              p._id === productId
                ? { ...p, quantity, shipment_id }
                : p
            );
          }
          return [
            ...prevData,
            {
              ...dataResponse.data,
              quantity,
              shipment_id
            }
          ];
        });
      } else {
        console.error('Failed to fetch product details:', dataResponse.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAdditionalDetails();
      setLoading(false);
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchAllProductDetails = async () => {
      setLoading(true);
      const promises = orderDetails.map(item =>
        fetchProductDetails(item.productId, item.quantity, item.shipment_id)
      );
      await Promise.all(promises);
      setLoading(false);
    };

    if (orderDetails.length > 0) {
      fetchAllProductDetails();
    }
  }, [orderDetails]);

  useEffect(() => {
    console.log("Updated data:", data);
  }, [data]);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-600">No Orders Found</div>
        ) : (
          data.map((product) => (
            <div key={product?._id} className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
              <Link to={`/product/${product?._id}`} className="flex">
                <div className="w-32 h-32 bg-gray-200">
                  {product?.productImage && (
                    <img
                      src={product?.productImage[0]}
                      alt={product?.productName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <h2 className="text-lg lg:text-xl font-medium text-gray-800 line-clamp-1">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-gray-500">{product?.category}</p>
                </div>
              </Link>
              <div className="flex justify-end items-center gap-4 p-4">
                <Link className="border-2 border-blue-600 rounded px-3 py-2 text-blue-600 font-medium hover:bg-blue-600 hover:text-white"
                to={`/track-order/${product?.shipment_id}`}
                >
                  Track Order
                </Link>
                <button className="border-2 border-red-600 rounded px-3 py-2 text-red-600 font-medium bg-red-50 hover:text-white hover:bg-red-600"
                onClick={() => setOpenModal(true)}>
                  Cancel Order
                </button>
              </div>
              {openModal && 
            <CancelOrderModal onClose={() => setOpenModal(false)} shipment_id={product?.shipment_id}/>
          }
            </div>
          ))

          
        )}
      </div>
      
    </div>
  );
};

export default MyOrders;
