const asyncHandler = require("express-async-handler")
const Enquire = require("../models/enqModel")
const validMongooseId = require("../utils/ValidMoongoseid");

const createEnquire = asyncHandler(async (req, res) => {
    try {
        const newEnq = await Enquire.create(req.body);
        res.json(newEnq);
    } catch (error) {
        throw new Error(error);
    }
})

const updateEnquire = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateEnquire = await Enquire.findByIdAndUpdate(id, {
            new: true,
        })
        res.json(updateEnquire);
    } catch (error) {
        throw new Error(error);

    }
})

const getEnquire= asyncHandler(async (req,res)=>{
    try{
        const getenquire= await Enquire.find();
        res.json(getenquire);
    }
    catch(error)
    {
        throw new Error(error);

    }
})

const getEnquireById= asyncHandler(async (req,res)=>{
    const {id}= req.params;
    try {
        const get= await Enquire.findById(id);
        res.json(get);
    } catch (error) {
        throw new Error(error);
        
    }
})

const deleteEnquire= asyncHandler(async (req,res)=>{
    const {id}= req.params;
    try {
        const dltenq= await Enquire.findByIdAndDelete(id);
        res.json(dltenq);
    } catch (error) {
        
    }
})



module.exports = { createEnquire,updateEnquire,getEnquire,getEnquireById,deleteEnquire }