const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true, unique: true },
    content: String
});

module.exports = mongoose.model('Recipe', recipeSchema);
