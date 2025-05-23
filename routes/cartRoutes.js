const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getCartItems, addtoCards } = require("../controllers/CartController");

router.post("/saveCart/:productID", addtoCards);
router.post("/getCartItems", getCartItems);

module.exports = router;
