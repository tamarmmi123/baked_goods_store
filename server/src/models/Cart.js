class Cart {
  constructor({ id, user_id, status, items = [], created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.status = status;
    this.items = items;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Cart;