const User = require("../models/userModels");;
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const getuser = await User.findById(decoded?.id);
                req.getuser = getuser;
                next();
            }
        }
        catch (error) {
            throw new Error("Not Authorized token expired, Please login Again");
        }
    }
    else {
        throw new Error("There is no token attached to header");
    }
});
const isAdmin= asyncHandler(async (req,res,next)=>{
    const {email}=req.getuser;
    const adminUser=await User.findOne({email});
    if(adminUser.role !== "admin")
    {
        throw new Error("You are not a admin");
    }
    else{
        next();
    }
})
module.exports = { authMiddleware, isAdmin };
