import assert from "node:assert/strict";
import { Box3, Matrix4, Quaternion, Vector3 } from "three";

// Decode real vertex buffers and node transforms, rather than trusting metadata.
export function vertexBounds(data, doc) {
  const binStart = 20 + data.readUInt32LE(12) + 8;
  const bounds = new Box3();
  const visit = (index, parent) => {
    const node = doc.nodes[index];
    const local = node.matrix
      ? new Matrix4().fromArray(node.matrix)
      : new Matrix4().compose(
          new Vector3(...(node.translation ?? [0, 0, 0])),
          new Quaternion(...(node.rotation ?? [0, 0, 0, 1])),
          new Vector3(...(node.scale ?? [1, 1, 1])),
        );
    const world = parent.clone().multiply(local);
    if (node.mesh !== undefined)
      for (const primitive of doc.meshes[node.mesh].primitives) {
        const accessor = doc.accessors[primitive.attributes.POSITION];
        assert.equal(accessor.componentType, 5126);
        assert.equal(accessor.type, "VEC3");
        assert(!accessor.sparse);
        const view = doc.bufferViews[accessor.bufferView];
        for (let i = 0; i < accessor.count; i++) {
          const offset =
            binStart +
            (view.byteOffset ?? 0) +
            (accessor.byteOffset ?? 0) +
            i * (view.byteStride ?? 12);
          const vertex = new Vector3(
            ...[0, 4, 8].map((axis) => data.readFloatLE(offset + axis)),
          ).applyMatrix4(world);
          assert(vertex.toArray().every(Number.isFinite));
          bounds.expandByPoint(vertex);
        }
      }
    for (const child of node.children ?? []) visit(child, world);
  };
  for (const node of doc.scenes[doc.scene ?? 0].nodes)
    visit(node, new Matrix4());
  assert(!bounds.isEmpty());
  return bounds;
}
