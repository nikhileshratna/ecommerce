const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: "Buyer",
    },
    role: {
        type: String,
        default: "GENERAL",
    },
    token: String,
    contactNumber: Number,
    profilePic: String,
    cart: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            quantity: {
                type: Number,
            }
        }],
        default: []
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
