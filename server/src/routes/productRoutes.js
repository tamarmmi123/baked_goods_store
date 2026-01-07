const express = require("express");
const router = express.Router();

const productController = require("../Controllers/productController");

const auth = require("../middlewares/auth");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/", auth, productController.createProduct);
router.put("/:id", auth, productController.updateProduct);
router.delete("/:id", auth, productController.deleteProduct)

module.exports = router;