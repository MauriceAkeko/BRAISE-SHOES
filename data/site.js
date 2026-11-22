// ============================================================
//  ✏️  CONFIG DU SITE — modifie ICI le nom, slogan, contact...
// ============================================================
export const SITE = {
  name: "BRAISE",                       // nom de la boutique
  tagline: "Sneakers Abidjan",
  slogan: "Marche en feu.",
  description:
    "Boutique de baskets à Abidjan : nouveautés, éditions limitées et streetwear. Livraison rapide dans toutes les communes.",

  // Adresse du site (sans "/" à la fin). Change-la quand le client aura son vrai domaine.
  // Elle sert au référencement Google (sitemap, robots, image de partage).
  url: "https://braise-shoes.vercel.app",

  // Mots-clés pour le référencement
  keywords: [
    "sneakers Abidjan",
    "baskets Abidjan",
    "streetwear Côte d'Ivoire",
    "boutique chaussures Abidjan",
    "Jordan",
    "LeBron",
  ],

  // Ton logo : dépose-le dans /public/images/ (svg, png ou webp) puis change le nom ici
  logo: "/images/logo.png",

  // Numéro WhatsApp de la boutique : format international SANS le "+" (ex: 225 07 00 00 00 00)
  whatsapp: "2250507189082",
  instagram: "https://instagram.com/",  // remplace par ton lien
  email: "contact@braise-sneakers.ci",

  currency: "FCFA",

  // Communes proposées dans le formulaire de commande
  deliveryZones: [
    "Cocody", "Plateau", "Marcory", "Treichville", "Koumassi",
    "Port-Bouët", "Yopougon", "Abobo", "Adjamé", "Attécoubé",
    "Riviera", "Angré", "Bingerville", "Songon",
  ],

  // Bandeau défilant
  marquee: [
    "Livraison à Abidjan en 24h",
    "Paiement à la livraison",
    "Nouveautés chaque semaine",
    "Éditions limitées",
    "Échange sous 7 jours",
  ],
};