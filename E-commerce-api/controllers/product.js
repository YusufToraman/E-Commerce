const Product = require("../models/Product");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewProducts = asyncErrorWrapper(async(req,res,next) => {

    const information = req.body;

    const product = await Product.create({
        ...information,
        user: req.user.id
    });

    res.status(200).json({
        success:true,
        data: product
    });
    console.log("Food count ", product.foodCount)
});

const getAllProducts = asyncErrorWrapper(async(req,res,next) => {
    
    return res.status(200)
    .json(res.queryResults)
});

const getSingleProduct = asyncErrorWrapper(async(req,res,next) => {

    return res.status(200)
    .json(res.queryResults);

});


const editProduct = asyncErrorWrapper(async(req,res,next) => {

    const {id} = req.params;

    const {title, content, price} = req.body;

    let product = await Product.findById(id);

    product.title = title;
    product.price = price;
    product.content = content;

    product = await product.save();

    return res.status(200)
    .json({
        success: true,
        data: product
    });
});


const deleteProduct = asyncErrorWrapper(async(req,res,next) => {

    const {id} = req.params;

    await Product.findByIdAndDelete(id);

    res.status(200)
    .json({
        success:true,
        message: "Ürün silindi"
    });

});

const createProductReview = asyncErrorWrapper(async(req,res,next) => {

    const {rating, comment} = req.body;

    const {id} = req.params;

    const product = await Product.findById(id);

    for(let i = 0; i < product.reviews.length; i++){

        if(product.reviews[i].user == req.user.id){
            return next(new CustomError("Bu siparişi önceden puanladınız"), 400);
        }
    }

    if(rating < 1 || rating > 5){
        return next(new CustomError("Puanlama 1 ve 5 arasında yapılmalıdır", 400));
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user.id,
    }


    product.reviews.push(review);

    product.numReviews = product.reviews.length

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

    product.rating

    await product.save();

    return res.status(200)
    .json({
        success: true,
        message: "Ürün puanlandı",
        data: product
    });

})

const undoReview = asyncErrorWrapper(async(req,res,next) => {

    const {id} = req.params;

    const product = await Product.findById(id);

    var found = false;
    for(let i = 0; i < product.reviews.length; i++){

        if(product.reviews[i].user == req.user.id){
            found = true;
        }

        if(!found && i === product.reviews.length - 1){
            return next(new CustomError("Bu ürünü daha önce puanlamadınız", 400));
        }
    }

    let finished = false;
    for(let i = 0; i < product.reviews.length && !finished; i++){

        if(product.reviews[i].user == req.user.id){

            finished = true;

            const index = i

            product.reviews.splice(index, 1);

            product.numReviews--;

            product.rating =  product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;
        }
    }

    await product.save();

    return res.status(200)
    .json({
        success: true,
        data: product
    });
});


module.exports = {
    addNewProducts,
    getAllProducts,
    getSingleProduct,
    editProduct,
    deleteProduct,
    createProductReview,
    undoReview
};