const express = require("express");
const router = express.Router();
const cartItemController = require("../Controllers/cartItemController");

router.get("/:cartId/items", cartItemController.getItemsByCartId);
router.post("/:cartId/items", cartItemController.addItemToCart);
router.put("/items/:id", cartItemController.updateItemQuantity);
router.delete("/items/:id", cartItemController.removeItemFromCart);

module.exports = router;