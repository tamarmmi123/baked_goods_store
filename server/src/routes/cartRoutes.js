const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");

router.get("/:userId", cartController.getCart);
router.post("/", cartController.createCart);
router.put("/:cartId", cartController.updateCart);
router.get("/find/:userId", cartController.findCartByUserId);
router.post("/add-item", cartController.addItem);

module.exports = router;
