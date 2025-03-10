const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_KEY);
        console.log("connection to mongodb successful");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;