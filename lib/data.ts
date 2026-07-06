import type { PrismaClient } from "@prisma/client";
import { calculateLineSubtotal, calculateUnitPrice } from "@/lib/pricing";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl
} from "@/lib/whatsapp";
import {
  demoCategories,
  demoOrders,
  demoProducts,
  demoSettings
} from "@/lib/demo-data";
import type {
  CategoryDTO,
  CustomerDTO,
  OrderDTO,
  ProductDTO,
  ProductVariantDTO,
  StoreSettingDTO
} from "@/types";
import type { CreateOrderInput } from "@/lib/validations";

type ProductQuery = {
  search?: string;
  category?: string;
  sort?: "recent" | "price-asc" | "price-desc";
  activeOnly?: boolean;
};

function money(value: { toNumber(): number } | number | string): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

async function getDb(): Promise<PrismaClient | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

function productFromDb(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  retailPrice: { toNumber(): number };
  wholesalePrice: { toNumber(): number };
  wholesaleMinQuantity: number;
  active: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    active: boolean;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    position: number;
  }>;
  variants: Array<{
    id: string;
    productId: string;
    size: string;
    color: string;
    stock: number;
    sku: string | null;
    imageUrl: string | null;
    active: boolean;
  }>;
}): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    retailPrice: product.retailPrice.toNumber(),
    wholesalePrice: product.wholesalePrice.toNumber(),
    wholesaleMinQuantity: product.wholesaleMinQuantity,
    active: product.active,
    createdAt: product.createdAt.toISOString(),
    category: product.category,
    images: product.images,
    variants: product.variants
  };
}

function applyProductQuery(products: ProductDTO[], query: ProductQuery): ProductDTO[] {
  const search = query.search?.trim().toLowerCase();

  let result = products.filter((product) => {
    const matchesActive = query.activeOnly === false || product.active;
    const matchesCategory = !query.category || product.category.slug === query.category;
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    return matchesActive && matchesCategory && matchesSearch;
  });

  result = [...result].sort((a, b) => {
    if (query.sort === "price-asc") {
      return a.retailPrice - b.retailPrice;
    }

    if (query.sort === "price-desc") {
      return b.retailPrice - a.retailPrice;
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return result;
}

export async function getProductsData(query: ProductQuery = {}): Promise<ProductDTO[]> {
  const db = await getDb();

  if (db) {
    try {
      const products = await db.product.findMany({
        where: {
          active: query.activeOnly === false ? undefined : true,
          category: query.category ? { slug: query.category } : undefined,
          OR: query.search
            ? [
                { name: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } }
              ]
            : undefined
        },
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
          variants: { orderBy: [{ size: "asc" }, { color: "asc" }] }
        },
        orderBy:
          query.sort === "price-asc"
            ? { retailPrice: "asc" }
            : query.sort === "price-desc"
              ? { retailPrice: "desc" }
              : { createdAt: "desc" }
      });

      return products.map(productFromDb);
    } catch {
      return applyProductQuery(demoProducts, query);
    }
  }

  return applyProductQuery(demoProducts, query);
}

export async function getProductBySlugData(slug: string): Promise<ProductDTO | null> {
  const db = await getDb();

  if (db) {
    try {
      const product = await db.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
          variants: { orderBy: [{ size: "asc" }, { color: "asc" }] }
        }
      });

      return product ? productFromDb(product) : null;
    } catch {
      return demoProducts.find((product) => product.slug === slug) ?? null;
    }
  }

  return demoProducts.find((product) => product.slug === slug) ?? null;
}

export async function getCategoriesData(): Promise<CategoryDTO[]> {
  const db = await getDb();

  if (db) {
    try {
      return db.category.findMany({
        where: { active: true },
        orderBy: { name: "asc" }
      });
    } catch {
      return demoCategories;
    }
  }

  return demoCategories;
}

