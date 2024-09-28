const productModel = require('../../models/productModel');

async function addReviewController(req, res) {
    try {
        const { productId, rating, review } = req.body;

        if (!rating) {
            throw new Error("Rating is required");
        }

        // Fetch the product by ID
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Check if the user has already submitted a review
        const existingReview = product.reviews.find(r => r.user.toString() === req.userId);

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product",
                error: true,
                success: false
            });
        }

        // Add new review to the product
        const newReview = {
            user: req.userId,  // Assuming req.userId contains the authenticated user's ID
            rating: rating,
            review: review
        };

        product.reviews.push(newReview);

        // Update the average rating
        const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRatings / product.reviews.length;

        // Save the updated product
        await product.save();

        res.json({
            message: "Review added successfully",
            data: product,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = addReviewController;
