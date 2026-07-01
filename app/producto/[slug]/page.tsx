import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getProductBySlugData,
  getProductsData,
  getSettingsData
} from "@/lib/data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugData(slug);

  if (!product) {
    return {
      title: "Producto no encontrado"
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : undefined
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings, products] = await Promise.all([
    getProductBySlugData(slug),
    getSettingsData(),
    getProductsData({ activeOnly: true })
  ]);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((item) => item.id !== product.id && item.category.slug === product.category.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} settings={settings} />
        {related.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-normal">
              Productos relacionados
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
