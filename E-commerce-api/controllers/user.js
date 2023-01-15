const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");

const getSingleUser = asyncErrorWrapper(async(req,res,next) => {
    const user = req.data;

    return res.status(200)
    .json({
        succes: true,
        data: user
    });
});

const getAllUsers = asyncErrorWrapper(async(req,res,next) => {
    
    return res.status(200)
    .json(res.queryResults)
});

module.exports = {
    getSingleUser,
    getAllUsers
};