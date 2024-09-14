import React, { useEffect } from 'react';
import SummaryApi from '../common';

const CustomerDetailsModal = ({ customerId, onClose }) => {
    const [data, setData] = React.useState({});
    
    const fetchCustomerDetails = async () => {
        const response = await fetch(`${SummaryApi.userDetailById.url}?userId=${customerId}`, {
          method: SummaryApi.userDetailById.method,
          headers: {
            "content-type": "application/json",
          },
        });
        const dataResponse = await response.json();
        console.log(dataResponse);
        setData(dataResponse?.data);
      };

      useEffect(() => {
        fetchCustomerDetails();
      }, [customerId]);  // Ensure customerId is added as a dependency
    
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded shadow-md'>
                <h2 className='font-bold mb-2'>Customer Details</h2>
                <p>Customer ID: {customerId}</p>
                {/* Display additional customer details */}
                {/* <p>Name: {data.name}</p>
                <p>Email: {data.email}</p> */}
                {/* Add more details as needed */}
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
