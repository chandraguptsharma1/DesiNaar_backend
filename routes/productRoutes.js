// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const productController = require("../controllers/productController"); // ✅ Import correctly

const multer = require("multer");

// 🔹 Configure Multer for multiple file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images", 6); // ✅ Correct usage

// 🔹 Route for product upload with multiple images
router.post("/upload", upload, productController.uploadProduct);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
