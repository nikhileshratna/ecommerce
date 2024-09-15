const blogModel = require("../../models/blogModel");

const getBlogDetails = async (req, res) => {
    try {
        const { blogId } = req.body;

        const blog = await blogModel.findById(blogId);

        res.json({
            data: blog,
            message: "Ok",
            success: true,
            error: false
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getBlogDetails;
