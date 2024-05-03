const mongoose = require('mongoose');

var PCategorySchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true, 
    }
);

// Export the model
module.exports = mongoose.model('PCategory', PCategorySchema);
