const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel');

async function updateProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id, category, ...resBody } = req.body;

        // Find the current product
        const currentProduct = await productModel.findById(_id);
        if (!currentProduct) {
            throw new Error("Product not found");
        }

        // Check if category is being updated
        if (category && category !== currentProduct.category) {
            // Decrement product count for the old category
            const oldCategory = await categoryModel.findOne({ categoryName: currentProduct.category });
            if (oldCategory) {
                oldCategory.productCount = Math.max(0, oldCategory.productCount - 1);
                await oldCategory.save();
            }

            // Increment product count for the new category
            const newCategory = await categoryModel.findOne({ categoryName: category });
            if (!newCategory) {
                throw new Error("New category not found");
            }
            newCategory.productCount += 1;
            await newCategory.save();

            // Update the category in resBody
            resBody.category = category;
        }

        // Update the product
        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody, { new: true });

        res.json({
            message: "Product updated successfully",
            data: updateProduct,
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

module.exports = updateProductController;