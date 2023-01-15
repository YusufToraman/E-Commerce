const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Product = require("../../models/Product");


const getAccessToRoute = (req,res,next) =>{
    // Token
    const {JWT_SECRET_KEY} = process.env;

    if(!isTokenIncluded(req)){
        // 401 ==> Unauthorized
        // 403 ==> Forbidden
        return next(new CustomError("You are not authorized to access this route", 401));
    };
    
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if(err) {
            return next(new CustomError("You are not authorized to access this route", 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        };
        next();
    });
}

const getAdminAccess = asyncErrorWrapper(async(req,res,next) =>{

    const {id} = req.user;

    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError("Sadece adminler erişebilir", 403));
    }
    
    next();

});

const getProductOwnerAccess = asyncErrorWrapper(async(req,res,next) =>{

    const userId = req.user.id;

    const productId = req.params.product_id || req.params.id;

    const product = await Product.findById(productId);

    if(userId != product.user){
       return next(new CustomError("Sadece ürünün sahibi bu alana ulaşabilir", 403));
    }

    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getProductOwnerAccess
};