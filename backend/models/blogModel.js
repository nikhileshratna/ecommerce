const mongoose = require('mongoose');

// Comment schema for nested comments inside the blog
const commentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
    commentText: { type: String, required: true },  // Comment text
    date: { type: Date, default: Date.now },  // Date of the comment
});

const blogSchema = mongoose.Schema({
    title: String,
    blogImage: [],
    description: String,
    comments: { 
        type: [commentSchema],  // Array of comments
        default: []  // Initialize with an empty array
    },
}, {
    timestamps: true
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
