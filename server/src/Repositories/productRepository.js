const Product = require("../models/Product");
const pool = require("../config/db");

exports.findAll = async () => {
  const result = await pool.query(`
    SELECT 
      p.*,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', ps.id,
          'label', ps.size_label,
          'price', ps.price,
          'qty', ps.qty
        )) FILTER (WHERE ps.id IS NOT NULL),
        '[]'
      ) AS sizes,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', pt.id,
          'typeLabel', pt.type_label,
          'imageUrl', pt.image_url,
          'description', pt.description
        )) FILTER (WHERE pt.id IS NOT NULL),
        '[]'
      ) AS types
    FROM products p
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    LEFT JOIN product_types pt ON pt.product_id = p.id
    WHERE p.is_active = true
    GROUP BY p.id
  `);

  return result.rows.map(
    (row) =>
      new Product({
        id: row.id,
        productname: row.productname,
        category: row.category,
        kashrut: row.kashrut,
        specialrequirements: row.specialrequirements,
        occasions: row.occasions,
        sizes: row.sizes,
        types: row.types,
        is_active: row.is_active,
      }),
  );
};

exports.findInStock = async () => {
  const result = await pool.query(`
    SELECT DISTINCT p.*
    FROM products p
    JOIN product_sizes ps ON ps.product_id = p.id
    WHERE ps.qty > 0
  `);

  return result.rows.map(
    (row) =>
      new Product({
        id: row.id,
        productname: row.productname,
        category: row.category,
        kashrut: row.kashrut,
        specialrequirements: row.specialrequirements,
        occasions: row.occasions,
        is_active: row.is_active,
      }),
  );
};

exports.findById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      p.*,
      COALESCE(
        json_agg(jsonb_build_object(
          'id', ps.id,
          'label', ps.size_label,
          'price', ps.price,
          'qty', ps.qty
        )) FILTER (WHERE ps.id IS NOT NULL),
        '[]'
      ) AS sizes,
      COALESCE(
        json_agg(jsonb_build_object(
          'id', pt.id,
          'typeLabel', pt.type_label,
          'imageUrl', pt.image_url,
          'description', pt.description
        )) FILTER (WHERE pt.id IS NOT NULL),
        '[]'
      ) AS types
    FROM products p
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    LEFT JOIN product_types pt ON pt.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id
  `,
    [id],
  );

  if (!result.rows[0]) return null;

  const row = result.rows[0];
  return new Product({
    id: row.id,
    productname: row.productname,
    category: row.category,
    kashrut: row.kashrut,
    specialrequirements: row.specialrequirements,
    occasions: row.occasions,
    sizes: row.sizes,
    types: row.types,
    is_active: row.is_active,
  });
};

exports.createProduct = async ({
  productname,
  category,
  kashrut,
  specialrequirements,
  occasions,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      `
      INSERT INTO products (productname, category, kashrut, specialrequirements, occasions)
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb)
      RETURNING *
    `,
      [
        productname,
        category,
        kashrut,
        JSON.stringify(specialrequirements ?? []),
        JSON.stringify(occasions ?? []),
      ],
    );

    await client.query("COMMIT");
    return productResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.updateProduct = async (
  id,
  { productname, category, kashrut, specialrequirements, occasions, is_active },
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      `
      UPDATE products
      SET
        productname = $1,
        category = $2,
        kashrut = $3,
        specialrequirements = COALESCE($4::jsonb, specialrequirements),
        occasions = COALESCE($5::jsonb, occasions),
        is_active = $6
      WHERE id = $7
      RETURNING *
    `,
      [
        productname,
        category,
        kashrut,
        specialrequirements !== undefined
          ? JSON.stringify(specialrequirements)
          : null,
        occasions !== undefined ? JSON.stringify(occasions) : null,
        is_active,
        id,
      ],
    );

    if (!productResult.rows[0]) throw new Error("Product not found");

    await client.query("COMMIT");
    return productResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.deleteProduct = async (id) => {
  const result = await pool.query(
    `UPDATE products
     SET is_active = false
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  if (result.rowCount === 0) {
    throw new Error("Product not found");
  }

  return result.rows[0];
};
