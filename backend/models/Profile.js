const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender: {
        type: String,
    },

    dateOfBirth: {
        type: String,
    },


    contactNumber: {
        type: Number,
        trim: true,
    },

    address: {
        type: [{
            addressId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'address',
            }
        }],
        default: [],
    },
    myOrders: {
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
    },
});

module.exports = mongoose.model("Profile", profileSchema);