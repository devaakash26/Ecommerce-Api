const express = require("express");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const { createcategory, updateCategory, deleteCategory,getSingleCategory,getCategory } = require("../controller/pcategoryCtrl");
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createcategory);
router.put('/update/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/get', authMiddleware, isAdmin, getCategory);
router.get('/getPsingle/:id', authMiddleware, isAdmin, getSingleCategory);




module.exports = router;