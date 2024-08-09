import React from 'react'

const CODModal = ({ onConfirm, onClose }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-[#0A7A7D] text-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-sm'>
                <h2 className='text-xl font-bold mb-4'>Place Order</h2>
                <p className='mb-4 text-center'>
                    Are you sure you want to place this order?
                </p>
                <div className='flex gap-4'>
                    <button
                        onClick={onConfirm}
                        className="py-2 px-4 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="py-2 px-4 text-sm font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
  )
}

export default CODModal