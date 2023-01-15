const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Product = require("../../models/Product");
const Food = require("../../models/Food");

const checkUserExist = asyncErrorWrapper(async(req,res,next) => {
    
    const {id} = req.params;
    
    const user = await User.findById(id);

    if(!user){
        return next(new CustomError("Bu ID'ye ait bir kullanıcı bulunamadı", 400));
    }
    req.data = user;
    next();
});

const checkProductExist = asyncErrorWrapper(async(req,res,next) => {

    const product_id = req.params.id || req.params.product_id;
    
    const product = await Product.findById(product_id);

    if(!product){
        return next(new CustomError("Bu ID'ye ait bir ürün bulunamadı", 400));
    }
    
    req.data = product;
    next();
});


const checkProductAndFoodExist = asyncErrorWrapper(async(req,res,next) => {

    const {food_id} = req.params;
    const {product_id} = req.params;

    const food = await Food.findOne({
        _id: food_id,
        product: product_id
    });

    if(!food){
        return next(new CustomError("Bu restoranda bu ID'ye ait bir yemek bulunamadı", 400));
    }

    next();

})

module.exports = {
    checkUserExist,
    checkProductExist,
    checkProductAndFoodExist
}