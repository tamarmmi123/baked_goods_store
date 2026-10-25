"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// tailwind.config.js
var require_tailwind_config = __commonJS({
  "tailwind.config.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
      theme: {
        extend: {
          colors: {
            background: "#fdf4f7",
            surface: "#ffffff",
            primary: "#c26b8a",
            "primary-hover": "#b05f7c",
            border: "#f0b7c9",
            text: "#4a2c36",
            muted: "#9c6f7d"
          }
        }
      },
      plugins: []
    };
  }
});

// src/features/emails/pages/OrderEmail.jsx
var OrderEmail_exports = {};
__export(OrderEmail_exports, {
  default: () => OrderEmail
});
module.exports = __toCommonJS(OrderEmail_exports);
var import_react = __toESM(require("react"));
var import_components = require("@react-email/components");
var import_tailwind_config = __toESM(require_tailwind_config());
var import_jsx_runtime = require("react/jsx-runtime");
function OrderEmail({
  order = {},
  items = [],
  recipient = "store"
}) {
  const isStore = recipient === "store";
  const isBuyer = recipient === "buyer";
  const fullName = order.full_name || order.fullName || "Not provided";
  const email = order.email || "Not provided";
  const phone = order.phone || "Not provided";
  const address = order.shipping_address || order.address || "Not provided";
  const city = order.shipping_city || order.city || "";
  const postalCode = order.postal_code || order.postalCode || "";
  const subtotal = order.subtotal ?? "0.00";
  const delivery = order.delivery_fee ?? order.deliveryFee ?? "0.00";
  const total = order.total ?? "0.00";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Html, { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Head, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Preview, { children: isStore ? `New order #${order.id} \u2014 Healthier & Delicious` : `Order confirmed #${order.id} \u2014 Healthier & Delicious` }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tailwind, { config: import_tailwind_config.default, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Body, { className: "m-0 bg-background font-sans text-text", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Container, { className: "mx-auto my-8 max-w-[600px] overflow-hidden rounded-2xl border border-border bg-surface", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "bg-primary px-6 py-8 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xs uppercase tracking-[3px] text-white", children: "Fresh \xB7 Natural \xB7 Delicious" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { className: "my-3 text-3xl text-white", children: "Healthier & Delicious" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm text-white", children: isStore ? "New order notification" : "Order confirmation" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "px-7 pt-7", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xs font-bold uppercase tracking-widest text-primary", children: isStore ? "New order received" : "Thank you for your order" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h2", className: "text-2xl text-text", children: isStore ? "A fresh order is here!" : "Your order is confirmed!" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm leading-6 text-muted", children: isStore ? "A customer has placed an order. Please review the details below and prepare it for delivery." : `Hi ${fullName === "Not provided" ? "there" : fullName}, thank you for choosing Healthier & Delicious! Here is a summary of your order.` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "rounded-xl border border-border bg-background p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Column, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xs text-muted", children: "ORDER NUMBER" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "text-xl font-bold text-primary", children: [
              "#",
              order.id ?? ""
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Column, { align: "right", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xs text-muted", children: "ORDER TOTAL" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xl font-bold text-primary", children: total })
          ] })
        ] }) })
      ] }),
      isStore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "px-7 pt-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h3", className: "text-base text-text", children: "Customer details" }),
        [
          ["Name", fullName],
          ["Email", email],
          ["Phone", phone]
        ].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { className: "w-24 border-b border-border py-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm text-muted", children: label }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { className: "border-b border-border py-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "break-words text-sm text-text", children: value }) })
        ] }, label))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "px-7 pt-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h3", className: "text-base text-text", children: isStore ? "Delivery address" : "Your delivery address" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "border-l-4 border-primary bg-background p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "text-sm leading-6 text-text", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: fullName }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          address,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          city,
          city && postalCode ? ", " : "",
          postalCode
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "px-7 pt-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h3", className: "text-base text-text", children: "Order items" }),
        items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm text-muted", children: "No items found for this order." }) : items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react.default.Fragment,
          {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "border-b border-border py-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Row, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { className: "w-20 pr-3", children: (item.imageUrl || item.image_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Img,
                {
                  src: item.imageUrl || item.image_url,
                  alt: item.productName || item.product_name || "Product",
                  width: "100",
                  height: "100",
                  className: "rounded-lg object-cover"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Column, { className: "pr-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "m-0 text-sm font-semibold text-text", children: item.productName ?? item.product_name ?? "Product" }),
                (item.typeLabel ?? item.type_label) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "mb-0 mt-1 text-sm text-primary", children: item.typeLabel ?? item.type_label }),
                (item.sizeLabel ?? item.size_label) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "mb-0 mt-1 text-xs text-muted", children: [
                  "Size: ",
                  item.sizeLabel ?? item.size_label
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "mb-0 mt-2 text-xs text-muted", children: [
                  item.unitPrice ?? item.unit_price ?? "0.00",
                  " each"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Column, { align: "right", className: "w-20", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "m-0 text-xs text-muted", children: [
                  "Qty: ",
                  item.quantity
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "mb-0 mt-2 text-sm font-bold text-text", children: item.subtotal ?? "0.00" })
              ] })
            ] }) })
          },
          `${item.productId ?? item.product_id ?? item.productName ?? item.product_name}-${index}`
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "px-7 py-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h3", className: "text-base text-text", children: "Payment summary" }),
        [
          ["Subtotal", subtotal],
          ["Delivery", delivery]
        ].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm text-muted", children: label }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { align: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm text-text", children: value }) })
        ] }, label)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Hr, { className: "border-border" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "font-bold text-text", children: "Total" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Column, { align: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xl font-bold text-primary", children: total }) })
        ] })
      ] }),
      isBuyer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "px-7 pb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "rounded-xl border border-border bg-background p-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { as: "h3", className: "text-base text-text", children: "What's next?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm leading-6 text-muted", children: "We're preparing your order with care. Please keep your order number for reference if you need to contact us about your purchase." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-sm font-bold text-primary", children: "Thank you for supporting Healthier & Delicious!" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Section, { className: "bg-primary px-6 py-6 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-xs leading-5 text-white", children: isStore ? "Internal order notification. Please prepare this order for delivery." : "Thank you for your order. We appreciate your support!" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "font-bold text-white", children: "Healthier & Delicious" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "text-xs leading-5 text-white", children: [
          "Fresh food. Thoughtfully prepared.",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          "This is an automated order notification."
        ] })
      ] })
    ] }) }) })
  ] });
}
