export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const storeEnv = {
  get whatsappNumber() {
    return getOptionalEnv("STORE_WHATSAPP_NUMBER");
  },
  get storeName() {
    return getOptionalEnv("NEXT_PUBLIC_STORE_NAME", "La Linea");
  }
};
