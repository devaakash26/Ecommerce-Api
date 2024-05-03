const asyncHandler = require('express-async-handler');
const Color = require('../models/Color-Model');

//Add a Color
const AddColor = asyncHandler(async (req, res) => {
    try {
        const add = await Color.create(req.body);
        res.json(add);
    }
    catch (error) {
        throw new Error(error);
    }
})

//Update a Color

const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const update = await Color.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json({ message: "Updated Successfull", Color: update });
    } catch (error) {
        throw new Error(error);

    }
})

//Get a Color

const getColor = asyncHandler(async (req, res) => {
    try {
        const get = await Color.find();
        res.json({ Color: get });
    } catch (error) {
        throw new Error(error);

    }
})

//Get a Single Color

const getSingleColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const get = await Color.findById(id);
        res.json({ Color: get });
    } catch (error) {
        throw new Error(error);

    }
})

//Deleted a Color

const DeletedColor = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const dlt= await Color.findByIdAndDelete(id);
        res.json({message:"deleted successfull"})
    } catch (error) {
        
    }
})



module.exports = {AddColor,updateColor,getColor,getSingleColor,DeletedColor}