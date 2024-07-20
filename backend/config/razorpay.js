const Razorpay = require("razorpay");

// Initialize the Razorpay instance
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});