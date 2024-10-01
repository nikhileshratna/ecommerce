const mongoose = require('mongoose');

// Carousel Schema
const carouselSchema = mongoose.Schema({
    name: { type: String, required: true },  // Name of the carousel item
    productImage: { type: String, required: true }  // URL or path to the product image
}, {
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});

const carouselModel = mongoose.model('carousel', carouselSchema);

module.exports = carouselModel;
