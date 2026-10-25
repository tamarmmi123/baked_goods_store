const cartService = require("../Services/cartService");

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await cartService.getOrCreateCartForUser(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const cart = await cartService.getOrCreateCartForUser(userId);
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const updatedData = req.body;
    const cart = await cartService.updateCart(cartId, updatedData);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await cartService.getOrCreateCartForUser(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { product_id, size_id, type_id, quantity } = req.body;
    const userId = req.user.id;

    const cart = await cartService.addItemToCart({
      userId,
      productId: product_id,
      sizeId: size_id,
      typeId: type_id,
      quantity,
    });

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};