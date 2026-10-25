class Product {
  constructor({
    id,
    productname,
    qty = 0,
    kashrut = "parev",
    specialrequirements = [],
    occasions = [],
    category,
    is_active = true,
    types = [],
    sizes = [],
  }) {
    this.id = id;
    this.productname = productname;
    this.qty = qty;
    this.kashrut = kashrut;
    this.specialrequirements = specialrequirements;
    this.occasions = occasions;
    this.category = category;
    this.isActive = is_active;

    this.types = types;
    this.sizes = sizes;
  }
}

module.exports = Product;