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
        type: String, // Changed to String to accommodate leading zeros
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
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            quantity: {
                type: Number,
            },
            shipment_id: {
                type: String
            }
        }],
        default: []
    },
});

module.exports = mongoose.model("Profile", profileSchema);
