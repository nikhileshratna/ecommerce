const userModel = require('../../models/userModel');

// Function to empty the cart
const emptyCart = async (req, res) => {
    try {
        // Assuming user ID is passed in the request parameters
        const userId = req.userId;

        // Find the user and update the cart to an empty array
        const user = await userModel.findByIdAndUpdate(userId, { cart: [] }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Cart emptied successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = emptyCart
