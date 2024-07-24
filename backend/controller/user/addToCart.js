const userModel = require('../../models/userModel');
const productModel = require('../../models/productModel');

const addToCart = async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    
    try {
        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product is already in the cart
        const existingProductIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (existingProductIndex >= 0) {
            // If product exists in the cart, update the quantity
            user.cart[existingProductIndex].quantity = quantity;
        } else {
            // If product does not exist in the cart, add it to the cart
            user.cart.push({ productId, quantity });
        }

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = addToCart
