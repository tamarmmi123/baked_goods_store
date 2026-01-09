const Product = require("../models/Product");
const pool = require("../config/db");

exports.findAll = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows.map(
    (row) =>
      new Product({
        id: row.id,
        productname: row.productname,
        description: row.description,
        qty: row.qty,
        price: row.price,
        imageUrl: row.imageurl,
        kashrut: row.kashrut,
        specialRequirements: row.specialrequirements,
        occasions: row.occasions,
      })
  );
};

exports.findInStock = async () => {
  const result = await pool.query("SELECT * FROM products WHERE qty > 0");
  return result.rows.map(
    (row) =>
      new Product({
        id: row.id,
        productname: row.productname,
        description: row.description,
        qty: row.qty,
        price: row.price,
        imageUrl: row.imageurl,
        kashrut: row.kashrut,
        specialRequirements: row.specialrequirements,
        occasions: row.occasions,
      })
  );
};

exports.findById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return new Product({
    id: row.id,
    productname: row.productname,
    description: row.description,
    qty: row.qty,
    price: row.price,
    imageUrl: row.imageurl,
    kashrut: row.kashrut,
    specialRequirements: row.specialrequirements,
    occasions: row.occasions,
  });
};

exports.createProduct = async (
  productname,
  description,
  qty,
  price,
  imageUrl,
  kashrut,
  specialRequirements,
  occasions
) => {
  const result = await pool.query(
    `INSERT INTO products (productname, description, qty, price, imageurl, kashrut, specialrequirements, occasions) 
VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)
     RETURNING *`,
    [
      productname,
      description,
      qty,
      price,
      imageUrl,
      kashrut,
      JSON.stringify(specialRequirements ?? []),
      JSON.stringify(occasions ?? []),
    ]
  );

  return new Product({
    id: result.rows[0].id,
    productname: result.rows[0].productname,
    description: result.rows[0].description,
    qty: result.rows[0].qty,
    price: result.rows[0].price,
    imageUrl: result.rows[0].imageurl,
    kashrut: result.rows[0].kashrut,
    specialRequirements: result.rows[0].specialrequirements,
    occasions: result.rows[0].occasions,
  });
};

exports.updateProduct = async (
  id,
  productname,
  description,
  qty,
  price,
  imageUrl,
  kashrut,
  specialRequirements,
  occasions
) => {
  const result = await pool.query(
    `UPDATE products
     SET productname=$1, description=$2, qty=$3, price=$4, imageurl=$5, kashrut=$6, specialrequirements=$7::jsonb, occasions=$8::jsonb
     WHERE id=$9
     RETURNING *`,
    [
      productname,
      description,
      qty,
      price,
      imageUrl,
      kashrut,
      JSON.stringify(specialRequirements ?? []),
      JSON.stringify(occasions ?? []),
      id,
    ]
  );
  const row = result.rows[0];
  return new Product({
    id: row.id,
    productname: row.productname,
    description: row.description,
    qty: row.qty,
    price: row.price,
    imageUrl: row.imageurl,
    kashrut: row.kashrut,
    specialRequirements: row.specialrequirements,
    occasions: row.occasions,
  });
};

exports.deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
};
