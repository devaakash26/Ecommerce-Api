const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');

//Add a Brand
const AddBrand = asyncHandler(async (req, res) => {
    try {
        const add = await Brand.create(req.body);
        res.json(add);
    }
    catch (error) {
        throw new Error(error);
    }
})

//Update a BRAND

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const update = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json({ message: "Updated Successfull", Brand: update });
    } catch (error) {
        throw new Error(error);

    }
})

//Get a Brand

const getBrand = asyncHandler(async (req, res) => {
    try {
        const get = await Brand.find();
        res.json({ Brand: get });
    } catch (error) {
        throw new Error(error);

    }
})

//Get a Single Brand

const getSingleBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const get = await Brand.findById(id);
        res.json({ Brand: get });
    } catch (error) {
        throw new Error(error);

    }
})

//Deleted a Brand

const DeletedBrand = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const dlt= await Brand.findByIdAndDelete(id);
        res.json({message:"deleted successfull"})
    } catch (error) {
        
    }
})



module.exports = {AddBrand,updateBrand,getBrand,getSingleBrand,DeletedBrand}