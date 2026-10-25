
const checkoutService = require("../Services/checkoutService");

exports.checkout = async (req, res) => {
  try {
    const order = await checkoutService.checkout(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return res.status(error.statusCode || 500).json({
      error:
        error.statusCode
          ? error.message
          : "Unable to complete checkout.",
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await checkoutService.getOrder(
      req.params.orderId,
      req.user.id
    );

    return res.json(order);
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.message || "Unable to retrieve order.",
    });
  }
};