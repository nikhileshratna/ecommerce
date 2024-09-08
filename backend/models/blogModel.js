const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title : String,
    blogImage : [],
    description : String,
},{
    timestamps : true
})


const blogModel = mongoose.model("blog",blogSchema)

module.exports = blogModel