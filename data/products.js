// ============================================================
//  ✏️  PRODUITS — ajoute / modifie / supprime tes articles ICI
//  Les images vont dans /public/images/... (voir LISEZ-MOI.md)
//  Conseil : PNG ou WebP à FOND TRANSPARENT, 1200px de large.
//  Si une image est introuvable, une image par défaut s'affiche.
// ============================================================

// ---------- BASKETS ----------
// id    : identifiant UNIQUE, en minuscules, sans espace ni point (ex: "air-jordan")
// image : doit être identique au nom du fichier dans public/images/sneakers/ (minuscules)
export const SNEAKERS = [
  {
    id: "flame-runner",
    name: "Flame Runner",
    category: "Running",
    price: 45000,
    accent: "#E10F1F", // couleur du grand cercle derrière la basket
    badge: "Nouveau",
    image: "/images/sneakers/flame-runner.png",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: "lebron-witness-9",
    name: "LeBron Witness 9",
    category: "Lifestyle",
    price: 52000,
    accent: "#B30F1A",
    image: "/images/sneakers/lebron-witness-9.png",
    sizes: [39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: "jordan-luka-4",
    name: "Jordan Luka 4",
    category: "Montante",
    price: 58000,
    accent: "#FF4B2B",
    badge: "Populaire",
    image: "/images/sneakers/jordan-luka-4.png",
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },
  {
    id: "air-jordan",
    name: "Air Jordan",
    category: "Lifestyle",
    price: 48000,
    accent: "#C8102E",
    image: "/images/sneakers/air-jordan.png",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: "giannis-immortality-5",
    name: "Giannis Immortality 5",
    category: "Édition limitée",
    price: 65000,
    accent: "#7A0A12",
    badge: "Limité",
    image: "/images/sneakers/giannis-immortality-5.png",
    sizes: [40, 41, 42, 43, 44],
  },
  {
    id: "irving-shoes",
    name: "Irving Shoes",
    category: "Running",
    price: 55000,
    accent: "#E8321A",
    image: "/images/sneakers/irving-shoes.png",
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
  },
];

// ---------- VÊTEMENTS ----------
const TAILLES = ["S", "M", "L", "XL"];

export const CLOTHES = [
  { id: "hoodie-braise", name: "Hoodie Braise", category: "Hauts", price: 25000, accent: "#E10F1F", badge: "Best-seller", image: "/images/clothes/hoodie-braise.png", sizes: TAILLES },
  { id: "tee-oversize", name: "T-shirt Oversize", category: "Hauts", price: 12000, accent: "#0E0E10", image: "/images/clothes/tee-oversize.png", sizes: TAILLES },
  { id: "cargo-street", name: "Cargo Street", category: "Bas", price: 28000, accent: "#B30F1A", image: "/images/clothes/cargo-street.png", sizes: TAILLES },
  { id: "veste-vent", name: "Veste Coupe-vent", category: "Hauts", price: 35000, accent: "#FF4B2B", badge: "Nouveau", image: "/images/clothes/veste-vent.png", sizes: TAILLES },
  { id: "short-sport", name: "Short Sport", category: "Bas", price: 15000, accent: "#C8102E", image: "/images/clothes/short-sport.png", sizes: TAILLES },
  { id: "casquette-b", name: "Casquette B", category: "Accessoires", price: 8000, accent: "#7A0A12", image: "/images/clothes/casquette-b.png", sizes: ["Unique"] },
];

// ---------- LOOKS (section « Essaie le look ») ----------
// image = photo/silhouette de la tenue (PNG fond transparent, format portrait)
// items = ids des produits (basket + vêtements ci-dessus)
export const LOOKS = [
  { id: "look-1", name: "Look Plateau", image: "/images/looks/look-1.png", items: ["jordan-luka-4", "hoodie-braise", "cargo-street"] },
  { id: "look-2", name: "Look Cocody Weekend", image: "/images/looks/look-2.png", items: ["air-jordan", "tee-oversize", "short-sport"] },
  { id: "look-3", name: "Look Night Marcory", image: "/images/looks/look-3.png", items: ["lebron-witness-9", "veste-vent", "cargo-street", "casquette-b"] },
  { id: "look-4", name: "Look Run Riviera", image: "/images/looks/look-4.png", items: ["flame-runner", "tee-oversize", "short-sport"] },
];

// ---------- Outils (ne pas modifier) ----------
export const CATALOG = [...SNEAKERS, ...CLOTHES];
export const BY_ID = Object.fromEntries(CATALOG.map((p) => [p.id, p]));