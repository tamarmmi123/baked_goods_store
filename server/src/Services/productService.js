const productRepository = require("../Repositories/productRepository");

exports.getAllProducts = async () => {
  return productRepository.findAll();
};

exports.getInStockProducts = async () => {
  return productRepository.findInStock();
}

exports.getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

exports.createProduct = async (productname, description, qty, price, imageUrl, kashrut, specialRequirements, occasions) => {
  return await productRepository.createProduct(productname, description, qty, price, imageUrl, kashrut, specialRequirements, occasions);
}

exports.updateProduct = async (id, data) => {
  const existing = await productRepository.findById(id);
  if (!existing) throw new Error("Product not found");

  return productRepository.updateProduct(
    id, data.productname ?? existing.productname, data.description ?? existing.description, data.qty ?? existing.qty, data.price ?? existing.price, data.imageUrl ?? existing.imageUrl, data.kashrut ?? existing.kashrut, data.specialRequirements ?? existing.specialRequirements, data.occasions ?? existing.occasions
  );
};


exports.deleteProduct = async (id) => {
  return await productRepository.deleteProduct(id);
}