const orderModel = require("../../models/orderModel");

async function UploadOrderController(req, res) {
    try {
        // Assuming req.userId holds the session user ID
        const sessionUserId = req.userId;

        // Create a new order based on the request body
        const uploadOrder = new orderModel({
            ...req.body,
            customerId: sessionUserId // Assuming customerId refers to the session user
        });

        // Save the new order
        const saveOrder = await uploadOrder.save();

        res.status(201).json({
            message: "Order uploaded successfully",
            error: false,
            success: true,
            data: saveOrder
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadOrderController;
