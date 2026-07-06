import { UserRole } from "@prisma/client";
import { hashPassword } from "../lib/auth";
import { prisma } from "../lib/prisma";

const categories = [
  { name: "Basicas", slug: "basicas" },
  { name: "Oversize", slug: "oversize" },
  { name: "Polos", slug: "polos" }
];

const products = [
  {
    name: "Camisa Basica Blanca",
    slug: "camisa-basica-blanca",
    description: "Camisa de algodon para uso diario, ideal para menudeo y paquetes de mayoreo.",
    retailPrice: "220.00",
    wholesalePrice: "160.00",
    wholesaleMinQuantity: 12,
    categorySlug: "basicas",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        alt: "Camisa basica blanca",
        position: 1
      }
    ],
    variants: [
      { size: "S", color: "Blanco", stock: 18, sku: "LL-CBB-S-BLA" },
      { size: "M", color: "Blanco", stock: 24, sku: "LL-CBB-M-BLA" },
      { size: "L", color: "Blanco", stock: 20, sku: "LL-CBB-L-BLA" },
      { size: "XL", color: "Blanco", stock: 12, sku: "LL-CBB-XL-BLA" }
    ]
  },
  {
    name: "Camisa Oversize Negra",
    slug: "camisa-oversize-negra",
    description: "Camisa oversize con corte amplio y color negro, pensada para looks urbanos.",
    retailPrice: "320.00",
    wholesalePrice: "240.00",
    wholesaleMinQuantity: 10,
    categorySlug: "oversize",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        alt: "Camisa oversize negra",
        position: 1
      }
    ],
    variants: [
      { size: "M", color: "Negro", stock: 20, sku: "LL-CON-M-NEG" },
      { size: "L", color: "Negro", stock: 15, sku: "LL-CON-L-NEG" },
      { size: "XL", color: "Negro", stock: 10, sku: "LL-CON-XL-NEG" }
    ]
  },
  {
    name: "Polo Premium Azul",
    slug: "polo-premium-azul",
    description: "Polo de tela suave con acabado premium para venta individual o paquetes.",
    retailPrice: "380.00",
    wholesalePrice: "290.00",
    wholesaleMinQuantity: 8,
    categorySlug: "polos",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
        alt: "Polo premium azul",
        position: 1
      }
    ],
    variants: [
      { size: "S", color: "Azul", stock: 8, sku: "LL-PPA-S-AZU" },
      { size: "M", color: "Azul", stock: 18, sku: "LL-PPA-M-AZU" },
      { size: "L", color: "Azul", stock: 16, sku: "LL-PPA-L-AZU" }
    ]
  },
  {
    name: "Camisa Lino Arena",
    slug: "camisa-lino-arena",
    description: "Camisa ligera con textura natural, pensada para climas calidos y colecciones de temporada.",
    retailPrice: "430.00",
    wholesalePrice: "330.00",
    wholesaleMinQuantity: 6,
    categorySlug: "basicas",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
        alt: "Camisa lino arena",
        position: 1
      }
    ],
    variants: [
      { size: "M", color: "Arena", stock: 7, sku: "LL-CLA-M-ARE" },
      { size: "L", color: "Arena", stock: 9, sku: "LL-CLA-L-ARE" }
    ]
  }
];

async function main() {
  await prisma.storeSetting.upsert({
    where: { id: "store" },
    create: {
      id: "store",
      storeName: process.env.NEXT_PUBLIC_STORE_NAME ?? "La Linea",
      whatsappNumber: process.env.STORE_WHATSAPP_NUMBER ?? "",
      address: "",
      shippingCost: "0.00",
      orderMessage: "Hola, quiero confirmar este pedido."
    },
    update: {
      storeName: process.env.NEXT_PUBLIC_STORE_NAME ?? "La Linea",
      whatsappNumber: process.env.STORE_WHATSAPP_NUMBER ?? ""
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@lalinea.local" },
    create: {
      name: "Admin La Linea",
      email: "admin@lalinea.local",
      password: await hashPassword("password123"),
      role: UserRole.SUPER_ADMIN
    },
    update: {
      name: "Admin La Linea",
      role: UserRole.SUPER_ADMIN
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        active: true
      }
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug }
    });

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        wholesaleMinQuantity: product.wholesaleMinQuantity,
        categoryId: category.id,
        active: true
      },
      update: {
        name: product.name,
        description: product.description,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        wholesaleMinQuantity: product.wholesaleMinQuantity,
        categoryId: category.id,
        active: true
      }
    });

    await prisma.productImage.deleteMany({
      where: { productId: savedProduct.id }
    });

    await prisma.productImage.createMany({
      data: product.images.map((image) => ({
        ...image,
        productId: savedProduct.id
      }))
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: {
          productId_size_color: {
            productId: savedProduct.id,
            size: variant.size,
            color: variant.color
          }
        },
        create: {
          ...variant,
          productId: savedProduct.id,
          active: true
        },
        update: {
          stock: variant.stock,
          sku: variant.sku,
          active: true
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
