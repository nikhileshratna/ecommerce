const userModel = require('../../models/userModel');

const showCart = async (req, res) => {
    const userId = req.userId;

    if(!userId) {
        return res.status(400).json({ message: ` ${userId} ` });
    }

    try {
        const user = await userModel.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true, 
            cart: user.cart 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = showCart
