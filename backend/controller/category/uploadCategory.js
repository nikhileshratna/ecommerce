const uploadCategoryPermission = require("../../helpers/permission");
const categoryModel = require("../../models/categoryModel");

async function UploadCategoryController(req, res) {
    try {
        const sessionUserId = req.userId;
        if (!uploadCategoryPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const { categoryName } = req.body;
        if (!categoryName) {
            throw new Error("Category name is required");
        }

        // Check if the category already exists
        const existingCategory = await categoryModel.findOne({ categoryName });
        if (existingCategory) {
            throw new Error("Category already exists");
        }

        // Create a new category
        const uploadCategory = new categoryModel({ categoryName });
        const saveCategory = await uploadCategory.save();

        res.status(201).json({
            message: "Category uploaded successfully",
            error: false,
            success: true,
            data: saveCategory
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadCategoryController;
