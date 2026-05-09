/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UPI_ID?: string;
  /** E.164 without +, e.g. 919876543210 */
  readonly VITE_WHATSAPP_ORDER_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
