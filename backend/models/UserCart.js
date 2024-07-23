const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: String,
    cartItems : [],
},{
    timestamps : true
})


const UserCart = mongoose.model("cart",cartSchema)

module.exports = UserCart