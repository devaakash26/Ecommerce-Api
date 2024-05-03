const express = require("express");
const { createBlog, updateaBlog, deleteaBlog, getaBlog, getallBlog, likesBlog, dislikeBlog} = require("../controller/blogCtrl");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middleware/UploadImg");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages);

router.put('/likeaBlog', authMiddleware, likesBlog)
router.put('/dislikeaBlog', authMiddleware, dislikeBlog)

router.get('/getSingleBlog/:id', authMiddleware, getaBlog)
router.get('/getAllBlog', authMiddleware, getallBlog)

router.put('/update/:id', authMiddleware, isAdmin, updateaBlog)
router.delete('/delete/:id', authMiddleware, isAdmin, deleteImages)

router.delete('/delete/:id', authMiddleware, isAdmin, deleteaBlog)

module.exports = router;