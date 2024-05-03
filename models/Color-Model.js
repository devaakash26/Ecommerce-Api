const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var ColorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },

},
{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Color', ColorSchema);