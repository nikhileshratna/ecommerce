const productModel = require("../../models/productModel");

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body;

        // Fetch the product by ID and populate the 'user' field in reviews
        const product = await productModel
            .findById(productId)
            .populate({
                path: 'reviews.user', // Path to populate
                select: 'name email'   // Specify fields to select from the User model
            });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            data: product,
            message: "Ok",
            success: true,
            error: false
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getProductDetails;
