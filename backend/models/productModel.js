const mongoose = require('mongoose');

// Review Schema
const reviewSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },  // Reference to User model
    rating: { type: Number, required: true, min: 1, max: 5 },  // Rating out of 5
    review: { type: String },  // User's review
    date: { type: Date, default: Date.now }  // Date of review
});

// Product Schema
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
    reviews: { type: [reviewSchema], default: [] },  // Reviews array
    averageRating: { type: Number, default: 0 }  // Average rating of the product
}, {
    timestamps: true
});

// // Pre-save hook to calculate average rating
// productSchema.pre('save', function(next) {
//     if (this.reviews && this.reviews.length > 0) {
//         const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
//         this.averageRating = totalRating / this.reviews.length;  // Calculate the average
//     } else {
//         this.averageRating = 0;  // No reviews, set rating to 0
//     }
//     next();
// });

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
