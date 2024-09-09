const uploadBlogPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')

async function updateBlogController(req,res){
    try{

        if(!uploadBlogPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body;

        console.log("data ->  : " , _id , resBody);

        const updateBlog = await productModel.findByIdAndUpdate(_id,resBody)

        console.log("updateBlog -> " , updateBlog);
        
        res.json({
            message : "Blog update successfully",
            data : updateBlog,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = updateBlogController