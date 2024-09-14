const orderModel = require("../../models/orderModel");

const updateOrderController = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        // Check if the order status is valid
        const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status",
                error: true,
                success: false
            });
        }

        // Find the order by ID and update the status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { orderStatus }, 
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Order status updated successfully",
            success: true,
            error: false,
            data: updatedOrder
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = updateOrderController;
