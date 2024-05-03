const asyncHandler = require('express-async-handler')
const Category = require('../models/PCategorymodel')
const User = require('../models/userModels');
const { validMoongoseid } = require('../utils/ValidMoongoseid');

//Create a New Category
const createcategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json(category);
    }
    catch (error) {
        throw new Error(error);
    }

})

//Uodate a Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error.message);
        throw new Error(error);
    }
})

//Delete a Category
const deleteCategory = asyncHandler(async (req,res)=>{
    const {id}= req.params;
    try {
        const dltCategory=  await Category.findByIdAndDelete(id);
        res.json({message:"success",ProductCateorgy: dltCategory});
    } catch (error) {
        throw new Error(error);
    }
})

//get a single category
const getSingleCategory = asyncHandler(async (req,res)=>{
    const {id}= req.params;
    try {
        const getCategory=  await Category.findById(id);
        res.json({ProductCategory: getCategory});
    } catch (error) {
        throw new Error(error);
    }
})

//get all category
const getCategory = asyncHandler(async (req,res)=>{
    try {
        const getCategory=  await Category.find();
        res.json({ProductCategory: getCategory});
    } catch (error) {
        throw new Error(error);
    }
})



module.exports = { createcategory, updateCategory, deleteCategory,getSingleCategory,getCategory }