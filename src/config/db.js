const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://rananitish37:Umang123@nodejs.s7dyhys.mongodb.net/authem"
    )
}

module.exports = connectDB;