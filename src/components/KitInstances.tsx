import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";
import { type KitPart } from "../domain/recipes";

const COLORS = {
  warm: "#e7d9c1",
  stone: "#dedfcd",
  wood: "#bdac8c",
  slate: "#737f7a",
  brick: "#ac604b",
};
export default function KitInstances({
  parts,
  onSelect,
}: {
  parts: KitPart[];
  onSelect: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const result = new Map<string, KitPart[]>();
    for (const part of parts) {
      const key = part.name + ":" + part.tone;
      const list = result.get(key) ?? [];
      list.push(part);
      result.set(key, list);
    }
    return [...result.values()];
  }, [parts]);
  return (
    <>
      {groups.map((group) => (
        <Batch
          key={group[0].name + group[0].tone}
          parts={group}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
function Batch({
  parts,
  onSelect,
}: {
  parts: KitPart[];
  onSelect: (id: string) => void;
}) {
  const { scene } = useGLTF("/kit/" + parts[0].name + ".glb");
  const texture = useTexture("/kit/Textures/colormap.png");
  const tone = parts[0].tone,
    name = parts[0].name;
  const meshes = useMemo(() => {
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    scene.updateMatrixWorld(true);
    const values: {
      source: Mesh;
      matrix: Matrix4;
      material: MeshStandardMaterial;
    }[] = [];
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      if (Array.isArray(object.material))
        throw new Error("Nepodporovaný materiál stavebného dielu.");
      const material = (object.material as MeshStandardMaterial).clone();
      if (name.startsWith("roof")) {
        material.map = null;
        material.color.set(COLORS[tone]);
      } else {
        if (material.map) material.map = texture;
        if (name.startsWith("wall")) material.color.set(COLORS[tone]);
      }
      values.push({
        source: object,
        matrix: object.matrixWorld.clone(),
        material,
      });
    });
    return values;
  }, [scene, texture, tone, name]);
  useEffect(
    () => () => meshes.forEach((mesh) => mesh.material.dispose()),
    [meshes],
  );
  return (
    <>
      {meshes.map((mesh, index) => (
        <MeshInstances
          key={index}
          {...mesh}
          parts={parts}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
function MeshInstances({
  source,
  matrix,
  material,
  parts,
  onSelect,
}: {
  source: Mesh;
  matrix: Matrix4;
  material: MeshStandardMaterial;
  parts: KitPart[];
  onSelect: (id: string) => void;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    parts.forEach((part, index) => {
      const transform = new Matrix4()
        .compose(
          new Vector3(...part.position),
          new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            part.rotation,
          ),
          new Vector3(...part.scale),
        )
        .multiply(matrix);
      ref.current!.setMatrixAt(index, transform);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [parts, matrix]);
  useEffect(() => {
    const mesh = ref.current;
    return () => {
      mesh?.dispose();
    };
  }, [source.geometry, material, parts.length]);
  const select = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 3 || event.instanceId === undefined) return;
    const id = parts[event.instanceId]?.buildingId;
    if (id) {
      event.stopPropagation();
      onSelect(id);
    }
  };
  return (
    <instancedMesh
      ref={ref}
      args={[source.geometry, material, parts.length]}
      castShadow
      receiveShadow
      dispose={null}
      onClick={select}
    />
  );
}
