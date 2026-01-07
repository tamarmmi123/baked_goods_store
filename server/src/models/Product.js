class Product {
  constructor(id, productname, description, qty, price, imageUrl) {
    this.id = id;
    this.productname = productname;
    this.description = description;
    this.qty = qty;
    this.price = price;
    this.imageUrl = imageUrl;
  }
}

module.exports = Product;