const product = require('../models/Product');
const pool = require("../config/db");

exports.findAll = async () => {
    const result = await pool.query("SELECT * FROM products");
    return result.rows.map(row => new product(row.id, row.productname, row.description, row.qty, row.price, row.imageurl));
}

exports.findInStock = async () => {
    const result = await pool.query("SELECT * FROM products WHERE qty > 0");
    return result.rows.map(row => new product(row.id, row.productname, row.description, row.qty, row.price, row.imageurl));
}

exports.findById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
  if (!result.rows[0]) return null;
    const row = result.rows[0];
    return new product(row.id, row.productname, row.description, row.qty, row.price, row.imageurl);
};
exports.createProduct = async (productname, description, qty, price, imageUrl) => {
  const result = await pool.query(
    `INSERT INTO products (productname, description, qty, price, imageurl) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [productname, description, qty, price, imageUrl]
  );
    const row = result.rows[0];
    return new product(row.id, row.productname, row.description, row.qty, row.price, row.imageurl);
};

exports.updateProduct = async (id, productname, description, qty, price, imageUrl) => {
    const result = await pool.query(
        `UPDATE products
            SET productname=$1, description=$2, qty=$3, price=$4, imageurl=$5
            WHERE id=$6
            RETURNING *`,
        [productname, description, qty, price, imageUrl, id]
    );
    const row = result.rows[0];
    return new product(row.id, row.productname, row.description, row.qty, row.price, row.imageurl);
}

exports.deleteProduct = async (id) => {
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
}