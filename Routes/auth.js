const express = require('express');
const { createuser, loginUserCtrl, getallUser, getsingleUser, deletesingleUser, updateUser, blockauser, unblockauser, handlerefreshtoken, logout, updatePassword, forgetPassword, resetPassword, getAWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrder, upadteOrderStatus, getOrderByUserId } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
router.post('/register', createuser);
router.post('/password/:id', updatePassword);
router.post('/forget-password', authMiddleware, forgetPassword);
router.put('/reset-password/:token', authMiddleware, resetPassword);
router.post('/user-cart', authMiddleware,userCart);
router.get('/get-cart', authMiddleware,getUserCart);

router.post('/login', loginUserCtrl);
router.get('/getalluser', getallUser);
router.put('/save-address', authMiddleware, saveAddress);

router.get('/getwishlist', authMiddleware, getAWishList);
router.get('/refresh', handlerefreshtoken);
router.get('/logout', logout);
router.delete('/empty-cart', authMiddleware,emptyCart);
router.put('/apply-coupon', authMiddleware,applyCoupon);
router.post('/create-order', authMiddleware,createOrder);
router.get('/get-order', authMiddleware,getOrder);
router.get('/get-order/:id', authMiddleware,getOrderByUserId);

router.put('/update-order/:id', authMiddleware,isAdmin,upadteOrderStatus);






router.get('/:id', authMiddleware, isAdmin, getsingleUser);
router.delete('/:id', deletesingleUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockauser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockauser);




module.exports = router; 