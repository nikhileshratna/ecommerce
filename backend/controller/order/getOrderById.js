const orderModel = require("../../models/orderModel");

const getOrderById = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Find the order by its ID
    const order = await orderModel.findById(orderId).populate('productIds customerId'); // populate to get related product and customer details

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      data: order,
      message: "Order retrieved successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = { getOrderById };
