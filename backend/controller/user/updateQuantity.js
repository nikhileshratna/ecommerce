const userModel = require('../../models/userModel');

const updateCart = async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            // If item exists in cart, update the quantity
            if (quantity > 0) {
                user.cart[cartItemIndex].quantity = quantity;
            } else {
                // If quantity is 0 or less, remove the item from the cart
                user.cart.splice(cartItemIndex, 1);
            }
        } else {
            // If item does not exist in cart and quantity is greater than 0, add new item to cart
            if (quantity > 0) {
                user.cart.push({ productId, quantity });
            }
        }

        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Cart updated successfully', 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = updateCart
