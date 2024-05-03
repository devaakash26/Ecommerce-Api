const asyncHandler = require('express-async-handler')
const Coupon = require('../models/CouponModel')

//Create a coupon
const createcoupon = asyncHandler(async (req, res) => {
    try {
        const add = await Coupon.create(req.body);
        res.json(add);
    } catch (error) {
        throw new Error(error);
    }
})

//Update a Coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const update = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Updated", Coupon: update });

    } catch (error) {
        throw new Error(error);
    }
})

//Get all coupon
const GetAllCoupon = asyncHandler(async (req, res) => {
    try {
        const get = await Coupon.find();
        res.json(get);
    } catch (error) {
        throw new Error(error);
    }

})

//Get a Single Coupon
const GetSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        const get = await Coupon.findOne(id);
        res.json(get);
    } catch (error) {
        throw new Error(error);
    }

})

//Delete a Coupon

const DeleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const dlt = await Coupon.findByIdAndDelete(id);
        console.log(dlt);
        res.json({Deleted: dlt});
    } catch (error) {
        throw new Error(error);
    }

})
module.exports = { createcoupon, updateCoupon, GetAllCoupon, GetSingleCoupon, DeleteCoupon }