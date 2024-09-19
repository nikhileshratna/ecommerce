const userModel = require('../../models/userModel');

const showCart = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ message: `User ID is missing: ${userId}` });
    }

    try {
        // Log the userId for debugging
        console.log("Fetching cart for user:", userId);

        // Find user by ID and populate the product details in the cart
        const user = await userModel.findById(userId).populate('cart.productId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the cart data for debugging
        console.log("Cart data:", user.cart);

        res.status(200).json({
            success: true,
            cart: user.cart,
        });

    } catch (error) {
        // Log the actual error message for debugging
        console.error("Error in showCart:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = showCart;
