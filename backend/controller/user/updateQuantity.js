const UserCart = require("../../models/UserCart");

const updateQuantity = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const productId = req.body.productId;
    const qty = req.body.quantity;

    // Find the user's cart
    const userCart = await UserCart.findOne({ userId: currentUserId });

    if (!userCart) {
      return res.status(404).json({
        message: "Cart not found for user",
        success: false,
        error: true,
      });
    }

    // Check if the product is already in the cart
    const productIndex = userCart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      // If the product is already in the cart, update the quantity
      userCart.cartItems[productIndex].quantity = qty;

      // Save the updated cart
      const updatedCart = await userCart.save();

      return res.json({
        data: updatedCart,
        message: "Product quantity updated in the cart",
        success: true,
        error: false,
      });
    } else {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
        error: true,
      });
    }

  } catch (err) {
    return res.status(500).json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = updateQuantity;
