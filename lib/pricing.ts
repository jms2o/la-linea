export type MoneyInput =
  | number
  | string
  | {
      toNumber(): number;
    };

export type PriceableProduct = {
  retailPrice: MoneyInput;
  wholesalePrice: MoneyInput;
  wholesaleMinQuantity: number;
};

export type PriceTier = {
  minQuantity: number;
  unitPrice: MoneyInput;
};

function toNumber(value: MoneyInput): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

export function calculateUnitPrice(
  product: PriceableProduct,
  quantity: number,
  tiers: PriceTier[] = []
): number {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  const matchedTier = [...tiers]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((tier) => quantity >= tier.minQuantity);

  if (matchedTier) {
    return toNumber(matchedTier.unitPrice);
  }

  if (quantity >= product.wholesaleMinQuantity) {
    return toNumber(product.wholesalePrice);
  }

  return toNumber(product.retailPrice);
}

export function calculateLineSubtotal(unitPrice: MoneyInput, quantity: number): number {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  return toNumber(unitPrice) * quantity;
}
