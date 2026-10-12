import type { CityMap } from "./map";

export const GENERATOR_VERSION = "authored-neighborhoods-1";
export const CATALOG_VERSION = "kenney-fantasy-town-2.0-recipes-1";
export const CITY_SEED = "repocity-classic-001";
export const DISTRICT_SLOTS: [number, number][] = [
  [-4.8, -5.3],
  [4, -5],
  [6, 1.7],
  [0.7, 6],
  [-5.8, 2.8],
];
export interface Placement {
  id: string;
  districtId: string;
  x: number;
  z: number;
  variant: number;
  floors: 1 | 2;
  width: number;
  depth: number;
}
function hash(value: string) {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
export function createLayout(map: CityMap, seed = CITY_SEED): Placement[] {
  return [...map.districts]
    .sort((a, b) => a.id.localeCompare(b.id))
    .flatMap((district, index) => {
      const [x, z] = DISTRICT_SLOTS[index];
      return map.buildings
        .filter((b) => b.districtId === district.id)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((b, slot) => {
          const variant = hash(`${seed}:${b.id}`) % 4;
          return {
            id: b.id,
            districtId: district.id,
            x: x + (slot === 0 ? -1.55 : slot === 1 ? 1.55 : 0),
            z: z + (slot === 2 ? -3 : 0),
            variant,
            floors: variant === 1 ? 2 : 1,
            width: 2,
            depth: variant === 3 ? 1.5 : 2,
          };
        });
    });
}
