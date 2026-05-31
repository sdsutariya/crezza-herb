export const PRODUCT_PRICE = 550;
export const PRODUCT_MRP = 750;

export function formatProductPrice(amount = PRODUCT_PRICE): string {
  return `₹${amount}`;
}
