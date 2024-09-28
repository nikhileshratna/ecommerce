const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
    try {
        // Fetch all products and populate the 'user' field in each review
        const allProduct = await productModel.find().sort({ createdAt: -1 }).populate({
            path: 'reviews.user',  // Path to populate
            select: 'name email'  // Select fields to populate from user model
        });

        res.json({
            message: "All Products with Reviews",
            success: true,
            error: false,
            data: allProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getProductController;
