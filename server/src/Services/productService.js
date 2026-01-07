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

exports.createProduct = async (productname, description, qty, price, imageUrl) => {
  return await productRepository.createProduct(productname, description, qty, price, imageUrl);
}

exports.updateProduct = async (id, productname, description, qty, price, imageUrl) => {
  return await productRepository.updateProduct(id, productname, description, qty, price, imageUrl);
}

exports.deleteProduct = async (id) => {
  return await productRepository.deleteProduct(id);
}