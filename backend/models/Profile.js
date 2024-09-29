const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    contactNumberVerified: {
        type: Boolean,
        default: false
    },

    dateOfBirth: {
        type: String,
    },

    contactNumber: {
        type: String,
        trim: true,
    },

    address1: {
        type: String,
        trim: true,
    },

    address2: {
        type: String,
        trim: true,
    },

    city: {
        type: String,
        trim: true,
    },

    pincode: {
        type: String, // Accommodating leading zeros
        trim: true,
    },

    state: {
        type: String,
        trim: true,
    },

    country: {
        type: String,
        trim: true,
    },

    myOrders: {
        type: [{
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'order', // Reference to the 'order' model
            },
            shipment_id: {
                type: String,
            }
        }],
        default: []
    },

    wishlist: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product', // Reference to the 'product' model
            }
        }],
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);
