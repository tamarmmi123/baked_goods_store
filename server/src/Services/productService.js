const productRepository = require("../Repositories/productRepository");
const productSizeRepository = require("../Repositories/productSizesRepository");
const productTypeRepository = require("../Repositories/productTypeRepository");

exports.getAllProducts = async () => {
  return productRepository.findAll();
};

exports.getInStockProducts = async () => {
  return productRepository.findInStock();
};

exports.getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");

  product.sizes = await productSizeRepository.findByProductId(id);
  product.types = await productTypeRepository.findByProductId(id);

  return product;
};

exports.createProduct = async ({
  productname,
  category,
  kashrut,
  specialrequirements,
  occasions,
  sizes = [],
  types = [],
}) => {
  const product = await productRepository.createProduct({
    productname,
    category,
    kashrut,
    specialrequirements,
    occasions,
  });

  for (const size of sizes) {
    await productSizeRepository.createSize(
      product.id,
      size.label,
      size.price,
      size.qty,
    );
  }

  for (const type of types) {
    await productTypeRepository.createType(
      product.id,
      type.typeLabel,
      type.imageUrl,
      type.description,
    );
  }

  product.sizes = await productSizeRepository.findByProductId(product.id);
  product.types = await productTypeRepository.findByProductId(product.id);

  return product;
};

exports.updateProduct = async (id, data) => {
  const existing = await productRepository.findById(id);
  if (!existing) throw new Error("Product not found");

  await productRepository.updateProduct(id, {
    productname: data.productname ?? existing.productname,
    category: data.category ?? existing.category,
    kashrut: data.kashrut ?? existing.kashrut,
    specialrequirements:
      data.specialrequirements ?? existing.specialrequirements,
    occasions: data.occasions ?? existing.occasions,
    is_active: data.is_active ?? existing.isActive,
  });

  if (data.sizes !== undefined) {
    if (!Array.isArray(data.sizes)) {
      throw new Error("Sizes must be an array");
    }

    const existingSizes = await productSizeRepository.findByProductId(id);

    const existingSizeIds = new Set(
      existingSizes.map((size) => String(size.id)),
    );

    const submittedIds = data.sizes
      .filter((size) => size.id && existingSizeIds.has(String(size.id)))
      .map((size) => String(size.id));

    if (new Set(submittedIds).size !== submittedIds.length) {
      throw new Error("Duplicate size IDs are not allowed");
    }

    for (const size of data.sizes) {
      if (size.id && existingSizeIds.has(String(size.id))) {
        await productSizeRepository.updateSize(
          size.id,
          id,
          size.label,
          size.price,
          size.qty,
        );
      } else {
        await productSizeRepository.createSize(
          id,
          size.label,
          size.price,
          size.qty,
        );
      }
    }

    const submittedExistingIds = new Set(submittedIds);

    for (const size of existingSizes) {
      if (!submittedExistingIds.has(String(size.id))) {
        const inUse = await productSizeRepository.isSizeInCart(size.id);

        if (!inUse) {
          await productSizeRepository.deleteSizeById(size.id, id);
        }
      }
    }
  }

  return await exports.getProductById(id);
};


exports.deleteProduct = async (id) => {
  return await productRepository.deleteProduct(id);
};