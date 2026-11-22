import { SITE } from "@/data/site";

// ---------- Formatage ----------
export const formatPrice = (n) =>
  `${new Intl.NumberFormat("fr-FR").format(Number(n) || 0)} ${SITE.currency}`;

// ============================================================
//  🔒 SÉCURITÉ — tout ce qui vient de l'utilisateur passe ici
// ============================================================

// Nettoie un texte saisi : retire caractères de contrôle, invisibles
// (bidi / zero-width), balises et symboles de code, limite la longueur.
export function sanitizeText(value, max = 80) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, " ")
    .replace(/[<>`${}\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// Numéro ivoirien : 10 chiffres
export function normalizePhone(v) {
  return String(v ?? "")
    .replace(/[^\d+]/g, "")
    .replace(/^(\+|00)225/, "");
}
export const isValidPhoneCI = (v) => /^\d{10}$/.test(normalizePhone(v));

// Quantité toujours entière et bornée
export const clampQty = (q) => Math.min(10, Math.max(1, Math.trunc(Number(q)) || 1));

// Message de commande (les prix viennent TOUJOURS du catalogue, jamais du navigateur)
export function buildOrderMessage(lines, customer) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const rows = lines.map(
    (l) => `• ${l.product.name} — T.${l.size} × ${l.qty} — ${formatPrice(l.product.price * l.qty)}`
  );
  return [
    `🔥 Nouvelle commande ${SITE.name}`,
    "",
    ...rows,
    "",
    `Total : ${formatPrice(total)}`,
    "",
    `Nom : ${customer.name}`,
    `Tél : ${customer.phone}`,
    `Commune : ${customer.zone}`,
    `Adresse / repère : ${customer.address}`,
    "",
    "Paiement à la livraison.",
  ].join("\n");
}

export function buildWhatsAppUrl(number, text) {
  const digits = String(number ?? "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}