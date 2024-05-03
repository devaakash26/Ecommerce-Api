const express= require('express');
const { AddColor, updateColor, getColor, getSingleColor, DeletedColor } = require('../controller/color-Ctrl');
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/',authMiddleware,isAdmin,AddColor);
router.put('/update/:id',authMiddleware,isAdmin,updateColor);
router.get('/get',authMiddleware,getColor);
router.get('/get/:id',authMiddleware,getSingleColor);
router.delete('/delete/:id',authMiddleware,isAdmin,DeletedColor);






module.exports =router;