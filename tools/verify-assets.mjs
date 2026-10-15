import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { vertexBounds } from "./gltf-bounds.mjs";

const root = new URL("../public/kit/", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("manifest.json", root), "utf8"),
);
assert.equal(manifest.license, "CC0-1.0");
assert.match(await readFile(new URL("License.txt", root), "utf8"), /CC0/);
const tracked = new Set(manifest.files.map((f) => f.path));
const bounds = new Map();
for (const entry of manifest.files) {
  const data = await readFile(new URL(entry.path, root));
  assert.equal(data.length, entry.bytes);
  assert.equal(
    createHash("sha256").update(data).digest("hex"),
    entry.sha256,
    entry.path,
  );
  if (entry.path.endsWith(".glb")) {
    assert.equal(data.toString("ascii", 0, 4), "glTF");
    const doc = JSON.parse(
      data.toString("utf8", 20, 20 + data.readUInt32LE(12)),
    );
    bounds.set(entry.path, vertexBounds(data, doc));
    for (const image of doc.images ?? [])
      if (image.uri) assert(tracked.has(image.uri), `Missing ${image.uri}`);
    for (const buffer of doc.buffers)
      assert(!buffer.uri, "Unreviewed external buffer");
  }
}
for (const name of [
  "wall-door",
  "wall-window-small",
  "wall-wood-window-small",
  "wall-window-round",
  "wall-window-stone",
  "wall-wood",
]) {
  const box = bounds.get(`${name}.glb`);
  assert(
    Math.abs(box.min.y) < 1e-5 && Math.abs(box.max.y - 1) < 1e-5,
    `${name}: floor contact/height`,
  );
  // Upper wooden facades deliberately protrude .05 for their timber trim.
  const outerFace =
    name === "wall-wood-window-small"
      ? 0.55
      : name === "wall-window-stone"
        ? 0.525
        : 0.5;
  assert(
    Math.abs(box.max.x - outerFace) < 1e-5 &&
      Math.abs(box.min.z + 0.5) < 1e-5 &&
      Math.abs(box.max.z - 0.5) < 1e-5,
    `${name}: facade anchors`,
  );
}
for (const name of [
  "roof-point",
  "roof-high-point",
  "roof-gable",
  "roof-flat",
]) {
  const box = bounds.get(`${name}.glb`);
  assert(Math.abs(box.min.y) < 1e-5, `${name}: roof base must meet top floor`);
  assert(
    box.min.x <= -0.5 &&
      box.max.x >= 0.5 &&
      box.min.z <= -0.5 &&
      box.max.z >= 0.5,
    `${name}: roof must cover walls after recipe scaling`,
  );
}
for (const entry of await readdir(root))
  if (entry.endsWith(".glb"))
    assert(tracked.has(entry), `Unregistered asset ${entry}`);
console.log(
  `Asset provenance/hashes/dependencies OK: ${manifest.files.length} files; decoded vertices and wall/roof contact anchors OK.`,
);
