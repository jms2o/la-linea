"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { calculateLineSubtotal, calculateUnitPrice } from "@/lib/pricing";
import type { CartItem, CartSummary, ProductDTO, ProductVariantDTO } from "@/types";

type AddCartItemInput = {
  product: ProductDTO;
  variant: ProductVariantDTO;
  quantity: number;
};

type CartContextValue = CartSummary & {
  itemCount: number;
  addItem: (input: AddCartItemInput) => void;
  increaseItem: (key: string) => void;
  decreaseItem: (key: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "la-linea-cart";

function getItemKey(item: Pick<CartItem, "productId" | "productVariantId">): string {
  return `${item.productId}:${item.productVariantId ?? "default"}`;
}

function repriceItem(item: CartItem): CartItem {
  const product = {
    retailPrice: item.retailPrice ?? item.unitPrice,
    wholesalePrice: item.wholesalePrice ?? item.unitPrice,
    wholesaleMinQuantity: item.wholesaleMinQuantity ?? Number.MAX_SAFE_INTEGER
  };
  const unitPrice = calculateUnitPrice(product, item.quantity);

  return {
    ...item,
    unitPrice,
    subtotal: calculateLineSubtotal(unitPrice, item.quantity)
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[];
        setItems(parsed.map(repriceItem));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addItem = useCallback((input: AddCartItemInput) => {
    const { product, variant, quantity } = input;
    const unitPrice = calculateUnitPrice(product, quantity);
    const subtotal = calculateLineSubtotal(unitPrice, quantity);
    const imageUrl = variant.imageUrl ?? product.images[0]?.url;

    setItems((current) => {
      const key = getItemKey({
        productId: product.id,
        productVariantId: variant.id
      });
      const existing = current.find((item) => getItemKey(item) === key);

      if (!existing) {
        return [
          ...current,
          {
            productId: product.id,
            productVariantId: variant.id,
            productSlug: product.slug,
            productName: product.name,
            imageUrl,
            size: variant.size,
            color: variant.color,
            quantity,
            unitPrice,
            subtotal,
            retailPrice: product.retailPrice,
            wholesalePrice: product.wholesalePrice,
            wholesaleMinQuantity: product.wholesaleMinQuantity
          }
        ];
      }

      const nextQuantity = existing.quantity + quantity;
      const nextUnitPrice = calculateUnitPrice(product, nextQuantity);

      return current.map((item) =>
        getItemKey(item) === key
          ? {
              ...item,
              quantity: nextQuantity,
              unitPrice: nextUnitPrice,
              subtotal: calculateLineSubtotal(nextUnitPrice, nextQuantity)
            }
          : item
      );
    });
  }, []);

  const increaseItem = useCallback((key: string) => {
    setItems((current) =>
      current.map((item) =>
        getItemKey(item) === key
          ? repriceItem({ ...item, quantity: item.quantity + 1 })
          : item
      )
    );
  }, []);

  const decreaseItem = useCallback((key: string) => {
    setItems((current) =>
      current
        .map((item) =>
          getItemKey(item) === key
            ? repriceItem({ ...item, quantity: item.quantity - 1 })
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => getItemKey(item) !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      shippingCost,
      total,
      itemCount,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart
    };
  }, [addItem, clearCart, decreaseItem, increaseItem, items, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}

export function getCartItemKey(item: Pick<CartItem, "productId" | "productVariantId">) {
  return getItemKey(item);
}
