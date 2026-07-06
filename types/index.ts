export type CartItem = {
  productId: string;
  productVariantId?: string;
  productSlug?: string;
  productName: string;
  imageUrl?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  retailPrice?: number;
  wholesalePrice?: number;
  wholesaleMinQuantity?: number;
};

export type CartSummary = {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export type ProductImageDTO = {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
};

export type ProductVariantDTO = {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  sku?: string | null;
  imageUrl?: string | null;
  active: boolean;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;
  active: boolean;
  category: CategoryDTO;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  createdAt: string;
};

export type StoreSettingDTO = {
  id: string;
  storeName: string;
  whatsappNumber?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  shippingCost: number;
  orderMessage?: string | null;
};

export type CustomerDTO = {
  id: string;
  name: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  phone: string;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
};

export type OrderStatusDTO =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItemDTO = {
  id: string;
  productId?: string | null;
  productVariantId?: string | null;
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  customer: CustomerDTO;
  status: OrderStatusDTO;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: string;
  deliveryMethod: string;
  notes?: string | null;
  items: OrderItemDTO[];
  createdAt: string;
  whatsappUrl?: string;
  whatsappMessage?: string;
};
