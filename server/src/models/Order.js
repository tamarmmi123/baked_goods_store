const ORDER_STATUSES = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const ALLOWED_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

module.exports = {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  ALLOWED_TRANSITIONS,
};