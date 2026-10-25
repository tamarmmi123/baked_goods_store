
const orderService = require("../Services/orderService");

const handleError = (res, error, fallback) => {
  console.error(error);

  return res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : fallback,
  });
};

exports.getMyOrders = async (req, res) => {
  try {
    const result = await orderService.getMyOrders(
      req.user.id,
      req.query,
    );

    return res.json(result);
  } catch (error) {
    return handleError(res, error, "Unable to retrieve your orders.");
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    return res.json(result);
  } catch (error) {
    return handleError(res, error, "Unable to retrieve orders.");
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await orderService.getOrderDetails(
      req.params.orderId,
    );

    return res.json(order);
  } catch (error) {
    return handleError(res, error, "Unable to retrieve order.");
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "string") {
      return res.status(400).json({
        error: "A new order status is required.",
      });
    }

    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      status,
    );

    return res.json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return handleError(res, error, "Unable to update order status.");
  }
};
