const nodemailer = require("nodemailer");
const React = require("react");
const { render } = require("@react-email/render");

const imported = require("./generated/OrderEmail.cjs");
const OrderEmail = imported.default || imported;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOrderEmail = async (order, items) => {
  const fullName = order.full_name || order.fullName || "Not provided";
  const buyerEmail = order.email;

  if (!buyerEmail) {
    throw new Error("Cannot send order confirmation: buyer email is missing.");
  }

  const address = order.shipping_address || order.address || "Not provided";
  const city = order.shipping_city || order.city || "";
  const postalCode = order.postal_code || order.postalCode || "";

  const subtotal = order.subtotal ?? "0.00";
  const delivery = order.delivery_fee ?? order.deliveryFee ?? "0.00";
  const total = order.total ?? "0.00";

  const orderItems = items.map((item) => {
    const name = item.productName ?? item.product_name ?? "Product";
    const size =
      item.sizeLabel ??
      item.size_label ??
      item.typeLabel ??
      item.type_label ??
      "-";
    const quantity = item.quantity ?? 0;
    const unitPrice = item.unitPrice ?? item.unit_price ?? "0.00";
    const lineTotal = item.subtotal ?? "0.00";

    return `${name} | ${size} | Qty: ${quantity} | Unit: ${unitPrice} | Total: ${lineTotal}`;
  });

  const makeText = (recipient) => {
    const isStore = recipient === "store";

    return [
      isStore
        ? "HEALTHIER & DELICIOUS - NEW ORDER"
        : "HEALTHIER & DELICIOUS - ORDER CONFIRMATION",
      "",
      isStore
        ? "A new order has been received. Please prepare it for delivery."
        : `Hi ${fullName === "Not provided" ? "there" : fullName}, thank you for your order!`,
      "",
      `Order number: ${order.id}`,
      `Order total: ${total}`,
      "",
      ...(isStore
        ? [
            "CUSTOMER DETAILS",
            `Customer: ${fullName}`,
            `Email: ${buyerEmail}`,
            `Phone: ${order.phone || "Not provided"}`,
            "",
          ]
        : []),
      isStore ? "DELIVERY ADDRESS" : "YOUR DELIVERY ADDRESS",
      fullName,
      address,
      [city, postalCode].filter(Boolean).join(", "),
      "",
      "ORDER ITEMS",
      ...orderItems,
      "",
      `Subtotal: ${subtotal}`,
      `Delivery: ${delivery}`,
      `Total: ${total}`,
      "",
      ...(isStore
        ? ["Please prepare this order for delivery."]
        : [
            "We're preparing your order with care.",
            "Thank you for supporting Healthier & Delicious!",
          ]),
    ].join("\n");
  };

  const renderEmail = async (recipient) =>
    render(
      React.createElement(OrderEmail, {
        order,
        items,
        recipient,
      }),
    );

  const storeRecipients = [
    "healthieranddeliciousrbs@gmail.com",
  ];

  const storeHtml = await renderEmail("store");
  const buyerHtml = await renderEmail("buyer");

  const sendStoreEmails = storeRecipients.map((recipientEmail) =>
    transporter.sendMail({
      from: `"Healthier & Delicious" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `New Order #${order.id}`,
      html: storeHtml,
      text: makeText("store"),
    }),
  );

  const sendBuyerEmail = transporter.sendMail({
    from: `"Healthier & Delicious" <${process.env.SMTP_USER}>`,
    to: buyerEmail,
    subject: `Order Confirmation #${order.id}`,
    html: buyerHtml,
    text: makeText("buyer"),
  });

  return Promise.all([...sendStoreEmails, sendBuyerEmail]);
};
