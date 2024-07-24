const userModel = require('../../models/userModel');

const deleteFromCart = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedCart = user.cart.filter(item => item.productId.toString() !== productId);
        user.cart = updatedCart;

        await user.save();

        res.status(200).json({ 
            message: 'Product removed from cart', 
            cart: user.cart,
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = deleteFromCart
