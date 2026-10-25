const cartRepository = require("../Repositories/cartRepository");
const cartItemRepository = require("../Repositories/cartItemRepository");

exports.getOrCreateCartForUser = async (userId) => {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) cart = await cartRepository.createCart(userId);

    cart.items = await cartItemRepository.findByCartId(cart.id);
    return cart;
};

exports.addItemToCart = async ({ userId, productId, sizeId, typeId, quantity }) => {
    const cart = await exports.getOrCreateCartForUser(userId);

    const existingItem = cart.items.find(
        (item) =>
            item.product_id === productId &&
            item.size_id === sizeId &&
            item.type_id === typeId
    );

    if (existingItem) {
        await cartItemRepository.updateCartItemQuantity(
            existingItem.id,
            existingItem.quantity + quantity
        );
    } else {
        await cartItemRepository.addCartItem(cart.id, productId, sizeId, quantity, typeId);
    }

    cart.items = await cartItemRepository.findByCartId(cart.id);
    return cart;
};
