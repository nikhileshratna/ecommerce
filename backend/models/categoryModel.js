const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true, // Ensures that the category name is unique
    },
    productCount : {
        type: Number,
        default: 0
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
