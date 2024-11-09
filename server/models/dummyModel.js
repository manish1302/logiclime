const mongoose = require('mongoose');

const dummySchema = mongoose.Schema({
    name: {
        type : String
    },
    age: {
        type : Number
    }
})

module.exports = mongoose.model('dummyModel', dummySchema);