const mongoose = require('mongoose'); // Erase if already required

var BCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    createdAt: {
        type: Date,
        default: Date.now, // Set the default value to the current date/time when a document is created
    },

}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('BCategory', BCategorySchema);