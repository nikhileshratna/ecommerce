const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel');

async function deleteProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        // Find the product by ID
        const productToDelete = await productModel.findById(_id);

        if (!productToDelete) {
            throw new Error("Product not found");
        }

        // Find the category associated with the product
        const categoryToUpdate = await categoryModel.findOne({ categoryName: productToDelete.category });

        if (!categoryToUpdate) {
            throw new Error("Category not found");
        }

        // Delete the product
        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            throw new Error("Product deletion failed");
        }

        // Decrement product count for the category
        categoryToUpdate.productCount = Math.max(0, categoryToUpdate.productCount - 1);
        await categoryToUpdate.save();

        res.json({
            message: "Product deleted successfully",
            data: deletedProduct,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
