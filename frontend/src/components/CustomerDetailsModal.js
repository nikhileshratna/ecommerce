import React, { useEffect } from 'react';
import SummaryApi from '../common';

const CustomerDetailsModal = ({ customerId, onClose }) => {
    const [data, setData] = React.useState({});
    const fetchCustomerDetails = async () => {
        const response = await fetch(SummaryApi.userDetailById.url, {
          method: SummaryApi.productDetails.method,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId: customerId,
          }),
        });
        const dataResponse = await response.json();
        console.log(dataResponse?.data);
        setData( dataResponse?.data );
      };

      useEffect(() => {
        fetchCustomerDetails();
      },[]);
    
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded shadow-md'>
                <h2 className='font-bold mb-2'>Customer Details</h2>
                <p>Customer ID: {customerId}</p>
                {/* Additional customer details can be fetched and displayed here */}
                <button 
                    className='mt-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
