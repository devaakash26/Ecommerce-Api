const express= require('express')
const router= express.Router();
const {isAdmin, authMiddleware}= require('../middleware/authMiddleware');
const { createcoupon, updateCoupon, GetAllCoupon, GetSingleCoupon, DeleteCoupon } = require('../controller/couponCtrl');

router.post('/',authMiddleware,isAdmin, createcoupon);
router.put('/update/:id',authMiddleware,isAdmin, updateCoupon);
router.get('/get',authMiddleware,isAdmin, GetAllCoupon);
router.get('/get/:id',authMiddleware,isAdmin, GetSingleCoupon);
router.delete('/delete/:id',authMiddleware,isAdmin, DeleteCoupon);






module.exports =router;