const express = require("express");
const router = express.Router();
const food = require("./food")


const {getAccessToRoute, getProductOwnerAccess} = require("../middlewares/authorization/auth");

const productQueryMiddleware = require("../middlewares/query/productQueryMiddleware");

const foodQueryMiddleware = require("../middlewares/query/foodQueryMiddleware");

const {checkProductExist} = require("../middlewares/database/databaseErrorHelpers");

const Product = require("../models/Product");

const {
    addNewProducts, 
    getAllProducts, 
    getSingleProduct, 
    editProduct,
    deleteProduct,
    createProductReview,
    undoReview
} = require("../controllers/product");

router.get("/", productQueryMiddleware(Product, {
    population: {
        path: "user",
        select: "name profile_image"
    }
}), getAllProducts);

router.post("/add", getAccessToRoute, addNewProducts);
router.get("/:id", checkProductExist, foodQueryMiddleware(Product, {
    population: [
        {
            path: "user",
            select: "name profile_image"
        },

        {
            path: "foods",
            select: "name"
        }
    ]

}), getSingleProduct);
router.put("/:id/edit", [getAccessToRoute, checkProductExist, getProductOwnerAccess], editProduct);
router.delete("/:id/delete", [getAccessToRoute, checkProductExist, getProductOwnerAccess], deleteProduct);
router.post("/:id/review", [getAccessToRoute, checkProductExist], createProductReview);
router.get("/:id/undo_review", [getAccessToRoute, checkProductExist], undoReview)

// Food Module
router.use("/:product_id/foods", checkProductExist, food) 

module.exports = router;