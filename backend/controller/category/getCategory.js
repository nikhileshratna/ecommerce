const categoryModel = require("../../models/categoryModel");

const getCategoryController = async (req, res) => {
    try {
        const allCategories = await categoryModel.find().sort({ createdAt: -1 });

        res.json({
            message: "All Categories",
            success: true,
            error: false,
            data: allCategories
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = getCategoryController;
