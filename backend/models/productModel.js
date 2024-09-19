const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
    rating: { type: Number, required: true, min: 1, max: 5 },  // Rating out of 5
    review: { type: String },  // User's review
    date: { type: Date, default: Date.now }  // Date of review
})

const productSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number,
    howToUse: String,
    benefits: String,
    ingredients: String,
    reviews: { type: [reviewSchema], default: [] },  // Default value as an empty array
    averageRating: { type: Number, default: 0 }  // Average rating of product
}, {
    timestamps: true
})

const productModel = mongoose.model('product', productSchema)

module.exports = productModel
