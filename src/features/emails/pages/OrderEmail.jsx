import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Row,
  Column,
  Hr,
  Tailwind,
  Img,
} from "@react-email/components";
import tailwindConfig from "../../../../tailwind.config.js";

export default function OrderEmail({
  order = {},
  items = [],
  recipient = "store",
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

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {isStore
          ? `New order #${order.id} — Healthier & Delicious`
          : `Order confirmed #${order.id} — Healthier & Delicious`}
      </Preview>

      <Tailwind config={tailwindConfig}>
        <Body className="m-0 bg-background font-sans text-text">
          <Container className="mx-auto my-8 max-w-[600px] overflow-hidden rounded-2xl border border-border bg-surface">
            {/* Header */}
            <Section className="bg-primary px-6 py-8 text-center">
              <Text className="text-xs uppercase tracking-[3px] text-white">
                Fresh · Natural · Delicious
              </Text>

              <Heading className="my-3 text-3xl text-white">
                Healthier &amp; Delicious
              </Heading>

              <Text className="text-sm text-white">
                {isStore ? "New order notification" : "Order confirmation"}
              </Text>
            </Section>

            {/* Order introduction */}
            <Section className="px-7 pt-7">
              <Text className="text-xs font-bold uppercase tracking-widest text-primary">
                {isStore ? "New order received" : "Thank you for your order"}
              </Text>

              <Heading as="h2" className="text-2xl text-text">
                {isStore
                  ? "A fresh order is here!"
                  : "Your order is confirmed!"}
              </Heading>

              <Text className="text-sm leading-6 text-muted">
                {isStore
                  ? "A customer has placed an order. Please review the details below and prepare it for delivery."
                  : `Hi ${fullName === "Not provided" ? "there" : fullName}, thank you for choosing Healthier & Delicious! Here is a summary of your order.`}
              </Text>

              <Section className="rounded-xl border border-border bg-background p-4">
                <Row>
                  <Column>
                    <Text className="text-xs text-muted">ORDER NUMBER</Text>

                    <Text className="text-xl font-bold text-primary">
                      #{order.id ?? ""}
                    </Text>
                  </Column>

                  <Column align="right">
                    <Text className="text-xs text-muted">ORDER TOTAL</Text>

                    <Text className="text-xl font-bold text-primary">
                      {total}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Customer details */}
            {isStore && (
              <Section className="px-7 pt-5">
                <Heading as="h3" className="text-base text-text">
                  Customer details
                </Heading>

                {[
                  ["Name", fullName],
                  ["Email", email],
                  ["Phone", phone],
                ].map(([label, value]) => (
                  <Row key={label}>
                    <Column className="w-24 border-b border-border py-3">
                      <Text className="text-sm text-muted">{label}</Text>
                    </Column>

                    <Column className="border-b border-border py-3">
                      <Text className="break-words text-sm text-text">
                        {value}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {/* Delivery address */}
            <Section className="px-7 pt-5">
              <Heading as="h3" className="text-base text-text">
                {isStore ? "Delivery address" : "Your delivery address"}
              </Heading>

              <Section className="border-l-4 border-primary bg-background p-4">
                <Text className="text-sm leading-6 text-text">
                  <strong>{fullName}</strong>
                  <br />
                  {address}
                  <br />
                  {city}
                  {city && postalCode ? ", " : ""}
                  {postalCode}
                </Text>
              </Section>
            </Section>

            {/* Order items */}
            <Section className="px-7 pt-5">
              <Heading as="h3" className="text-base text-text">
                Order items
              </Heading>

              {items.length === 0 ? (
                <Text className="text-sm text-muted">
                  No items found for this order.
                </Text>
              ) : (
                items.map((item, index) => (
                  <React.Fragment
                    key={`${item.productId ?? item.product_id ?? item.productName ?? item.product_name}-${index}`}
                  >
                    <Section className="border-b border-border py-4">
                      <Row>
                        {/* Product information */}
                        <Column className="w-20 pr-3">
                          {(item.imageUrl || item.image_url) && (
                            <Img
                              src={item.imageUrl || item.image_url}
                              alt={
                                item.productName ||
                                item.product_name ||
                                "Product"
                              }
                              width="100"
                              height="100"
                              className="rounded-lg object-cover"
                            />
                          )}
                        </Column>

                        <Column className="pr-3">
                          <Text className="m-0 text-sm font-semibold text-text">
                            {item.productName ?? item.product_name ?? "Product"}
                          </Text>

                          {(item.typeLabel ?? item.type_label) && (
                            <Text className="mb-0 mt-1 text-sm text-primary">
                              {item.typeLabel ?? item.type_label}
                            </Text>
                          )}

                          {(item.sizeLabel ?? item.size_label) && (
                            <Text className="mb-0 mt-1 text-xs text-muted">
                              Size: {item.sizeLabel ?? item.size_label}
                            </Text>
                          )}

                          <Text className="mb-0 mt-2 text-xs text-muted">
                            {item.unitPrice ?? item.unit_price ?? "0.00"} each
                          </Text>
                        </Column>

                        {/* Quantity and line total */}
                        <Column align="right" className="w-20">
                          <Text className="m-0 text-xs text-muted">
                            Qty: {item.quantity}
                          </Text>

                          <Text className="mb-0 mt-2 text-sm font-bold text-text">
                            {item.subtotal ?? "0.00"}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  </React.Fragment>
                ))
              )}
            </Section>

            {/* Payment summary */}
            <Section className="px-7 py-6">
              <Heading as="h3" className="text-base text-text">
                Payment summary
              </Heading>

              {[
                ["Subtotal", subtotal],
                ["Delivery", delivery],
              ].map(([label, value]) => (
                <Row key={label}>
                  <Column>
                    <Text className="text-sm text-muted">{label}</Text>
                  </Column>

                  <Column align="right">
                    <Text className="text-sm text-text">{value}</Text>
                  </Column>
                </Row>
              ))}

              <Hr className="border-border" />

              <Row>
                <Column>
                  <Text className="font-bold text-text">Total</Text>
                </Column>

                <Column align="right">
                  <Text className="text-xl font-bold text-primary">
                    {total}
                  </Text>
                </Column>
              </Row>
            </Section>

            {isBuyer && (
              <Section className="px-7 pb-6">
                <Section className="rounded-xl border border-border bg-background p-5">
                  <Heading as="h3" className="text-base text-text">
                    What's next?
                  </Heading>

                  <Text className="text-sm leading-6 text-muted">
                    We're preparing your order with care. Please keep your order
                    number for reference if you need to contact us about your
                    purchase.
                  </Text>

                  <Text className="text-sm font-bold text-primary">
                    Thank you for supporting Healthier &amp; Delicious!
                  </Text>
                </Section>
              </Section>
            )}

            {/* Footer */}
            <Section className="bg-primary px-6 py-6 text-center">
              <Text className="text-xs leading-5 text-white">
                {isStore
                  ? "Internal order notification. Please prepare this order for delivery."
                  : "Thank you for your order. We appreciate your support!"}
              </Text>
              <Text className="font-bold text-white">
                Healthier &amp; Delicious
              </Text>

              <Text className="text-xs leading-5 text-white">
                Fresh food. Thoughtfully prepared.
                <br />
                This is an automated order notification.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
