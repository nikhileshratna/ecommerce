const uploadBlogPermission = require('../../helpers/permission');
const blogModel = require('../../models/blogModel');

async function deleteBlogController(req, res) {
    try {
        // Check if the user has permission to delete a blog
        if (!uploadBlogPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        // Find the blog by ID and delete it
        const deletedBlog = await blogModel.findByIdAndDelete(_id);

        if (!deletedBlog) {
            throw new Error("Blog not found");
        }

        res.json({
            message: "Blog deleted successfully",
            data: deletedBlog,
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

module.exports = deleteBlogController;
