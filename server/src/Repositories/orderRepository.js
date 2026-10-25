
const pool = require("../config/db");

exports.findActiveCartForUpdate = async (client, cartId, userId) => {
  const result = await client.query(
    `SELECT id, user_id, status
     FROM carts
     WHERE id = $1
       AND user_id = $2
       AND status = 'active'
     FOR UPDATE`,
    [cartId, userId]
  );

  return result.rows[0] || null;
};

exports.findItemsForCheckout = async (client, cartId) => {
  const result = await client.query(
    `SELECT
       ci.id AS cart_item_id,
       ci.product_id,
       ci.product_size_id,
       ci.product_type_id,
       ci.quantity,
       p.productname,
       p.is_active,
       ps.size_label,
       ps.price,
       ps.qty AS stock,
       pt.image_url,
       pt.description,
       pt.type_label
     FROM cart_items ci
     JOIN products p
       ON p.id = ci.product_id
     JOIN product_sizes ps
       ON ps.id = ci.product_size_id
       AND ps.product_id = ci.product_id
     LEFT JOIN product_types pt
       ON pt.id = ci.product_type_id
       AND pt.product_id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ps.id, ci.id
     FOR UPDATE OF ci, ps, p`,
    [cartId]
  );

  return result.rows;
};

exports.createOrder = async (client, order) => {
  const result = await client.query(
    `INSERT INTO orders (
       user_id, cart_id, status, payment_status,
       full_name, email, phone,
       shipping_address, shipping_city, postal_code,
       subtotal, delivery_fee, total
     )
     VALUES (
       $1, $2, 'pending', 'pending',
       $3, $4, $5, $6, $7, $8, $9, $10, $11
     )
     RETURNING *`,
    [
      order.userId,
      order.cartId,
      order.fullName,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.postalCode,
      order.subtotal,
      order.deliveryFee,
      order.total,
    ]
  );

  return result.rows[0];
};

exports.createOrderItem = async (client, item) => {
  await client.query(
    `INSERT INTO order_items (
       order_id, product_id, product_size_id,
       product_type_id, product_name, size_label,
       type_label, quantity, unit_price, subtotal
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      item.orderId,
      item.productId,
      item.sizeId,
      item.typeId,
      item.productName,
      item.sizeLabel,
      item.typeLabel,
      item.quantity,
      item.unitPrice,
      item.subtotal,
    ]
  );
};

exports.decreaseStock = async (client, sizeId, quantity) => {
  const result = await client.query(
    `UPDATE product_sizes
     SET qty = qty - $1
     WHERE id = $2
       AND qty >= $1
     RETURNING id`,
    [quantity, sizeId]
  );

  if (result.rowCount !== 1) {
    throw new Error("INSUFFICIENT_STOCK");
  }
};

exports.markCartCheckedOut = async (client, cartId) => {
  await client.query(
    `UPDATE carts
     SET status = 'checked_out', updated_at = NOW()
     WHERE id = $1`,
    [cartId]
  );
};

exports.findOrderByIdForUser = async (orderId, userId) => {
  const result = await pool.query(
    `SELECT *
     FROM orders
     WHERE id = $1 AND user_id = $2`,
    [orderId, userId]
  );

  return result.rows[0] || null;
};

exports.findOrderItems = async (orderId) => {
  const result = await pool.query(
    `SELECT *
     FROM order_items
     WHERE order_id = $1
     ORDER BY id`,
    [orderId]
  );

  return result.rows;
};
