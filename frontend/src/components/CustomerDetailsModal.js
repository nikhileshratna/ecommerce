import React from 'react';

const CustomerDetailsModal = ({ customerId, onClose }) => {
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
