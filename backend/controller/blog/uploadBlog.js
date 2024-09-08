const uploadBlogPermission = require("../../helpers/permission")
const blogModel = require("../../models/blogModel")

async function UploadBlogController(req,res){
    try{
        const sessionUserId = req.userId
        if(!uploadBlogPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const uploadBlog = new blogModel(req.body)
        const saveBlog = await uploadBlog.save()

        res.status(201).json({
            message : "Blog upload successfully",
            error : false,
            success : true,
            data : saveBlog
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UploadBlogController