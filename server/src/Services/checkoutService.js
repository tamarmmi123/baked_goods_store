const pool = require("../config/db");
require("dotenv").config();

const orderRepository = require("../Repositories/orderRepository");

const fail = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const emailService = require("./emailService");

exports.checkout = async (userId, input) => {
  const { cartId, fullName, email, phone, address, city, postalCode } = input;

  if (
    !cartId ||
    !fullName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !city?.trim() ||
    !postalCode?.trim()
  ) {
    fail("Please provide all required checkout details.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cart = await orderRepository.findActiveCartForUpdate(
      client,
      cartId,
      userId,
    );

    if (!cart) {
      fail("Active cart not found.", 404);
    }

    const items = await orderRepository.findItemsForCheckout(client, cartId);

    if (items.length === 0) {
      fail("Your cart is empty.");
    }

    // A missing product or size causes the JOIN to omit that row.
    // Never silently create an order for only part of the cart.
    const countResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM cart_items WHERE cart_id = $1",
      [cartId],
    );

    if (items.length !== countResult.rows[0].count) {
      fail("One or more cart items are no longer available.");
    }

    // Use integer cents to avoid floating-point money calculations.
    let subtotalCents = 0;
    const orderItems = [];
    // const stockRequired = new Map();

    for (const item of items) {
      if (!item.is_active) {
        fail(`Product "${item.productname}" is unavailable.`);
      }

      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        fail("A cart item has an invalid quantity.");
      }

      if (item.product_type_id && !item.type_label) {
        fail("A selected product type is no longer available.");
      }

      const price = Number(item.price);
      const unitPriceCents = Math.round(price * 100);

      if (!Number.isFinite(price) || price < 0) {
        fail("A product has an invalid price.");
      }

      const lineTotalCents = unitPriceCents * item.quantity;

      if (!Number.isSafeInteger(lineTotalCents)) {
        fail("Order total is too large.");
      }

      subtotalCents += lineTotalCents;

      if (!Number.isSafeInteger(subtotalCents)) {
        fail("Order total is too large.");
      }

      //   stockRequired.set(
      //     item.product_size_id,
      //     (stockRequired.get(item.product_size_id) || 0) +
      //       item.quantity
      //   );

      orderItems.push({
        productId: item.product_id,
        sizeId: item.product_size_id,
        typeId: item.product_type_id,
        imageUrl: item.image_url,
        productName: item.productname,
        sizeLabel: item.size_label,
        typeLabel: item.type_label,
        quantity: item.quantity,
        unitPrice: (unitPriceCents / 100).toFixed(2),
        subtotal: (lineTotalCents / 100).toFixed(2),
      });
    }

    // Multiple variants can use the same size/stock record.
    // Check their combined quantity, not each line independently.
    // for (const [sizeId, quantity] of stockRequired) {
    //   const stockItem = items.find(
    //     (item) => item.product_size_id === sizeId
    //   );

    //   if (Number(stockItem.stock) < quantity) {
    //     fail(
    //       `Insufficient stock for "${stockItem.productname}" (${stockItem.size_label}).`,
    //       409
    //     );
    //   }
    // }

    const subtotal = (subtotalCents / 100).toFixed(2);

    // Delivery is free in this first version.
    // Replace this with your delivery pricing rules later.
    const deliveryFee = "0.00";
    const total = subtotal;

    const order = await orderRepository.createOrder(client, {
      userId,
      cartId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      subtotal,
      deliveryFee,
      total,
    });

    for (const item of orderItems) {
      await orderRepository.createOrderItem(client, {
        ...item,
        orderId: order.id,
      });
    }

    // for (const [sizeId, quantity] of stockRequired) {
    //   await orderRepository.decreaseStock(
    //     client,
    //     sizeId,
    //     quantity
    //   );
    // }

    await orderRepository.markCartCheckedOut(client, cartId);

    await client.query("COMMIT");

    console.log("Order email items:", JSON.stringify(orderItems, null, 2));

    try {
      await emailService.sendOrderEmail(order, orderItems);
    } catch (emailError) {
      console.error("Order created, but email failed:", emailError);
    }

    return {
      ...order,
      items: orderItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      fail("This cart has already been checked out.", 409);
    }

    // if (error.message === "INSUFFICIENT_STOCK") {
    //   fail("Stock changed during checkout. Please try again.", 409);
    // }

    throw error;
  } finally {
    client.release();
  }
};

exports.getOrder = async (orderId, userId) => {
  const order = await orderRepository.findOrderByIdForUser(orderId, userId);

  if (!order) {
    fail("Order not found.", 404);
  }

  order.items = await orderRepository.findOrderItems(orderId);

  return order;
};
