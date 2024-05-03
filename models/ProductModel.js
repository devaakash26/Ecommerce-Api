
const mongoose= require("mongoose");
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        ref: "Category",
    },
    brand:[], 
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    color:[],
    tag:[],
    ratings: [
        {
            star: Number,
            comments: String,
            postedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
    ],
    totalrating: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true });

// Export the model
module.exports = mongoose.model('products', productSchema);
