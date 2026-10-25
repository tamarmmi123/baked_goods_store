const pool = require("../config/db");
const ProductSize = require("../models/ProductSize");

exports.findByProductId = async (productId) => {
  const result = await pool.query(
    "SELECT * FROM product_sizes WHERE product_id = $1",
    [productId]
  );

  return result.rows.map(
    (row) =>
      new ProductSize({
        id: row.id,
        productId: row.product_id,
        label: row.size_label,
        price: row.price,
        qty: row.qty,
      })
  );
};

exports.createSize = async (productId, label, price, qty) => {
  const result = await pool.query(
    `INSERT INTO product_sizes (product_id, size_label, price, qty)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, label, price, qty]
  );

  const row = result.rows[0];

  return new ProductSize({
    id: row.id,
    productId: row.product_id,
    label: row.size_label,
    price: row.price,
    qty: row.qty,
  });
};

exports.updateSize = async (sizeId, productId, label, price, qty) => {
  const result = await pool.query(
    `UPDATE product_sizes
     SET size_label = $1,
         price = $2,
         qty = $3
     WHERE id = $4
       AND product_id = $5
     RETURNING *`,
    [label, price, qty, sizeId, productId]
  );

  if (result.rowCount === 0) {
    throw new Error("Size not found for this product");
  }

  const row = result.rows[0];

  return new ProductSize({
    id: row.id,
    productId: row.product_id,
    label: row.size_label,
    price: row.price,
    qty: row.qty,
  });
};

exports.isSizeInCart = async (sizeId) => {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM cart_items
       WHERE product_size_id = $1
     ) AS in_use`,
    [sizeId]
  );

  return result.rows[0].in_use;
};

exports.deleteSizeById = async (sizeId, productId) => {
  await pool.query(
    `DELETE FROM product_sizes
     WHERE id = $1
       AND product_id = $2`,
    [sizeId, productId]
  );
};

exports.deleteSizesByProductId = async (productId) => {
  await pool.query(
    "DELETE FROM product_sizes WHERE product_id = $1",
    [productId]
  );
};