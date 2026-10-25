const cartItemRepository = require("../Repositories/cartItemRepository");

exports.findByCartId = async (cartId) => {
  return await cartItemRepository.findByCartId(cartId);
};

exports.addCartItem = async (cartId, productId, sizeId, typeId, quantity) => {
  return await cartItemRepository.addCartItem(
    cartId,
    productId,
    sizeId,
    typeId,
    quantity,
  );
};

exports.updateCartItemQuantity = async (cartItemId, quantity) => {
  return await cartItemRepository.updateCartItemQuantity(cartItemId, quantity);
};

exports.deleteCartItem = async (cartItemId) => {
  return await cartItemRepository.deleteCartItem(cartItemId);
};
