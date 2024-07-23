const UserCart = require("../../models/UserCart");

const deleteFromCart = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const productId = req.body.productId;

    // Find the user's cart
    const userCart = await UserCart.findOne({ userId: currentUserId });

    if (!userCart) {
      return res.status(404).json({
        message: "Cart not found for user",
        success: false,
        error: true,
      });
    }

    // Check if the product is in the cart
    const productIndex = userCart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
        error: true,
      });
    }

    // Remove the product from the cartItems array
    userCart.cartItems.splice(productIndex, 1);

    // Save the updated cart
    const updatedCart = await userCart.save();

    return res.json({
      message: "Product deleted from cart",
      success: true,
      error: false,
      data: updatedCart,
    });

  } catch (err) {
    return res.status(500).json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteFromCart;
