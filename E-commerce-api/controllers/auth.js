const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers');
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req,res,next) =>{
    //POST DATA

    const {name,email,phoneNumber,password,role} = req.body;

    const user = await User.create({
        name,
        password,
        email,
        phoneNumber,
        role,
    }); 
    sendJwtToClient(user,res);
});

const login = asyncErrorWrapper(async(req,res,next) => {

    const {password, email} = req.body;

    if(!validateUserInput(email,password)){
        return next(new CustomError("Hatalı veya eksik giriş", 400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!comparePassword(password, user.password)){
        return next(new CustomError("Girdiğiniz şifre veya email hatalıdır"), 400);
    }
    sendJwtToClient(user,res);

});

const logout = asyncErrorWrapper(async(req,res,next) => {
    const {NODE_ENV} = process.env;

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false: true
    }).json({
        success: true,
        message: "Başarıyla çıkış yapıldı"
    });
});

const getUser = (req,res,next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
}; 

const imageUpload = asyncErrorWrapper(async(req,res,next) => {
    // Image Upload Success

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    },{
        new: true,
        runValidator: true
    });

    res.status(200)
    .json({
        success: true,
        message: "Resim başarıyla yüklendi",
        data: user
    })
})

// Forgot Password
const forgotPassword = asyncErrorWrapper(async(req,res,next) => {
    
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});

    if(!user) {
        return next(new CustomError("Bu mail adresine ait bir kullanıcı bulunamadı", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:3000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p> This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</a></p>
        `;

    try {
        await sendEmail({
            from: process.env.STMP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        }); 
        res.status(200).json({
            success: true,
            message: "Emaile token gönderildi"
        });
    }
    catch(err){
        console.log(err)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Mail gönderilemedi", 500));
    }
});

const resetPassword = asyncErrorWrapper(async(req,res,next) => {

    const {resetPasswordToken} = req.query;

    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Lütfen geçerli bir token girin", 400));
    }

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user) {
        return next(new CustomError("Kullanıcı tokeni bulunamadı", 404));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200)
    .json({
        success: true,
        message: "Şifreniz başarıyla değiştirildi"
    })
});

const editDetails = asyncErrorWrapper(async(req,res,next) =>{
    const editInformation = req.body; 

    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    });

    return res.status(200)
    .json({
        success: true,
        data: user
    });
    
});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};