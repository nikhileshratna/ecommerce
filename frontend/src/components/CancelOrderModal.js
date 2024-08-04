import React from 'react';
import { toast } from 'react-toastify';

const CancelOrderModal = ({ shipment_id, onClose }) => {
    const EMAIL = process.env.REACT_APP_SHIPROCKET_EMAIL;
    const PASSWORD = process.env.REACT_APP_SHIPROCKET_PASS;

    // Convert shipment_id to an integer
    const shipmentIdInt = parseInt(shipment_id, 10);

    const handleCancel = async () => {
        onClose();
        const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";
        const toastID = toast.loading("Cancelling order...");

        try {
            // Log in to get the token
            const loginResponse = await fetch(`${shiprocketURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": EMAIL,
                    "password": PASSWORD
                })
            });

            const loginData = await loginResponse.json();
            const shiprocketToken = loginData.token;

            if (!loginResponse.ok || !shiprocketToken) {
                throw new Error('Login failed');
            }

            // Cancel the order
            const cancelResponse = await fetch(`${shiprocketURL}/orders/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${shiprocketToken}`
                },
                body: JSON.stringify({ ids: [shipmentIdInt] }) // Use the integer shipment_id here
            });

            if (!cancelResponse.ok) {
                throw new Error('Failed to cancel the order');
            }

            await fetch(`${shiprocketURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${shiprocketToken}`
                }
            });

            toast.dismiss(toastID);
            toast.success("Order cancelled successfully");

        } catch (err) {
            toast.dismiss(toastID);
            toast.error("Cannot cancel order");
            console.error(err.message);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-[#0A7A7D] text-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-sm'>
                <h2 className='text-xl font-bold mb-4'>Cancel Order</h2>
                <p className='mb-4 text-center'>
                    Are you sure you want to cancel this order?
                </p>
                <div className='flex gap-4'>
                    <button
                        onClick={handleCancel}
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
    );
};

export default CancelOrderModal;
