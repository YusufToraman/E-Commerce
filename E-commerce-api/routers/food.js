const express = require("express");
const { getAccessToRoute, getProductOwnerAccess } = require("../middlewares/authorization/auth");

const {
    addNewFoodToProduct, 
    getAllFoodsByProduct,
    getSingleFoodByProduct,
    editFood,
    deleteFood
} = require("../controllers/food")

const { checkProductAndFoodExist } = require("../middlewares/database/databaseErrorHelpers");

const router = express.Router({mergeParams: true});

router.post("/", [getAccessToRoute, getProductOwnerAccess], addNewFoodToProduct);
router.get("/", [getAccessToRoute], getAllFoodsByProduct);
router.get("/:food_id", checkProductAndFoodExist, getSingleFoodByProduct);
router.put("/:food_id/edit", [checkProductAndFoodExist, getAccessToRoute, getProductOwnerAccess], editFood)
router.delete("/:food_id/delete", [checkProductAndFoodExist, getAccessToRoute, getProductOwnerAccess], deleteFood)

module.exports = router;