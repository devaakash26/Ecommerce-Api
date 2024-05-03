const Blog = require("../models/BlogModel")
const User = require("../models/userModels")
const asyncHandler = require('express-async-handler');
const { validMoongoseid } = require("../utils/ValidMoongoseid");
const fs = require('fs')
const cloudinary = require('../utils/cloudniary');


//Create a Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    } catch (error) {
        throw new Error(error);
    }
})

//Updat a Blog
const updateaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // validMongoDbId(id);

    try {
        const user = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(user);
    } catch (error) {
        throw new Error("There is something wrong to update a Blog");
    }
})

//Get A Blog
const getaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getaBlog = await Blog.findById(id)
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { views: 1 },
            },
            {
                new: true,
            }
        );

        res.json(getaBlog);
    } catch (error) {
        throw new Error("Something went wrong while fetching the blog.");
    }
});


//Get A All Blog
const getallBlog = asyncHandler(async (req, res) => {
    // const {id}=req.params;
    try {
        const user = await Blog.find();
        res.json(user);
    } catch (error) {
        throw new Error("Some thing wrong to get a blog");
    }
})

//Delete a Blog

const deleteaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // validMongoDbId(id);
    try {
        const user = await Blog.findOneAndDelete(id);
        if (!user) {
            throw new Error("Blog is None");
        }
        res.json({
            message: "Success",
            blog: user,
        })
    } catch (error) {
        throw new Error("Something Went wrong to delete a Blog")
    }
})

//Liked a blog

const likesBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Missing blog ID" });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const loginUser = await User.findOne(req?.user?._id);
        if (!loginUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyDisliked = blog.dislikes.some((userId) => userId.toString() === loginUser._id.toString());
        if (isAlreadyDisliked) {
            await Blog.findByIdAndUpdate(id, {
                $pull: { dislikes: loginUser._id },
                $inc: { dislikecount: -1 }
            }, { new: true });
        }

        if (blog.isLiked) {
            await Blog.findByIdAndUpdate(id, {
                $pull: { likes: loginUser._id },
                $inc: { likecount: -1 },
            }, { new: true });
        }

        // Toggle like
        await Blog.findByIdAndUpdate(id, {
            $addToSet: { likes: loginUser._id },
            $inc: { likecount: 1 }
        }, { new: true });

        res.json({ message: "Blog liked successfully", blog: blog });
    } catch (error) {
        console.error("Error in likesBlog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//disliked a blog

const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const loginUser = await User.findOne(req?.user?.id);
        if (!loginUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyLiked = blog.likes.some(userId => userId.toString() === loginUser._id.toString());
        if (isAlreadyLiked) {
            await Blog.findByIdAndUpdate(id, {
                $pull: { likes: loginUser._id },
                $inc: { likecount: -1 }
            }, { new: true });
            return res.json({ message: "Disliked successfully", blog: blog });
        }

        if (blog.isDisliked) {
            await Blog.findByIdAndUpdate(id, {
                $pull: { dislikes: loginUser._id },
                $inc: { dislikecount: -1 }
            }, { new: true });
            return res.json({ message: "Disliked successfully", blog: blog });
        }

        // If neither liked nor disliked, toggle dislike
        await Blog.findByIdAndUpdate(id, {
            $addToSet: { dislikes: loginUser._id },
            $inc: { dislikecount: 1 }
        }, { new: true });
        res.json({ message: "Blog disliked successfully", blog: blog });
    } catch (error) {
        console.error("Error in dislikeBlog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = { createBlog, updateaBlog, deleteaBlog, getaBlog, getallBlog, likesBlog, dislikeBlog };