const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getCartItems,
  addtoCards,
} = require("../controllers/productController");

router.post("/saveCart", addtoCards);
router.post("/getCartItems", getCartItems);

module.exports = router;
