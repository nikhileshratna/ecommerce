const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
  try {
    // Find all products and populate the user field in each review
    const allProduct = await productModel.find()
      .sort({ createdAt: -1 })
      .populate('reviews.user', 'firstName lastName email'); // Populate user fields (firstName, lastName, email)

    res.json({
      message: "All Product",
      success: true,
      error: false,
      data: allProduct
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = getProductController;
