const userModel = require('../../models/userModel');

const countProductsInCart = async (req, res) => {
    const { userId } = req.userId;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productCount = user.cart.reduce((total, item) => total + item.quantity, 0);

        res.status(200).json({ count: productCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = countProductsInCart
