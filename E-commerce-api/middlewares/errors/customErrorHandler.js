const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err,req,res,next) =>{
    let customError = err;

    if(customError.name === "CastError"){
        customError = new CustomError("ID Formatı Yanlış", 400)
    }
    if(customError.name === "SyntaxError"){
        customError = new CustomError("Unexpected Syntax", 400);
    }
    if(customError.name === "ValidationError"){
        customError = new CustomError(err.message, 400);
    }
    if(customError.code === 11000){
        customError = new CustomError("Bu mail adresi daha önce kullanılmış", 400);
    }
    res.status(customError.status || 500).json({
        success: false,
        message: customError.message
    });
};
module.exports = customErrorHandler;