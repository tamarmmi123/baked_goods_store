const pool = require("../config/db");
const CartItem = require("../models/CartItem");

exports.findByCartId = async (cartId) => {
  const result = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = $1",
    [cartId],
  );

  return result.rows.map(
    (row) =>
      new CartItem({
        id: row.id,
        cart_id: row.cart_id,
        product_id: row.product_id,
        size_id: row.product_size_id,
        type_id: row.product_type_id,
        quantity: row.quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
  );
};

exports.addCartItem = async (cartId, productId, sizeId, typeId, quantity) => {
  const result = await pool.query(
    `INSERT INTO cart_items (
     cart_id,
     product_id,
     product_size_id,
     product_type_id,
     quantity,
     unit_price
   )
   VALUES ($1, $2, $3, $4, $5, $6)
   ON CONFLICT (
     cart_id,
     product_id,
     product_size_id,
     product_type_id
   )
   DO UPDATE SET
     quantity = cart_items.quantity + EXCLUDED.quantity
   RETURNING *`,
    [cartId, productId, sizeId, typeId, quantity, 0],
  );

  const row = result.rows[0];

  return new CartItem({
    id: row.id,
    cart_id: row.cart_id,
    product_id: row.product_id,
    size_id: row.product_size_id,
    type_id: row.product_type_id,
    quantity: row.quantity,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

exports.updateCartItemQuantity = async (cartItemId, quantity) => {
  const result = await pool.query(
    `UPDATE cart_items
            SET quantity = $1
            WHERE id = $2
            RETURNING *`,
    [quantity, cartItemId],
  );
  const row = result.rows[0];
  return new CartItem({
    id: row.id,
    cart_id: row.cart_id,
    product_id: row.product_id,
    size_id: row.size_id,
    quantity: row.quantity,
  });
};

exports.deleteCartItem = async (cartItemId) => {
  await pool.query(`DELETE FROM cart_items WHERE id = $1`, [cartItemId]);
};
