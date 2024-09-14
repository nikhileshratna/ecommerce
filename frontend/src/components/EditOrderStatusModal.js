import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const EditOrderStatusModal = ({ orderId, currentStatus, onClose, fetchData }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false); // Add loading state
  const statusOptions = ['pending', 'shipped', 'delivered', 'canceled'];

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    setLoading(true); // Show loading before the request starts
    try {
      const response = await fetch(SummaryApi.updateOrder.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus: status,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Order status updated successfully!');
        fetchData(); // Fetch updated data
        onClose();   // Close modal after success
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error("Error updating order status", error);
      toast.error('Error updating order status.');
    } finally {
      setLoading(false); // Hide loading after the request completes
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded shadow-md w-full sm:w-[400px]'>
        <h2 className='font-bold mb-4'>Edit Order Status</h2>
        <div className='mb-4'>
          <label htmlFor="order-status" className='block mb-2 font-semibold'>Select Order Status:</label>
          <select
            id="order-status"
            value={status}
            onChange={handleStatusChange}
            className='w-full border border-gray-300 p-2 rounded'>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-end gap-2'>
          <button
            className='border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition-all py-1 px-3 rounded'
            onClick={onClose}
            disabled={loading} // Disable cancel while loading
          >
            Cancel
          </button>
          <button
            className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded'
            onClick={updateOrderStatus}
            disabled={loading} // Disable update while loading
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>

        {loading && (
          <div className='mt-4 text-center'>
            <div>Updating.......Please Wait</div> {/* Simple loading message */}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditOrderStatusModal;
