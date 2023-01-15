const mongoose = require("mongoose");
const Product = require("./Product");

const Schema = mongoose.Schema;

const FoodSchema = new Schema({

    name: {
        type: String,
        required: [true, "Yemek bir isime sahip olmalı"],
        unique: [true, "Restoranınızda bu isme sahip bir ürün var"]
    },

    ingredients: {
        type: String,
        required: [true, "Lütfen yemeğin içeriğini giriniz"],
        minlength: [5, "Yemek içeriği en az 5 karakterden oluşmalı"]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    price: {
        type: Number,
        required: [true, "Ürün fiyatı girilmesi zorunludur"]
    },

    amount: {
        type: Number,
        default: 1,
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
    }
});


FoodSchema.pre("save", async function(next){

    if(!this.isModified("user")){
        return next();
    }

    try{
        const product = await Product.findById(this.product);

        product.foods.push(this._id);
        product.foodCount = product.foods.length;
        
        console.log("Buraya girdim Ben ", product.foods)
        await product.save();
        
        next();
    }
    catch(err){
        return next(err);
    }

})


module.exports = mongoose.model("Food", FoodSchema);