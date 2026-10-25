
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const checkoutController = require("../Controllers/checkoutController");

router.post("/", auth, checkoutController.checkout);
router.get("/:orderId", auth, checkoutController.getOrder);

module.exports = router;