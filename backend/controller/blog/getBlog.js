const blogModel = require("../../models/blogModel")

const getBlogController = async(req,res)=>{
    try{
        const allBlog = await blogModel.find().sort({ createdAt : -1 })

        res.json({
            message : "All Blog",
            success : true,
            error : false,
            data : allBlog
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

module.exports = getBlogController