const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    address1: { 
        type: String, 
        required: true 
    },
    address2: { 
        type: String 
    },
    city: { 
        type: String, 
        required: true 
    },
    pincode: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String,
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
