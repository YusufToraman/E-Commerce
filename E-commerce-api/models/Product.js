const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;


const ReviewSchema = new Schema(
    {
        rating: { 
            type: Number,
            required: [true, "1 ile 5 arasında bir puanlama yapmak şarttır"],
        },

        comment: { 
            type: String,
            minlength: [3, "Yorumunuz yeterli uzunlukta değil"],
        },

        user: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User',
        }
    });

const ProductSchema = new Schema({

    title: {
        type: String,
        required: [true, "Lütfen ürün ismini giriniz"],
        minlength: [3, "Ürün ismi en az 3 harften oluşmak zorundadır"],
        unique: [true, "Bu restoran ismi daha önce alınmış"]
    },

    content: {
        type: String,
        required: [true, "Lütfen ürünün içeriğini giriniz"],
        minlength: [5, "Ürün içeriği en az 5 harften olumak zorundadır"]
    },

    slug: String,

    createdAt: {
        type: Date,
        default: Date.now()
    },

    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },

    reviews: [ReviewSchema],

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },

    foods: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Food"
        }
    ],
    
    foodCount: {
        type: Number,
        default: 0
    }

});


ProductSchema.pre("save", function(next){
    
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug()
    next();
})

ProductSchema.methods.makeSlug = function() {

    return slugify(this.title, {
        replacement: '-',
    //Remove for Regex (!, /)
        remove: /[*+~.()'"!:@]/g,
        lower: true
    });
}

module.exports = mongoose.model("Product", ProductSchema); 