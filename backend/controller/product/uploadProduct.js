const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");

async function UploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check permission
        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        // Extract category from the request body
        const { category, ...productData } = req.body;

        // Find the category by its name
        const categoryToUpdate = await categoryModel.findOne({ categoryName: category });
        
        if (!categoryToUpdate) {
            throw new Error("Category not found");
        }

        // Upload and save the product
        const uploadProduct = new productModel(productData);
        const saveProduct = await uploadProduct.save();

        // Increment product count for the category
        categoryToUpdate.productCount += 1;
        await categoryToUpdate.save();

        // Respond with success
        res.status(201).json({
            message: "Product uploaded successfully",
            error: false,
            success: true,
            data: saveProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadProductController;
