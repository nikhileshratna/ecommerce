const uploadCategoryPermission = require('../../helpers/permission');
const categoryModel = require('../../models/categoryModel');

async function deleteCategoryController(req, res) {
    try {
        if (!uploadCategoryPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        const deletedCategory = await categoryModel.findByIdAndDelete(_id);

        if (!deletedCategory) {
            throw new Error("Category not found");
        }

        res.json({
            message: "Category deleted successfully",
            data: deletedCategory,
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

module.exports = deleteCategoryController;
