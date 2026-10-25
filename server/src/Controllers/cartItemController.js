const cartItemService = require("../Services/cartItemService");

exports.getItemsByCartId = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const items = await cartItemService.findByCartId(cartId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const cart_id = req.params.cartId;
    const { product_id, size_id, type_id, quantity } = req.body;

    if (
      !cart_id ||
      !product_id ||
      !size_id ||
      !type_id ||
      !quantity
    ) {
      return res.status(400).json({
        error: "Missing required cart item fields",
      });
    }

    const item = await cartItemService.addCartItem(
      cart_id,
      product_id,
      size_id,
      type_id,
      quantity
    );

    return res.status(201).json(item);
  } catch (err) {
    console.error("Error adding item to cart:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;
    const item = await cartItemService.updateCartItemQuantity(itemId, quantity);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    await cartItemService.deleteCartItem(itemId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