export async function getCustomerByIdData(id: string): Promise<CustomerDTO | null> {
  const db = await getDb();

  if (db) {
    try {
      return await db.customer.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  return null;
}

export async function getSettingsData(): Promise<StoreSettingDTO> {
  const db = await getDb();

  if (db) {
    try {
      const settings = await db.storeSetting.findUnique({ where: { id: "store" } });

      if (settings) {
        return {
          id: settings.id,
          storeName: settings.storeName,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
          facebookUrl: settings.facebookUrl,
          instagramUrl: settings.instagramUrl,
          shippingCost: money(settings.shippingCost),
          orderMessage: settings.orderMessage
        };
      }
    } catch {
      return demoSettings;
    }
  }

  return demoSettings;
}

function findDemoVariant(product: ProductDTO, variantId?: string): ProductVariantDTO {
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants.find((item) => item.active) ??
    product.variants[0];

  if (!variant) {
    throw new Error(`Product ${product.name} has no variants.`);
  }

  return variant;
}

export async function createOrderData(
  input: CreateOrderInput,
  customerId: string
): Promise<OrderDTO> {
  const db = await getDb();
  const settings = await getSettingsData();

  if (db) {
    try {
      await db.customer.update({
        where: { id: customerId },
        data: {
          name: input.customer.name,
          phone: input.customer.phone,
          address: input.customer.address,
          city: input.customer.city,
          notes: input.customer.notes
        }
      });

      const productIds = input.items.map((item) => item.productId);
      const products = await db.product.findMany({
        where: { id: { in: productIds } },
        include: { variants: true }
      });

      const items = input.items.map((item) => {
        const product = products.find((entry) => entry.id === item.productId);

        if (!product) {
          throw new Error("Product not found.");
        }

        const variant =
          product.variants.find((entry) => entry.id === item.productVariantId) ??
          product.variants[0];
        const unitPrice = calculateUnitPrice(
          {
            retailPrice: product.retailPrice,
            wholesalePrice: product.wholesalePrice,
            wholesaleMinQuantity: product.wholesaleMinQuantity
          },
          item.quantity
        );
        const subtotal = calculateLineSubtotal(unitPrice, item.quantity);

        return {
          product,
          variant,
          quantity: item.quantity,
          unitPrice,
          subtotal
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const shippingCost = settings.shippingCost;
      const total = subtotal + shippingCost;

      const order = await db.order.create({
        data: {
          orderNumber: `LL-${Date.now()}`,
          status: "PENDING",
          paymentStatus: "NOT_REQUIRED",
          deliveryMethod: input.deliveryMethod,
          notes: input.notes,
          subtotal,
          shippingCost,
          total,
          customer: {
            connect: { id: customerId }
          },
          items: {
            create: items.map((item) => ({
              productId: item.product.id,
              productVariantId: item.variant?.id,
              productName: item.product.name,
              size: item.variant?.size,
              color: item.variant?.color,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal
            }))
          }
        },
        include: {
          customer: true,
          items: true
        }
      });

      const dto = orderFromDb(order);
      return attachWhatsApp(dto, settings);
    } catch {
      return createDemoOrder(input, settings);
    }
  }

  return createDemoOrder(input, settings);
}

function createDemoOrder(
  input: CreateOrderInput,
  settings: StoreSettingDTO
): OrderDTO {
  const items = input.items.map((item, index) => {
    const product =
      demoProducts.find((entry) => entry.id === item.productId) ?? demoProducts[0];
    const variant = findDemoVariant(product, item.productVariantId);
    const unitPrice = calculateUnitPrice(product, item.quantity);
    const subtotal = calculateLineSubtotal(unitPrice, item.quantity);

    return {
      id: `demo-order-item-${Date.now()}-${index}`,
      productId: product.id,
      productVariantId: variant.id,
      productName: product.name,
      size: variant.size,
      color: variant.color,
      quantity: item.quantity,
      unitPrice,
      subtotal
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCost = settings.shippingCost;
  const order: OrderDTO = {
    id: `demo-order-${Date.now()}`,
    orderNumber: `LL-DEMO-${Date.now()}`,
    customer: {
      id: `demo-customer-${Date.now()}`,
      name: input.customer.name,
      phone: input.customer.phone,
      address: input.customer.address,
      city: input.customer.city,
      notes: input.customer.notes
    },
    status: "PENDING",
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    paymentStatus: "NOT_REQUIRED",
    deliveryMethod: input.deliveryMethod,
    notes: input.notes,
    items,
    createdAt: new Date().toISOString()
  };

  return attachWhatsApp(order, settings);
}

function orderFromDb(order: {
  id: string;
  orderNumber: string;
  status: OrderDTO["status"];
  subtotal: { toNumber(): number };
  shippingCost: { toNumber(): number };
  total: { toNumber(): number };
  paymentStatus: string;
  deliveryMethod: string;
  notes: string | null;
  createdAt: Date;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string | null;
    city: string | null;
    notes: string | null;
  };
  items: Array<{
    id: string;
    productId: string | null;
    productVariantId: string | null;
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    unitPrice: { toNumber(): number };
    subtotal: { toNumber(): number };
  }>;
}): OrderDTO {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.customer,
    status: order.status,
    subtotal: order.subtotal.toNumber(),
    shippingCost: order.shippingCost.toNumber(),
    total: order.total.toNumber(),
    paymentStatus: order.paymentStatus,
    deliveryMethod: order.deliveryMethod,
    notes: order.notes,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productVariantId: item.productVariantId,
      productName: item.productName,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
      subtotal: item.subtotal.toNumber()
    })),
    createdAt: order.createdAt.toISOString()
  };
}

function attachWhatsApp(order: OrderDTO, settings: StoreSettingDTO): OrderDTO {
  const whatsappMessage = buildWhatsAppOrderMessage({
    customerName: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address,
    city: order.customer.city,
    notes: order.notes ?? order.customer.notes,
    deliveryMethod: order.deliveryMethod,
    items: order.items.map((item) => ({
      productName: item.productName,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total
  });

  return {
    ...order,
    whatsappMessage,
    whatsappUrl: settings.whatsappNumber
      ? buildWhatsAppOrderUrl(settings.whatsappNumber, whatsappMessage)
      : undefined
  };
}

export async function getOrdersData(): Promise<OrderDTO[]> {
  const db = await getDb();

  if (db) {
    try {
      const orders = await db.order.findMany({
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" }
      });

      return orders.map(orderFromDb);
    } catch {
      return demoOrders;
    }
  }

  return demoOrders;
}

export async function getOrdersByCustomerIdData(customerId: string): Promise<OrderDTO[]> {
  const db = await getDb();

  if (db) {
    try {
      const orders = await db.order.findMany({
        where: { customerId },
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" }
      });

      return orders.map(orderFromDb);
    } catch {
      return [];
    }
  }

  return [];
}

export async function getOrderByIdData(id: string): Promise<OrderDTO | null> {
  const db = await getDb();

  if (db) {
    try {
      const order = await db.order.findUnique({
        where: { id },
        include: { customer: true, items: true }
      });

      return order ? orderFromDb(order) : null;
    } catch {
      return demoOrders.find((order) => order.id === id) ?? null;
    }
  }

  return demoOrders.find((order) => order.id === id) ?? null;
}
