const addToCartModel = require("../../models/cartProduct")
const UserCart = require("../../models/UserCart")

const addToCart = async(req,res)=>{
    try{
        const { productId } = req?.body
        const currentUser = req.userId

        const isUser = await addToCartModel.findOne({ userId : currentUser })

        if(!isUser){
            const payload  = {
                userId : currentUser,
                cartItems : []
            }

            const newAddToCart = new UserCart(payload);
            const saveProduct = await newAddToCart.save();
        }


        const user = await addToCartModel.findOne({ userId : currentUser });
        const isProductPresent = user.cartItems.findOne(productId);

        if(isProductPresent){
            return res.json({
                message : "Already exits in Add to cart",
                success : false,    
                error : true
            })
        }

        user.cartItems.push({productId, quantity : 1})
        const saveProduct = await user.save();

        return res.json({
            data : saveProduct,
            message : "Product Added in Cart",
            success : true,
            error : false
        })
        

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = addToCart