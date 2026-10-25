const pool = require("../config/db");
const Cart = require("../models/Cart");

exports.findByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM carts
     WHERE user_id = $1
       AND status = 'active'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  );

  if (!result.rows[0]) return null;

  const row = result.rows[0];

  return new Cart({
    id: row.id,
    user_id: row.user_id,
    status: row.status,
    items: row.items,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

exports.createCart = async (userId) => {
  const result = await pool.query(
    `INSERT INTO carts (user_id, status)
     VALUES ($1, 'active')
     RETURNING *`,
    [userId],
  );

  return result.rows[0];
};

exports.updateCartItems = async (cartId, items) => {
  const result = await pool.query(
    `UPDATE carts
        SET items = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
    [JSON.stringify(items), cartId],
  );
  const row = result.rows[0];
  return new Cart({
    id: row.id,
    user_id: row.user_id,
    status: row.status,
    items: row.items,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};
