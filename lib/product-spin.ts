export function getProductSpinColor(productName: string, fallback?: string | null) {
  const source = `${productName} ${fallback ?? ""}`.toLowerCase();

  if (source.includes("negro") || source.includes("black")) return "#171717";
  if (source.includes("azul") || source.includes("blue")) return "#1e3a8a";
  if (source.includes("arena") || source.includes("beige")) return "#c8a96a";
  if (source.includes("blanco") || source.includes("white")) return "#f4f1ea";
  if (source.includes("gris") || source.includes("gray")) return "#8a8a8a";

  return "#f4f1ea";
}
