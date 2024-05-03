const express = require("express");
const router = express.Router();
const {
    createProduct,
    getaProduct,
    getAllProduct,
    deleteaProduct,
    updateProduct,
    addToWishsList,
    rating,
    
} = require("../controller/productCtrl");

const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const { uploadPhoto, productImgResize } = require("../middleware/UploadImg");
const { deleteImages, uploadImages } = require("../controller/uploadCtrl");

router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.get('/:id', authMiddleware, isAdmin, getaProduct);
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages);

router.put('/wishlist', authMiddleware, addToWishsList);
router.put('/rating', authMiddleware, rating);
router.put('/update/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteaProduct);
router.get('/', authMiddleware, isAdmin, getAllProduct);

module.exports = router;
