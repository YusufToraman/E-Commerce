const Food = require("../models/Food");
const Product = require("../models/Product");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const addNewFoodToProduct = asyncErrorWrapper(async(req,res,next) => {

    const {product_id} = req.params;

    const user_id = req.user.id;

    const information = req.body;

    const food = await Food.create({

        ...information,
        product: product_id,
        user: user_id
    });

    return res.status(200)
    .json({
        success: true,
        data: food
    });

});


const getAllFoodsByProduct = asyncErrorWrapper(async(req,res,next) => {

    const {product_id} = req.params;

    const product = await Product.findById(product_id).populate("foods");

    const foods = product.foods;

    return res.status(200)
    .json({
        success: true,
        count: product.foods.length,
        data: foods
    });

});


const getSingleFoodByProduct = asyncErrorWrapper(async(req,res,next) => {

    const {food_id} = req.params;
    
    const food = await Food.findById(food_id)
    .populate({
        path: "product",
        select: "title"
    })
    .populate({
        path: "user",
        select: "name email" 
    });

    return res.status(200)
    .json({
        success: true,
        data: food
    });
});


const editFood = asyncErrorWrapper(async(req,res,next) => {
    const {food_id} = req.params;

    const information = req.body;

    let food = await Food.findById(food_id);

    food.price = information.price,
    food.name = information.name,
    food.ingredients = information.ingredients

    await food.save();

    return res.status(200)
    .json({
        success: true,
        data: food
    });

});


const deleteFood = asyncErrorWrapper(async(req,res,next) => {
    
    const {food_id} = req.params;

    const {product_id} = req.params;

    await Food.findByIdAndDelete(food_id);

    const product = await Product.findById(product_id);

    product.foods.splice(product.foods.indexOf(food_id), 1);

    product.foodCount = product.foods.length;

    await product.save();

    return res.status(200)
    .json({
        success: true,
        message: "Yemek silme işlemi başarılı"
    });
});


module.exports = {
    addNewFoodToProduct,
    getAllFoodsByProduct,
    getSingleFoodByProduct,
    editFood,
    deleteFood
};