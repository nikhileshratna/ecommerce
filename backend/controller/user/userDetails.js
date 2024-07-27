const userModel = require("../../models/userModel")

async function userDetailsController(req,res){
    try{
        console.log("userId inside userDetailsController",req.userId)
        if(!req.userId){
            return res.status(400).json({
                message : `user id not found`,
                error : true,
                success : false
            })
        }
        const user = await userModel.findById(req.userId).populate("additionalDetails").exec();

        if(!user){
            return res.status(400).json({
                message : `user not found`,
                error : true,
                success : false
            })
        }

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = userDetailsController


