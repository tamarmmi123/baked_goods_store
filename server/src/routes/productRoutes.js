const express = require("express");
const router = express.Router();

const productController = require("../Controllers/productController");

const auth = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/", auth, requireAdmin, productController.createProduct);
router.put("/:id", auth, requireAdmin, productController.updateProduct);
router.delete("/:id", auth, requireAdmin, productController.deleteProduct);

module.exports = router;