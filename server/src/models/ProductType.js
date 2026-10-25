class ProductType {
  constructor({
    id,
    product_id,
    type_label,
    image_url,
    description,
  }) {
    this.id = id;
    this.productId = product_id;
    this.typeLabel = type_label;
    this.imageUrl = image_url;
    this.description = description;
  }
}

module.exports = ProductType;
