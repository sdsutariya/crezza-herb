export type OrderWhatsAppParams = {
  shortOrderId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email?: string | null;
};

/** International format, no "+" or spaces. Override via VITE_WHATSAPP_ORDER_NUMBER in .env */
export const WHATSAPP_ORDER_NUMBER =
  (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER ?? "919876543210").trim();

export function whatsappLink(message: string, number: string = WHATSAPP_ORDER_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppHref(
  orderId: string,
  messageParams: Omit<OrderWhatsAppParams, "shortOrderId">,
): string {
  const shortOrderId = orderId.slice(0, 8).toUpperCase();
  return whatsappLink(buildOrderWhatsAppMessage({ shortOrderId, ...messageParams }));
}

/** Same-tab redirect — reliable after async order insert (avoids popup blockers). */
export function openWhatsApp(href: string): void {
  window.location.assign(href);
}

export function buildOrderWhatsAppMessage(params: OrderWhatsAppParams): string {
  const {
    shortOrderId,
    quantity,
    unitPrice,
    total,
    name,
    phone,
    address,
    city,
    state,
    pincode,
    email,
  } = params;

  return `Hi CrezzaHerb! I'd like to confirm my order.

• Order ID: ${shortOrderId}
• Product: CrezzaHerb Herbal Hair Oil (100ml)
• Quantity: ${quantity}
• Unit price: ₹${unitPrice}
• Total: ₹${total}

• Name: ${name}
• Phone: ${phone}
• Address: ${address}
• City: ${city}, ${state} — ${pincode}
• Email: ${email || "—"}

Please pay and confirm your order on WhatsApp — we'll share payment details with you in this chat. Thank you!`;
}
