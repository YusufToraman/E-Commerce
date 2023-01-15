const express = require('express');
//  /api
const router = express.Router();

const auth = require('./auth');     //auth file
const user = require('./user');
const admin = require("./admin");
const product = require("./product");


router.use('/auth', auth);
router.use("/users", user)
router.use("/admin", admin)
router.use("/products", product);

 
module.exports = router;