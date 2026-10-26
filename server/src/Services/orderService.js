
const orderRepository = require("../Repositories/orderRepository");

const ORDER_STATUSES = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

const ALLOWED_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const fail = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const parsePagination = (pageInput, limitInput) => {
  const page = Number.parseInt(pageInput, 10) || 1;
  const limit = Number.parseInt(limitInput, 10) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    fail("Invalid pagination parameters.");
  }

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

exports.getMyOrders = async (userId, query) => {
  const { page, limit, offset } = parsePagination(
    query.page,
    query.limit,
  );

  const [orders, total] = await Promise.all([
    orderRepository.findOrdersForUser(userId, { limit, offset }),
    orderRepository.countOrdersForUser(userId),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getAllOrders = async (query) => {
  const { page, limit, offset } = parsePagination(
    query.page,
    query.limit,
  );

  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;

  if (status && !ORDER_STATUSES.includes(status)) {
    fail("Invalid order status.");
  }

  const filters = { status, search, limit, offset };

  const [orders, total] = await Promise.all([
    orderRepository.findAllOrders(filters),
    orderRepository.countOrders({ status, search }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getOrderDetails = async (orderId) => {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    fail("Order not found.", 404);
  }

  order.items = await orderRepository.findOrderItems(orderId);

  return order;
};

exports.updateOrderStatus = async (orderId, newStatus) => {
  if (!ORDER_STATUSES.includes(newStatus)) {
    fail("Invalid order status.");
  }

  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    fail("Order not found.", 404);
  }

  if (!ALLOWED_TRANSITIONS[order.status]?.includes(newStatus)) {
    fail(
      `Cannot change order status from "${order.status}" to "${newStatus}".`,
      409,
    );
  }

  return orderRepository.updateOrderStatus(orderId, newStatus);
};

exports.getPendingProductionSummary = async () => {
  return orderRepository.getPendingProductionSummary();
};