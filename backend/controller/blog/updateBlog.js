const uploadBlogPermission = require('../../helpers/permission');
const blogModel = require('../../models/blogModel');

async function updateBlogController(req, res) {
    try {
        // Check if the user has permission to upload or update a blog
        if (!uploadBlogPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id, ...resBody } = req.body;

        // Find the blog by ID and update it with the provided data
        const updateBlog = await blogModel.findByIdAndUpdate(_id, resBody);
        console.log("updateBlog ->", updateBlog);
        console.log("data ->", _id , resBody);

        res.json({
            message: "Blog updated successfully",
            data: updateBlog,
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

module.exports = updateBlogController;
