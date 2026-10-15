export const ARCHETYPES = [
  "house",
  "workshop",
  "warehouse",
  "office",
  "tower",
  "gallery",
  "market",
  "civic",
] as const;
export type Archetype = (typeof ARCHETYPES)[number];
export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  house: "Dom",
  workshop: "Dielňa",
  warehouse: "Sklad",
  office: "Kancelária",
  tower: "Veža",
  gallery: "Ateliér",
  market: "Obchodný dom",
  civic: "Verejná budova",
};
