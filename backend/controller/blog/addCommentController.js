const blogModel = require('../../models/blogModel');
const uploadBlogPermission = require('../../helpers/permission');

async function addCommentController(req, res) {
    try {
        // Check if the user has permission to comment
        // if (!uploadBlogPermission(req.userId)) {
        //     throw new Error("Permission denied");
        // }

        const { blogId, commentText } = req.body;

        if (!blogId || !commentText) {
            return res.status(400).json({
                message: "Blog ID and comment text are required",
                error: true,
                success: false,
            });
        }

        // Find the blog by ID
        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                error: true,
                success: false
            });
        }

        // Add the new comment to the blog's comments array
        const newComment = {
            user: req.userId,  // Assuming the user ID comes from authentication middleware
            commentText
        };

        blog.comments.push(newComment);

        // Save the updated blog
        await blog.save();

        res.json({
            message: "Comment added successfully",
            data: blog.comments,
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

module.exports = addCommentController;
