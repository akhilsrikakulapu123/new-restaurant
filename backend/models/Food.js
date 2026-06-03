const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    cuisine: String
});

module.exports = mongoose.model('Food', foodSchema);