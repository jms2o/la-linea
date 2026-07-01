import type {
  CategoryDTO,
  OrderDTO,
  ProductDTO,
  StoreSettingDTO
} from "@/types";

export const demoCategories: CategoryDTO[] = [
  { id: "cat-basicas", name: "Basicas", slug: "basicas", active: true },
  { id: "cat-oversize", name: "Oversize", slug: "oversize", active: true },
  { id: "cat-polos", name: "Polos", slug: "polos", active: true }
];

export const demoProducts: ProductDTO[] = [
  {
    id: "prod-basica-blanca",
    name: "Camisa Basica Blanca",
    slug: "camisa-basica-blanca",
    description:
      "Camisa de algodon suave para uso diario. Una pieza limpia para venta individual o paquetes de mayoreo.",
    retailPrice: 220,
    wholesalePrice: 160,
    wholesaleMinQuantity: 12,
    active: true,
    category: demoCategories[0],
    images: [
      {
        id: "img-basica-blanca",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        alt: "Camisa basica blanca",
        position: 1
      }
    ],
    variants: [
      { id: "var-cbb-s", productId: "prod-basica-blanca", size: "S", color: "Blanco", stock: 18, sku: "LL-CBB-S-BLA", active: true },
      { id: "var-cbb-m", productId: "prod-basica-blanca", size: "M", color: "Blanco", stock: 24, sku: "LL-CBB-M-BLA", active: true },
      { id: "var-cbb-l", productId: "prod-basica-blanca", size: "L", color: "Blanco", stock: 20, sku: "LL-CBB-L-BLA", active: true },
      { id: "var-cbb-xl", productId: "prod-basica-blanca", size: "XL", color: "Blanco", stock: 12, sku: "LL-CBB-XL-BLA", active: true }
    ],
    createdAt: "2026-06-30T00:00:00.000Z"
  },
  {
    id: "prod-oversize-negra",
    name: "Camisa Oversize Negra",
    slug: "camisa-oversize-negra",
    description:
      "Corte amplio, caida relajada y color negro profundo para looks urbanos con margen atractivo por volumen.",
    retailPrice: 320,
    wholesalePrice: 240,
    wholesaleMinQuantity: 10,
    active: true,
    category: demoCategories[1],
    images: [
      {
        id: "img-oversize-negra",
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
        alt: "Camisa oversize negra",
        position: 1
      }
    ],
    variants: [
      { id: "var-con-m", productId: "prod-oversize-negra", size: "M", color: "Negro", stock: 20, sku: "LL-CON-M-NEG", active: true },
      { id: "var-con-l", productId: "prod-oversize-negra", size: "L", color: "Negro", stock: 15, sku: "LL-CON-L-NEG", active: true },
      { id: "var-con-xl", productId: "prod-oversize-negra", size: "XL", color: "Negro", stock: 10, sku: "LL-CON-XL-NEG", active: true }
    ],
    createdAt: "2026-06-29T00:00:00.000Z"
  },
  {
    id: "prod-polo-azul",
    name: "Polo Premium Azul",
    slug: "polo-premium-azul",
    description:
      "Polo de textura suave y estructura firme para negocios que buscan un basico con presentacion premium.",
    retailPrice: 380,
    wholesalePrice: 290,
    wholesaleMinQuantity: 8,
    active: true,
    category: demoCategories[2],
    images: [
      {
        id: "img-polo-azul",
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=80",
        alt: "Polo premium azul",
        position: 1
      }
    ],
    variants: [
      { id: "var-ppa-s", productId: "prod-polo-azul", size: "S", color: "Azul", stock: 8, sku: "LL-PPA-S-AZU", active: true },
      { id: "var-ppa-m", productId: "prod-polo-azul", size: "M", color: "Azul", stock: 18, sku: "LL-PPA-M-AZU", active: true },
      { id: "var-ppa-l", productId: "prod-polo-azul", size: "L", color: "Azul", stock: 16, sku: "LL-PPA-L-AZU", active: true }
    ],
    createdAt: "2026-06-28T00:00:00.000Z"
  },
  {
    id: "prod-lino-arena",
    name: "Camisa Lino Arena",
    slug: "camisa-lino-arena",
    description:
      "Camisa ligera con textura natural, pensada para climas calidos y colecciones de temporada.",
    retailPrice: 430,
    wholesalePrice: 330,
    wholesaleMinQuantity: 6,
    active: true,
    category: demoCategories[0],
    images: [
      {
        id: "img-lino-arena",
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        alt: "Camisa lino arena",
        position: 1
      }
    ],
    variants: [
      { id: "var-cla-m", productId: "prod-lino-arena", size: "M", color: "Arena", stock: 7, sku: "LL-CLA-M-ARE", active: true },
      { id: "var-cla-l", productId: "prod-lino-arena", size: "L", color: "Arena", stock: 9, sku: "LL-CLA-L-ARE", active: true }
    ],
    createdAt: "2026-06-27T00:00:00.000Z"
  }
];

export const demoSettings: StoreSettingDTO = {
  id: "store",
  storeName: "La Linea",
  whatsappNumber: "5216140000000",
  address: "Chihuahua, Mexico",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  shippingCost: 0,
  orderMessage: "Hola, quiero confirmar este pedido."
};

export const demoOrders: OrderDTO[] = [
  {
    id: "order-demo-1",
    orderNumber: "LL-DEMO-1001",
    customer: {
      id: "customer-demo-1",
      name: "Cliente Mayoreo",
      phone: "6140000000",
      address: "Zona Centro",
      city: "Chihuahua"
    },
    status: "PENDING",
    subtotal: 1920,
    shippingCost: 0,
    total: 1920,
    paymentStatus: "NOT_REQUIRED",
    deliveryMethod: "WhatsApp",
    notes: "Confirmar colores disponibles.",
    items: [
      {
        id: "order-item-demo-1",
        productId: "prod-basica-blanca",
        productVariantId: "var-cbb-m",
        productName: "Camisa Basica Blanca",
        size: "M",
        color: "Blanco",
        quantity: 12,
        unitPrice: 160,
        subtotal: 1920
      }
    ],
    createdAt: "2026-06-30T16:00:00.000Z"
  }
];
