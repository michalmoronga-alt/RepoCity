import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Box3, Matrix4, Quaternion, Vector3 } from "three";
import { parseMap } from "../src/domain/map";
import { ARCHETYPES } from "../src/domain/archetypes";
import {
  ARCHETYPE_SIZE,
  createLayout,
  type Placement,
} from "../src/domain/layout";
import { buildingParts } from "../src/domain/recipes";
import { vertexBounds } from "../tools/gltf-bounds.mjs";

const raw = JSON.parse(
  await readFile(
    new URL("../examples/maps/sample-dense-office.json", import.meta.url),
    "utf8",
  ),
);
const map = parseMap(raw);
const layout = createLayout(map);
const assets = new Map<string, Box3>();
async function bounds(name: string) {
  if (assets.has(name)) return assets.get(name)!;
  const data = await readFile(
    new URL("../public/kit/" + name + ".glb", import.meta.url),
  );
  const doc = JSON.parse(data.toString("utf8", 20, 20 + data.readUInt32LE(12)));
  const box = vertexBounds(data, doc);
  assets.set(name, box);
  return box;
}
test("fifty independently named functions have varied silhouettes and remain stable under relabeling", () => {
  assert.equal(map.buildings.length, 50);
  assert.equal(new Set(layout.map((p) => p.archetype)).size, 8);
  assert(
    new Set(layout.map((p) => `${p.width}/${p.depth}/${p.height}`)).size >= 7,
  );
  assert.deepEqual(
    createLayout({
      ...map,
      buildings: [...map.buildings]
        .reverse()
        .map((b) => ({ ...b, label: "Premenované" })),
      districts: [...map.districts].reverse(),
    }),
    layout,
  );
});
test("dense lots remain separated even when all sixty buildings use the largest footprints", () => {
  const expanded = {
    ...map,
    buildings: map.districts.flatMap((d) =>
      Array.from({ length: 12 }, (_, i) => ({
        ...map.buildings[0],
        id: d.id + "-" + i,
        districtId: d.id,
        archetype: "warehouse" as const,
      })),
    ),
  };
  const placements = createLayout(expanded).map((p) => ({
    ...p,
    width: Math.max(...Object.values(ARCHETYPE_SIZE).map((size) => size.width)),
    depth: Math.max(...Object.values(ARCHETYPE_SIZE).map((size) => size.depth)),
  }));
  for (let i = 0; i < placements.length; i++)
    for (let j = i + 1; j < placements.length; j++) {
      const a = placements[i],
        b = placements[j];
      assert(
        Math.abs(a.x - b.x) > (a.width + b.width) / 2 + 0.4 ||
          Math.abs(a.z - b.z) > (a.depth + b.depth) / 2 + 0.4,
        `${a.id} overlaps ${b.id}`,
      );
    }
});
test("large maps require explicit migration and reject unsupported archetypes or overfull districts", () => {
  assert.throws(() => parseMap({ ...raw, layoutProfile: "compact" }));
  assert.throws(() => parseMap({ ...raw, layoutProfile: "other" }));
  assert.throws(() =>
    parseMap({
      ...raw,
      buildings: raw.buildings.map((b: unknown, i: number) =>
        i ? b : { ...(b as object), archetype: "unknown" },
      ),
    }),
  );
  assert.throws(() =>
    parseMap({
      ...raw,
      buildings: raw.buildings.map((b: object) => ({
        ...b,
        districtId: raw.districts[0].id,
      })),
    }),
  );
});
test("assembled recipes use real asset geometry, meet the ground, and fit their reserved envelopes", async () => {
  for (const archetype of ARCHETYPES)
    for (const rotation of [0, Math.PI])
      for (let variant = 0; variant < 4; variant++) {
        const p: Placement = {
          id: "test",
          districtId: "district",
          x: 2,
          z: -3,
          rotation,
          variant,
          archetype,
          ...ARCHETYPE_SIZE[archetype],
        };
        const union = new Box3();
        for (const part of buildingParts(p)) {
          const matrix = new Matrix4().compose(
            new Vector3(...part.position),
            new Quaternion().setFromAxisAngle(
              new Vector3(0, 1, 0),
              part.rotation,
            ),
            new Vector3(...part.scale),
          );
          const box = (await bounds(part.name)).clone().applyMatrix4(matrix);
          assert(box.min.y >= -1e-5, `${archetype}/${part.name} underground`);
          union.union(box);
        }
        assert(Math.abs(union.min.y) < 1e-5, `${archetype} floats`);
        assert(
          union.max.y <= p.height + 0.01,
          `${archetype} exceeds declared height`,
        );
        assert(
          union.min.x >= p.x - p.width / 2 - 0.2 &&
            union.max.x <= p.x + p.width / 2 + 0.2,
          `${archetype} exceeds reserved width`,
        );
        assert(
          union.min.z >= p.z - p.depth / 2 - 0.2 &&
            union.max.z <= p.z + p.depth / 2 + 0.2,
          `${archetype} exceeds reserved depth`,
        );
      }
});
