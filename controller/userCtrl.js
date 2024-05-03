const { generateToken } = require("../config/jswebToken");
const User = require("../models/userModels");
const Product = require('../models/ProductModel')
// const Cart = require('../models/cart-Models')
const Cart = require('../models/cart-Model');
const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const { validMoongoseid } = require("../utils/ValidMoongoseid");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const { bcrypt } = require('bcrypt');
const Order = require("../models/Order-model")
const sendEmail = require("./Email");
const crypto = require("crypto");
const CouponModel = require("../models/CouponModel");
//Create a new user
const createuser = asyncHandler(async (req, res) => {
    const { email, mobile } = req.body;

    const usersWithSameMobile = await User.countDocuments({ mobile: mobile });

    if (usersWithSameMobile >= 5) {
        throw new Error("Maximum number of registrations reached for this mobile number");
    }

    const findUserByEmail = await User.findOne({ email: email });
    if (findUserByEmail) {
        throw new Error("User with this email already exists");
    }

    // Create the new user
    const newUser = await User.create(req.body);
    res.json(newUser);
});



//Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser?._id, { refreshToken: refreshToken }, { new: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }
    else {
        throw new Error("Invalid Credentials");
    }
})

//Handle Refresh Token

const handlerefreshtoken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh Token in Cokkies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    // res.json(user);
    if (!user) {
        throw new Error("No Refresh token present in DB");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    })

})

//logout the user

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findByIdAndUpdate(user._id, { refreshToken: "" });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.json({ "logout": "successfull" });
})


//get all user

const getallUser = asyncHandler(async (req, res) => {
    try {

        const getUser = await User.find();
        res.json(getUser);
    }
    catch (error) {
        throw new Error(error);
    }
})

//get a single User

const getsingleUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validMoongoseid(id);
        const user = await User.findById(id);

        res.json({ user });
    }
    catch (error) {
        throw new Error(error);
    }
})

//Delete a Single User
const deletesingleUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validMoongoseid(id);
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.json({ messgae: 'User Already Deleted' })
        }
        res.json({ message: "Deleted Successfull", User: user });
    }
    catch (error) {
        throw new Error(error);
    }
})

//Update a User Credentials
const updateUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.getuser;
    validMoongoseid(_id);

    try {
        console.log("Request body:", req.body);

        const newdata = await User.findByIdAndUpdate(_id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
        }, { new: true });

        res.json({
            message: "Updated successfully",
            success: true,
            updatedUser: newdata,
        });
    } catch (error) {
        next(error);
    }
});

//Blocked a User
const blockauser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMoongoseid(id);
    try {
        const blocked = await User.findByIdAndUpdate(id, { isBlocked: true });
        res.json({
            "message": "Blocked Successfully",
            "success": true
        })
    }
    catch (error) {
        throw new Error("Invalid token");
    }
})

//Unblocked a user
const unblockauser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMoongoseid(id);
    const unblocked = await User.findByIdAndUpdate(id, { isBlocked: false }, { next: true });
    res.json({
        "message": "UnBlocked Successfully",
        "success": true
    })
})

//update a Product
const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    validMoongoseid(id);
    const user = await User.findById(id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else {
        res.json(user);
    }

});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found with this email" });
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your Password. This link is valid till 10 min <a href='http://localhost:4000/api/user/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forget Password",
            html: resetURL
        };
        sendEmail(data);
        res.json({
            token: token,
            message: "Password reset link sent successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpired: { $gt: Date.now() },
    })
    if (!user) {
        throw new Error("Token Expired, please try with new Token");
    }
    try {
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        await user.save();
        res.json(user);
    } catch (error) {
        throw new Error({
            error: "Some Internal Error"
        })
    }
})

//get a Wishlist

const getAWishList = async (req, res) => {
    const { _id } = req.getuser;

    try {
        const user = await User.findById(_id).populate('wishlist');
        res.json(user);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
    }
};

//save user Address

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.getuser;
    validMoongoseid(_id);
    try {
        const user = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true
        })

        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
})


// Add to cart
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.getuser;
    // validateMongoDbId(_id);
    validMoongoseid(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        // check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            // Update the count if the product is already in the cart
            await Cart.findByIdAndUpdate(
                alreadyExistCart._id,
                { $inc: { count: 1 } },
                { new: true }
            );
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});


//Get a Cart

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.getuser;
    // validateMongoDbId(_id);
    validMoongoseid(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate(
            "products.product"
        );
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

// Empty a Cart

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.getuser;
    validMoongoseid(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndDelete({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

//Aplly a coupon

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.getuser;
    validMoongoseid(_id);
    const validCoupon = await CouponModel.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
        { orderby: user._id },
        { totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
});

// Create a Order

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.getuser;
    validMoongoseid(_id);
    try {
        if (!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmout = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount;
        } else {
            finalAmout = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmout,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
});

//Get a order

const getOrder = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});

// Get Order by id
const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMoongoseid(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });

//Update a Order Status
const upadteOrderStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;
    const { id } = req.params;
    validMoongoseid(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});
 

module.exports = { createuser, loginUserCtrl, getallUser, getsingleUser, deletesingleUser, updateUser, blockauser, unblockauser, handlerefreshtoken, logout, updatePassword, forgetPassword, resetPassword, getAWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrder, upadteOrderStatus,getOrderByUserId }; 