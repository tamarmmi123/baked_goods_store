class CartItem {
  constructor({ id, cart_id, product_id, size_id, type_id, quantity, created_at, updated_at }) {
    this.id = id;
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.size_id = size_id;
    this.type_id = type_id;
    this.quantity = quantity;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = CartItem;