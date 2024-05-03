const expressAsyncHandler = require('express-async-handler')
const BlogCategory = require('../models/BCategorymodel')

//create a new blog category
const createBlogCategory = expressAsyncHandler(async (req, res) => {
    try {
        const create = await BlogCategory.create(req.body);
        res.json(create);
    } catch (error) {
        throw new Error(error);
    }
})

//uodate a blog category
const updateBlogCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const create = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(create);
    } catch (error) {
        throw new Error(error);
    }
})

//get a blog category
const GetBlogCategory = expressAsyncHandler(async (req, res) => {
    try {
        const getBlogCategory = await BlogCategory.find();
        res.json({BlogCategory: getBlogCategory});
    } catch (error) {
        throw new Error(error);
    }
})
//get a blog category by there Id
const GetSBlogCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(getBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
})

//Delete a Blog category
const dleteBlogCategory = expressAsyncHandler(async (req,res)=>{
    const {id}= req.params;
    try {
        const deleteB= await BlogCategory.findByIdAndDelete(id);
        if(!deleteB)
        {
            res.json("The Blog Category You want to delete may it already deleted");
        }
        res.json({messgae:"success", BlogCategory:deleteB});

    } catch (error) {
        throw new Error(error);
    }
})


module.exports = { createBlogCategory, updateBlogCategory,GetBlogCategory,GetSBlogCategory,dleteBlogCategory }