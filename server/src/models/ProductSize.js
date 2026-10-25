class ProductSize {
  constructor({ id, productId, label, price, qty }) {
    this.id = id;
    this.productId = productId;
    this.label = label;
    this.price = price;
    this.qty = qty;
  }
}

module.exports = ProductSize;