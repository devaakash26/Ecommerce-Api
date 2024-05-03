const Product = require('../models/ProductModel');
const User = require('../models/userModels');
const asyncHandler = require("express-async-handler");
const slugify = require('slugify');
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);

        res.json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create product" });
    }
});
//Update a Product

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const update = await Product.findByIdAndUpdate(id, req.body, { new: true })
        res.json(update);
    } catch (error) {
        throw new Error(error);
    }
})


//Fetch a PRODUCT

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {

        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

//Get a All Product

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort({ createdAt: -1 }); // Sorting by createdAt in descending order (latest first)
        }

        // Field Selection
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // Exclude '__v' field by default
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (page > 1) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error("This Page Does not exist");
            }
        }

        // console.log(page, limit, skip);
        const products = await query;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Can't fetch all products", error: error.message });
    }
});
//Delete a Product

const deleteaProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const deleteproduct = await Product.findOneAndDelete({ _id: id });
        if (!deleteproduct) {
            return res.status(404).json({ message: "Product Not found to be deleted" });
        }
        res.json({ message: "Deleted Successfully" });
    } catch (error) {

        throw new Error("Something went wrong while you deleting the product");
    }
})

//Add to WishList

const addToWishsList = asyncHandler(async (req, res) => {
    const { _id } = req.getuser;
    // console.log(_id);
    const { proId } = req.body;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const product = await Product.findById(proId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const alreadyAdded = user.wishlist.find(id => id.toString() === proId.toString());
        if (alreadyAdded) {
            await User.findByIdAndUpdate(_id, { $pull: { wishlist: proId } }, { new: true });
            return res.json({ message: 'Removed from Wishlist', Product: product });
        } else {
            await User.findByIdAndUpdate(_id, { $push: { wishlist: proId } }, { new: true });
            return res.json({ message: 'Added to Wishlist', Product: product });
        }
    } catch (error) {
        console.error('Error adding/removing from wishlist:', error.message);
        throw new Error(error);
    }
});

//Rating the Product
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.getuser;
    const { star, proId, comments } = req.body;

    try {
        const product = await Product.findById(proId);

        let alreadyRating = product.ratings.find(rating => rating.postedby.toString() === _id.toString());

        if (alreadyRating) {
            // Update the existing rating
            const updateRating = await Product.updateOne(
                { "ratings._id": alreadyRating._id },
                {
                    $set: {
                        "ratings.$.star": star,
                        "ratings.$.comments": comments // Separate $set for each field
                    }
                },
                { new: true }
            );
            // Calculate the new total rating after updating
            const updatedProduct = await Product.findById(proId);
            let totalrating = updatedProduct.ratings.length;
            let ratingsum = updatedProduct.ratings.map(item => item.star).reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingsum / totalrating);
            // Update the product with the new total rating
            const finalProduct = await Product.findByIdAndUpdate(proId, { totalrating: actualRating }, { new: true });
            res.json({ message: "Rating Updated", Product: finalProduct });
        } else {
            // Add a new rating
            const newRating = {
                star: star,
                postedby: _id,
                comments: comments
            };
            product.ratings.push(newRating);
            await product.save();
            // Calculate the new total rating after adding a new rating
            const updatedProduct = await Product.findById(proId);
            let totalrating = updatedProduct.ratings.length;
            let ratingsum = updatedProduct.ratings.map(item => item.star).reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingsum / totalrating);
            // Update the product with the new total rating
            const finalProduct = await Product.findByIdAndUpdate(proId, { totalrating: actualRating }, { new: true });
            res.json({ message: "Rating Success", Product: finalProduct });
        }
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createProduct, getaProduct, getAllProduct, deleteaProduct, updateProduct, addToWishsList, rating};
