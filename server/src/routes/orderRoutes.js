
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");
const orderController = require("../Controllers/orderController");

// Customer
router.get("/mine", auth, orderController.getMyOrders);

// Admin
router.get(
  "/admin",
  auth,
  requireAdmin,
  orderController.getAllOrders,
);

router.get(
  "/admin/production-summary",
  auth,
  requireAdmin,
  orderController.getPendingProductionSummary
);

router.get(
  "/admin/:orderId",
  auth,
  requireAdmin,
  orderController.getOrderDetails,
);

router.patch(
  "/admin/:orderId/status",
  auth,
  requireAdmin,
  orderController.updateOrderStatus,
);

module.exports = router;
