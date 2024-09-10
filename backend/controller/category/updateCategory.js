const uploadCategoryPermission = require('../../helpers/permission');
const categoryModel = require('../../models/categoryModel');

async function updateCategoryController(req, res) {
    try {
        // Check if the user has permission to update the category
        if (!uploadCategoryPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        // Destructure _id from the request body and get the rest of the updated data
        const { _id, ...resBody } = req.body;

        // Find the category by ID and update it with the new data
        const updateCategory = await categoryModel.findByIdAndUpdate(_id, resBody, { new: true });

        // Send a success response with the updated category data
        res.json({
            message: "Category updated successfully",
            data: updateCategory,
            success: true,
            error: false
        });

    } catch (err) {
        // Handle errors and send an error response
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateCategoryController;
