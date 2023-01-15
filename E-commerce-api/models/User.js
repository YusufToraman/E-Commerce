const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { Console } = require('console');
const Product = require('./Product');

const UserSchema = new Schema({

    email: {
        type: String,
        required: [true,"Mail adresi girmek zorunludur"],
        //unique özelliği bir mailin sadece bir hesapta kullanılabilmesini sağlayacak
        unique: true,          
        //regex ==> regular expressions (mail adresi kodu gibi bazı şeyleri içermezse mail adresi kapsamına girmez onu tanımlıyoruz)
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Doğru bir mail adresi giriniz']
    },

    name: {
        type: String,
        formOfName: [true, 'Sadece harf (a-z) ve kısa çizgi (-) kullanın'],
        required: [true, 'İsim girmek zorunludur']
    },
    //yemeksepeti için sorulmayacak default user zaten tersi belirtilirse ...
    role:{
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },

    password: {
        type: String,
        minLength: [6, 'Şifreniz en az 6 karakterden oluşmalı'],
        required: true,
        select: false   //Yazarken göster seçilmezse hashli gözükür (gözükmez).
    },
    
    phoneNumber: {
        type: String,
        reguired: [true, 'Telefon numarası alanı boş bırakılamaz'],
        length: [10, 'Bu telefon numarası eksik ya da hatalı görünüyor. Lütfen tekrar deneyin.']
    },
    //Birthday yapcam ama format kısmı nasıl olacak. Seçerek doldurma, noktayla veya slashla yazmak?

    profile_image: {
        type: String,
        default: "default.jpg"
    },

    blocked: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpire: {
        type: Date
    },

    place: {
        type: String
    }
});

// UserSchema methods
UserSchema.methods.generateJwtFromUser = function(){
    
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        id: this._id,
        name: this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });
    return token
}

UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
    
    return resetPasswordToken
}

// Hash password with bcryptjs lib
UserSchema.pre('save', function(next){
    // Parola değişme
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);

        bcrypt.hash(this.password, salt, (err, hash) =>{

            if(err) next(err);
            this.password = hash;
            next();
        })
    }) 
});

UserSchema.post("remove", async function(){

    await Product.deleteMany({
        user: this._id
    });
    
});

module.exports = mongoose.model("User", UserSchema);            //Collection Name: User     ==>     MongoDb