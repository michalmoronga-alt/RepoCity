import type { CityMap } from "./map";
import type { Archetype } from "./archetypes";

export const GENERATOR_VERSION = "authored-neighborhoods-3";
export const CATALOG_VERSION = "kenney-fantasy-town-2.0-recipes-2";
export const CITY_SEED = "repocity-classic-001";
export const DISTRICT_SLOTS: [number, number][] = [
  [-4.8, -5.3],
  [4, -5],
  [6, 1.7],
  [0.7, 6],
  [-5.8, 2.8],
];
export const DENSE_DISTRICT_SLOTS: [number, number][] = [
  [-11.5, -7.3],
  [0, -7.3],
  [11.5, -7.3],
  [-5.8, 9.2],
  [6.4, 9.2],
];
export function districtSlots(map: CityMap) {
  return map.layoutProfile === "dense" ? DENSE_DISTRICT_SLOTS : DISTRICT_SLOTS;
}
export const ARCHETYPE_SIZE: Record<
  Archetype,
  { width: number; depth: number; floors: 1 | 2 | 3; height: number }
> = {
  house: { width: 1.7, depth: 1.6, floors: 1, height: 1.65 },
  workshop: { width: 2.1, depth: 1.65, floors: 1, height: 1.8 },
  warehouse: { width: 2.6, depth: 1.8, floors: 1, height: 1.65 },
  office: { width: 1.85, depth: 1.6, floors: 2, height: 2.7 },
  tower: { width: 1.2, depth: 1.2, floors: 3, height: 4.05 },
  gallery: { width: 2.3, depth: 1.4, floors: 1, height: 1.65 },
  market: { width: 2.15, depth: 1.7, floors: 1, height: 1.8 },
  civic: { width: 2.2, depth: 2, floors: 2, height: 3.7 },
};
export interface Placement {
  id: string;
  districtId: string;
  x: number;
  z: number;
  variant: number;
  floors: 1 | 2 | 3;
  width: number;
  depth: number;
  height: number;
  archetype: Archetype;
  rotation: number;
}
function hash(value: string) {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
// IDs must sort identically across operating-system languages.
export function compareIds(a: { id: string }, b: { id: string }) {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
export function createLayout(map: CityMap, seed = CITY_SEED): Placement[] {
  return [...map.districts].sort(compareIds).flatMap((district, index) => {
    const [x, z] = districtSlots(map)[index];
    const members = map.buildings
      .filter((b) => b.districtId === district.id)
      .sort(compareIds);
    return members.map((b, slot) => {
      const variant = hash(`${seed}:${b.id}`) % 4;
      if (map.layoutProfile === "dense")
        return {
          id: b.id,
          districtId: district.id,
          x: x + ((slot % 3) - 1) * 3.7,
          z:
            z +
            (Math.floor(slot / 3) - (Math.ceil(members.length / 3) - 1) / 2) *
              3.5,
          variant,
          archetype: b.archetype,
          rotation: slot % 2 === 0 ? 0 : Math.PI,
          ...ARCHETYPE_SIZE[b.archetype],
        };
      return {
        id: b.id,
        districtId: district.id,
        x: x + (slot === 0 ? -1.55 : slot === 1 ? 1.55 : 0),
        z: z + (slot === 2 ? -3 : 0),
        variant,
        floors: variant === 1 ? 2 : 1,
        width: 2,
        depth: variant === 3 ? 1.5 : 2,
        height: (variant === 1 ? 2 : 1) + 1,
        archetype: b.archetype,
        rotation: 0,
      };
    });
  });
}
