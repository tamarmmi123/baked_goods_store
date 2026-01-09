class Product {
  constructor({
    id,
    productname,
    description,
    price,
    imageUrl,
    qty = Number.MAX_SAFE_INTEGER,
    kashrut = "parav",
    specialRequirements = [],
    occasions = [],
  }) {
    this.id = id;
    this.productname = productname;
    this.description = description;
    this.price = price; 
    this.imageUrl = imageUrl;
    this.qty = qty;
    this.kashrut = kashrut;
    this.specialRequirements = specialRequirements;
    this.occasions = occasions;
  }
}

module.exports = Product;
