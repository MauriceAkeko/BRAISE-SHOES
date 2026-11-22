import { SITE } from "@/data/site";
import { SNEAKERS, CLOTHES } from "@/data/products";

// Données structurées pour Google (boutique + produits avec prix)
export default function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      logo: `${SITE.url}/icon-512.png`,
      image: `${SITE.url}/opengraph-image.png`,
      telephone: `+${SITE.whatsapp}`,
      email: SITE.email,
      address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
      areaServed: "Abidjan",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [...SNEAKERS, ...CLOTHES].map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          category: p.category,
          image: `${SITE.url}${p.image}`,
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "XOF",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}