const productService = require("../Services/productService");

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
};

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
    const {
      productname,
      category,
      kashrut,
      specialrequirements,
      occasions,
      sizes,
      types,
    } = req.body;

    if (!productname || !category) {
      return res
        .status(400)
        .json({ error: "productname and category are required" });
    }

    if (sizes && !Array.isArray(sizes)) {
      return res.status(400).json({ error: "sizes must be an array" });
    }

    if (types && !Array.isArray(types)) {
      return res.status(400).json({ error: "types must be an array" });
    }

    const product = await productService.createProduct({
      productname,
      category,
      kashrut,
      specialrequirements,
      occasions,
      sizes,
      types,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;

    if (data.sizes && !Array.isArray(data.sizes)) {
      return res.status(400).json({ error: "Sizes must be an array" });
    }

    if (data.types && !Array.isArray(data.types)) {
      return res.status(400).json({ error: "types must be an array" });
    }

    const product = await productService.updateProduct(req.params.id, data);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.status(200).json({
      message: "Product deactivated successfully",
      product,
    });
  } catch (err) {
    const status = err.message === "Product not found" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};
