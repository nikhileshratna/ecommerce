import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MyOrders = () => {
  const { user } = useSelector(state => state.profile);
  const [orderDetails, setOrderDetails] = useState(user?.additionalDetails?.myOrders);

  return (
    <div className="bg-red-50 text-red-900 p-5 rounded-lg">
      <div>
        {
          orderDetails?.length === 0 && <p className="text-red-600 text-center">No orders found</p>
        }
        {
          orderDetails.map((item, index) => (
            <div key={index} className="bg-red-100 p-3 my-2 rounded-md">
              <p>{item}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MyOrders;
