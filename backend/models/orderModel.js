const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    quantities: [Number],
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    paymentStatus : { type: String , default: 'cod' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true
});

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
