export default function manifest() {
  return {
    name: "BRAISE — Sneakers Abidjan",
    short_name: "BRAISE",
    description: "Boutique de baskets et streetwear à Abidjan. Livraison rapide.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F2EB",
    theme_color: "#E10F1F",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}