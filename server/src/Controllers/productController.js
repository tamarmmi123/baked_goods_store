const productService = require('../Services/productService');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

exports.getInStockProducts = async (req, res) => {
    try {
        const products = await productService.getInStockProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { productname, description, qty, price, imageUrl } = req.body;
    const product = await productService.createProduct(productname, description, qty, price, imageUrl);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productname, description, qty, price, imageUrl } = req.body;
    const product = await productService.updateProduct(req.params.id, productname, description, qty, price, imageUrl);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};