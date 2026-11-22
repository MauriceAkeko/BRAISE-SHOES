// ============================================================
//  🧩 ASSEMBLE LES LOOKS AUTOMATIQUEMENT
//  Lit les looks dans data/products.js, empile les photos détourées
//  des articles (casquette → haut → bas → basket) et enregistre
//  public/images/looks/look-1.png, look-2.png, …
//
//  Utilisation (depuis la racine du projet) :
//     npm install -D sharp          (une seule fois)
//     node scripts/build-looks.mjs                → tous les looks
//     node scripts/build-looks.mjs look-2         → un seul look
//
//  ⚠️ Les photos des articles doivent être en PNG/WebP à FOND TRANSPARENT.
// ============================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("❌ La librairie « sharp » est absente. Lance :  npm install -D sharp");
  process.exit(1);
}

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC, "images", "looks");

// ---------- Réglages (modifie ici si besoin) ----------
const WIDTH = 600;            // largeur de l'image finale (px)
const HEIGHT = 1400;          // hauteur de l'image finale (px)
const PADDING = 30;           // marge autour de la tenue (px)
const GAP = 14;               // espace entre deux pièces (px)
// Part de hauteur de chaque pièce dans le look (ordre = de haut en bas)
const ROLES = [
  { role: "accessoire", weight: 0.14 },
  { role: "haut",       weight: 0.34 },
  { role: "bas",        weight: 0.34 },
  { role: "basket",     weight: 0.18 },
];

// ---------- Lecture de data/products.js (copié en .mjs temporaire) ----------
const src = fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8");
const tmp = path.join(os.tmpdir(), `products-${process.pid}.mjs`);
fs.writeFileSync(tmp, src);
const { SNEAKERS, CLOTHES, LOOKS, BY_ID } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

const sneakerIds = new Set(SNEAKERS.map((s) => s.id));
const roleOf = (p) => {
  if (sneakerIds.has(p.id)) return "basket";
  if (p.category === "Accessoires") return "accessoire";
  if (p.category === "Bas") return "bas";
  return "haut";
};

// ---------- Outils ----------
async function loadTrimmed(file) {
  const input = sharp(file).ensureAlpha();
  try {
    return await input.clone().trim({ threshold: 10 }).png().toBuffer();
  } catch {
    return await input.png().toBuffer(); // pas de recadrage possible
  }
}

async function buildLook(look) {
  // 1. Regrouper les articles par rôle
  const groups = {};
  for (const id of look.items) {
    const p = BY_ID[id];
    if (!p) { console.warn(`  ⚠️  ${look.id}: article inconnu « ${id} » (ignoré)`); continue; }
    const file = path.join(PUBLIC, p.image.replace(/^\//, ""));
    if (!fs.existsSync(file)) { console.warn(`  ⚠️  ${look.id}: image manquante ${p.image} (ignorée)`); continue; }
    (groups[roleOf(p)] ||= []).push({ p, file });
  }
  const present = ROLES.filter((r) => groups[r.role]);
  if (!present.length) { console.warn(`  ⏭️  ${look.id}: aucune image disponible, look ignoré`); return false; }

  // 2. Répartir la hauteur disponible entre les rôles présents
  const slots = present.reduce((n, r) => n + groups[r.role].length, 0);
  const usable = HEIGHT - 2 * PADDING - GAP * (slots - 1);
  const totalWeight = present.reduce((s, r) => s + r.weight, 0);

  const layers = [];
  let y = PADDING;
  for (const r of present) {
    const items = groups[r.role];
    const roleH = (usable * r.weight) / totalWeight;
    const boxH = Math.floor(roleH / items.length);
    for (const it of items) {
      const buf = await loadTrimmed(it.file);
      const { data, info } = await sharp(buf)
        .resize({ width: WIDTH - 2 * PADDING, height: boxH, fit: "inside", withoutEnlargement: false })
        .toBuffer({ resolveWithObject: true });
      layers.push({
        input: data,
        left: Math.round((WIDTH - info.width) / 2),
        top: Math.round(y + (boxH - info.height) / 2),
      });
      y += boxH + GAP;
    }
  }

  // 3. Canevas transparent + export PNG
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, `${look.id}.png`);
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ✅ ${look.id} → ${path.relative(ROOT, out)}  (${layers.length} pièce${layers.length > 1 ? "s" : ""})`);
  return true;
}

// ---------- Lancement ----------
const only = process.argv[2];
const list = only ? LOOKS.filter((l) => l.id === only) : LOOKS;
if (!list.length) { console.error(`❌ Look « ${only} » introuvable dans data/products.js`); process.exit(1); }

console.log(`🧩 Assemblage de ${list.length} look(s)…`);
let ok = 0;
for (const look of list) if (await buildLook(look)) ok++;
console.log(`\nTerminé : ${ok}/${list.length} look(s) créé(s).`);