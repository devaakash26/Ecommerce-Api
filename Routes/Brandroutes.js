const express= require('express');
const { AddBrand, updateBrand, getBrand, getSingleBrand, DeletedBrand } = require('../controller/brandCtrl');
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/',authMiddleware,isAdmin,AddBrand);
router.put('/update/:id',authMiddleware,isAdmin,updateBrand);
router.get('/get',authMiddleware,getBrand);
router.get('/get/:id',authMiddleware,getSingleBrand);
router.delete('/delete/:id',authMiddleware,isAdmin,DeletedBrand);






module.exports =router;