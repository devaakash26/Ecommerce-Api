const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { createBlogCategory, updateBlogCategory, GetBlogCategory, GetSBlogCategory, dleteBlogCategory } = require('../controller/bcategoryCtrl');
const router = express.Router();

router.post('/',authMiddleware,isAdmin, createBlogCategory);
router.put('/update/:id',authMiddleware,isAdmin, updateBlogCategory);
router.get('/get',authMiddleware,isAdmin, GetBlogCategory );
router.get('/get/:id',authMiddleware,isAdmin,GetSBlogCategory );
router.delete('/delete/:id',authMiddleware,isAdmin,dleteBlogCategory );



module.exports =router;
