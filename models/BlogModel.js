const mongoose = require('mongoose'); // Erase if already required

var BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    likecount:{
        type:Number,
        default:0
    },
    dislikecount:{
        type:Number,
        default:0,
    },
    images:[],
    author:{
        type:String,
        default:"admin",
    },
},{
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:{
        virtuals:true,
    }
});

module.exports = mongoose.model('Blog', BlogSchema);