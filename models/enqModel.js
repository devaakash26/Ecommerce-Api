const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var EnquireSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

//Export the model
module.exports = mongoose.model('Enquire', EnquireSchema);