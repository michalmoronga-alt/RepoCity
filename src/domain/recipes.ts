import type { Placement } from "./layout";

export const KIT_ASSETS = [
  "wall",
  "wall-door",
  "wall-window-small",
  "wall-wood-window-small",
  "roof-point",
  "roof-high-point",
  "roof-gable",
  "chimney",
  "tree",
  "tree-high-round",
  "tree-crooked",
  "rock-small",
  "rock-large",
  "fountain-round",
  "fountain-center",
  "road",
  "road-edge",
  "planks",
  "poles",
  "stall-bench",
  "lantern",
  "wall-window-round",
  "wall-window-stone",
  "wall-wood",
  "stall-green",
  "cart",
  "roof-flat",
] as const;
export type AssetName = (typeof KIT_ASSETS)[number];
export type Tone = "warm" | "stone" | "wood" | "slate" | "brick";
export interface KitPart {
  name: AssetName;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: number;
  tone: Tone;
  buildingId?: string;
}
export function buildingParts(p: Placement, open = false): KitPart[] {
  const output: KitPart[] = [];
  const add = (
    name: AssetName,
    x: number,
    y: number,
    z: number,
    scale: [number, number, number] = [1, 1, 1],
    rotation = 0,
    tone: Tone = "warm",
  ) => {
    const c = Math.cos(p.rotation),
      s = Math.sin(p.rotation);
    output.push({
      name,
      position: [p.x + x * c + z * s, y, p.z - x * s + z * c],
      scale,
      rotation: rotation + p.rotation,
      tone,
      buildingId: p.id,
    });
  };
  const denseRole = p.archetype;
  const walls: AssetName =
    denseRole === "warehouse"
      ? p.variant % 2 === 0
        ? "wall-wood"
        : "wall-wood-window-small"
      : denseRole === "gallery"
        ? "wall-window-round"
        : denseRole === "civic" || denseRole === "tower"
          ? "wall-window-stone"
          : p.variant === 1
            ? "wall-wood-window-small"
            : p.variant === 2
              ? "wall-window-round"
              : "wall-window-small";
  const block = (
    x: number,
    y: number,
    z: number,
    width: number,
    depth: number,
    floors: number,
    roof: AssetName,
    roofY = 1,
  ) => {
    for (let floor = 0; floor < floors; floor++)
      for (let side = 0; side < 4; side++)
        for (let tile = 0; tile < 2; tile++) {
          const rotation = (side * Math.PI) / 2,
            length = side % 2 === 0 ? depth : width,
            across = side % 2 === 0 ? width : depth;
          const localX = across / 2 - 0.5,
            localZ = ((tile - 0.5) * length) / 2;
          const c = Math.cos(rotation),
            s = Math.sin(rotation);
          const name =
            side === 1 && tile === 0 && floor === 0
              ? "wall-door"
              : floor > 0 && denseRole === "house"
                ? "wall-wood-window-small"
                : walls;
          add(
            name,
            x + localX * c + localZ * s,
            y + floor,
            z - localX * s + localZ * c,
            [1, 1, length / 2],
            rotation,
            denseRole === "warehouse"
              ? "wood"
              : denseRole === "civic" || denseRole === "tower"
                ? "stone"
                : "warm",
          );
        }
    const flat = roof === "roof-flat" ? 1.1 : 1;
    add(
      roof,
      x,
      y + floors,
      z,
      [width * flat, roofY, depth * flat],
      0,
      denseRole === "warehouse" || denseRole === "tower" ? "slate" : "brick",
    );
  };
  const roof: AssetName =
    denseRole === "tower"
      ? "roof-high-point"
      : denseRole === "gallery"
        ? "roof-flat"
        : p.variant % 2 === 0
          ? "roof-point"
          : "roof-gable";
  block(
    0,
    0,
    denseRole === "market" ? 0.15 : 0,
    p.width,
    denseRole === "market" ? p.depth - 0.3 : p.depth,
    p.floors,
    roof,
    denseRole === "warehouse" ? 0.65 : 1,
  );
  if (denseRole === "civic")
    block(0, 2, 0.2, 0.8, 0.8, 1, "roof-high-point", 0.65);
  if (denseRole === "market") add("stall-green", 0, 0, -0.55, [0.6, 0.8, 0.6]);
  if (denseRole === "gallery")
    add("stall-bench", 0, 0, -p.depth / 2 + 0.2, [0.45, 0.5, 0.45]);
  if (
    denseRole === "workshop" ||
    denseRole === "house" ||
    denseRole === "office"
  )
    add(
      "chimney",
      p.width * 0.18,
      p.floors + 0.2,
      -p.depth * 0.12,
      [0.4, 0.4, 0.4],
    );
  if (open) {
    for (let side = 0; side < 4; side++)
      add(
        "poles",
        0,
        0,
        0,
        side % 2 === 0
          ? [p.width + 0.5, p.floors + 0.2, p.depth + 0.5]
          : [p.depth + 0.5, p.floors + 0.2, p.width + 0.5],
        (side * Math.PI) / 2,
      );
    add("planks", p.width / 2 + 0.2, 0.8, 0, [0.2, 1, p.depth + 0.4]);
    add("planks", -p.width / 2 - 0.2, 0.8, 0, [0.2, 1, p.depth + 0.4]);
  }
  return output;
}
