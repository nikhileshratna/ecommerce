const mongoose = require("mongoose")

//hello
async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB