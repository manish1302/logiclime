const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect('mongodb+srv://Manish:Manish1302@logiclime.r50ci.mongodb.net/');
        console.log("connection to mongodb successful");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;