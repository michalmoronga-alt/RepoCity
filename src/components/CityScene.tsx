import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import {
  InstancedMesh,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Shape,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CityMap } from "../domain/map";
import { KIT_ASSETS, buildingParts, type AssetName } from "../domain/recipes";
import KitInstances from "./KitInstances";
import {
  compareIds,
  createLayout,
  districtSlots,
  type Placement,
} from "../domain/layout";
import {
  buildingActivities,
  currentCheck,
  type ActivityState,
} from "../domain/activity";

export interface SceneMetrics {
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
}
export interface ViewRequest {
  action: "home" | "in" | "out";
  sequence: number;
}
interface Props {
  map: CityMap;
  selected: string;
  overview: boolean;
  relationships: boolean;
  activity: ActivityState;
  onSelect: (id: string) => void;
  viewRequest: ViewRequest;
  onMetrics: (metrics: SceneMetrics) => void;
}
const URL_ROOT = "/kit/";
const ROOF_MATERIAL = new MeshStandardMaterial({
  color: "#ac604b",
  roughness: 1,
});
const TINTED_MATERIALS = new WeakMap<Material, MeshStandardMaterial>();
const ASSETS = KIT_ASSETS;
ASSETS.forEach((name) => useGLTF.preload(URL_ROOT + name + ".glb"));

function Asset({
  name,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = 0,
}: {
  name: AssetName;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: number;
}) {
  const { scene } = useGLTF(URL_ROOT + name + ".glb");
  const texture = useKitTexture();
  const clone = useMemo(() => {
    const value = scene.clone(true);
    value.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (name.startsWith("roof")) object.material = ROOF_MATERIAL;
        else {
          const material = object.material as MeshStandardMaterial;
          let replacement = TINTED_MATERIALS.get(material);
          if (!replacement) {
            replacement = material.clone();
            if (replacement.map) replacement.map = texture;
            if (name.startsWith("wall")) replacement.color.set("#e7d9c1");
            TINTED_MATERIALS.set(material, replacement);
          }
          object.material = replacement;
        }
      }
    });
    return value;
  }, [scene, texture, name]);
  return (
    <primitive
      object={clone}
      dispose={null}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
    />
  );
}

function useKitTexture() {
  const texture = useTexture(URL_ROOT + "Textures/colormap.png");
  useMemo(() => {
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);
  return texture;
}

function Roads({
  placements,
}: {
  placements: { x: number; z: number; angle: number }[];
}) {
  const { scene } = useGLTF(URL_ROOT + "road.glb");
  const texture = useKitTexture();
  const source = scene.children[0] as Mesh;
  const material = useMemo(() => {
    const value = (source.material as MeshStandardMaterial).clone();
    value.map = null;
    value.color.set("#d8cdb4");
    return value;
  }, [source, texture]);
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    placements.forEach((p, index) => {
      const matrix = new Matrix4()
        .makeRotationY(p.angle)
        .scale(new Vector3(1, 1, 1))
        .setPosition(p.x, 0.006, p.z);
      ref.current!.setMatrixAt(index, matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [placements]);
  useEffect(() => {
    const mesh = ref.current;
    return () => {
      mesh?.dispose();
    };
  }, [source.geometry, material, placements.length]);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <instancedMesh
      ref={ref}
      args={[source.geometry, material, placements.length]}
      receiveShadow
      dispose={null}
    />
  );
}

const TREES: [number, number][] = [
  [-9, -7],
  [-6.5, -8.2],
  [-2, -8.9],
  [2, -8.6],
  [7.8, -6.3],
  [10, -2.6],
  [10.6, 1.8],
  [9, 5.4],
  [5.5, 8],
  [1.8, 9],
  [-2.2, 8.8],
  [-6.5, 7.2],
  [-10, 4.5],
  [-10.8, 0.8],
  [-10, -3.7],
  [-2.5, -1.8],
  [2.6, 2.5],
  [-2.1, 3.8],
];
function Landscape({ map }: { map: CityMap }) {
  const dense = map.layoutProfile === "dense";
  const shape = useMemo(() => {
    const value = new Shape();
    const points = Array.from({ length: 32 }, (_, i) => {
      const angle = (i / 32) * Math.PI * 2,
        c = Math.cos(angle),
        z = Math.sin(angle),
        r = 1 + Math.sin(i * 2.3) * 0.015;
      return dense
        ? [
            Math.sign(c) * Math.abs(c) ** 0.5 * 22 * r,
            Math.sign(z) * Math.abs(z) ** 0.5 * 21 * r,
          ]
        : [c * 12 * r, z * 10.4 * r];
    });
    value.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, z]) => value.lineTo(x, z));
    value.closePath();
    return value;
  }, [dense]);
  const trees = useMemo<[number, number][]>(
    () =>
      dense
        ? Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2,
              c = Math.cos(a),
              z = Math.sin(a);
            return [
              Math.sign(c) * Math.abs(c) ** 0.5 * 20.8,
              Math.sign(z) * Math.abs(z) ** 0.5 * 19.6,
            ];
          })
        : TREES,
    [dense],
  );
  const roads = useMemo(() => {
    const output: { x: number; z: number; angle: number }[] = [];
    const segment = (x: number, z: number, endX: number, endZ: number) => {
      const steps = Math.ceil(Math.hypot(endX - x, endZ - z) / 0.8);
      if (!steps) return;
      for (let i = 0; i <= steps; i++)
        output.push({
          x: x + ((endX - x) * i) / steps,
          z: z + ((endZ - z) * i) / steps,
          angle: Math.atan2(endX - x, endZ - z),
        });
    };
    const nodes = districtSlots(map);
    if (dense) {
      [...map.districts].sort(compareIds).forEach((d, i) => {
        const [x, z] = nodes[i],
          rows = Math.ceil(
            map.buildings.filter((b) => b.districtId === d.id).length / 3,
          );
        if (!rows) return;
        for (let row = 0; row <= rows; row++)
          segment(
            x - 5.55,
            z + (row - rows / 2) * 3.5,
            x + 5.55,
            z + (row - rows / 2) * 3.5,
          );
        for (let col = 0; col <= 3; col++)
          segment(
            x + (col - 1.5) * 3.7,
            z - rows * 1.75,
            x + (col - 1.5) * 3.7,
            z + rows * 1.75,
          );
      });
      segment(-17, 0, 17, 0);
      segment(-5.75, -17, -5.75, 0);
      segment(0, 0, 0, 17);
    } else {
      const route = nodes.map(([x, z]) => [x, z + 1.45]);
      route.forEach(([x, z], i) =>
        segment(x, z, ...(route[(i + 1) % route.length] as [number, number])),
      );
      [route[0], route[3]].forEach(([x, z]) => segment(0, 0, x, z));
    }
    return output;
  }, [map, dense]);
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.45, 0]}
        receiveShadow
      >
        <extrudeGeometry args={[shape, { depth: 0.45, bevelEnabled: false }]} />
        <meshStandardMaterial color="#a9ba83" roughness={1} />
      </mesh>
      <Roads placements={roads} />
      <Asset
        name="fountain-round"
        scale={[0.68, 0.8, 0.68]}
        position={[0, 0.02, 0]}
      />
      <Asset
        name="fountain-center"
        scale={[0.55, 0.7, 0.55]}
        position={[0, 0.02, 0]}
      />
      {trees.map(([x, z], i) => (
        <Asset
          key={i}
          name={
            i % 3 === 0
              ? "tree-high-round"
              : i % 3 === 1
                ? "tree-crooked"
                : "tree"
          }
          position={[x, 0.02, z]}
          scale={[
            0.7 + (i % 4) * 0.07,
            0.7 + (i % 4) * 0.07,
            0.7 + (i % 4) * 0.07,
          ]}
          rotation={i * 1.7}
        />
      ))}
      {trees
        .filter((_, i) => i < 15 && i % 2 === 0)
        .map(([x, z], i) => (
          <Asset
            key={i}
            name="rock-small"
            position={[x - 0.5, 0.02, z + 0.5]}
            scale={[0.7, 0.7, 0.7]}
            rotation={i * 1.1}
          />
        ))}
      <Asset
        name="stall-bench"
        position={[-1.5, 0.02, 0.8]}
        rotation={0.5}
        scale={[0.65, 0.65, 0.65]}
      />
      <Asset
        name="lantern"
        position={[1.3, 0.02, -0.6]}
        scale={[0.7, 0.7, 0.7]}
      />
    </group>
  );
}

function CameraControls({
  request,
  dense,
}: {
  request: ViewRequest;
  dense: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size, invalidate } = useThree();
  const zoom = Math.min(
    size.width / (dense ? 59 : 27),
    size.height / (dense ? 47 : 20),
  );
  useEffect(() => {
    const cam = camera as OrthographicCamera;
    cam.position.set(24, 26, 24);
    cam.zoom = zoom;
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    invalidate();
  }, [camera, zoom, invalidate]);
  useEffect(() => {
    const cam = camera as OrthographicCamera;
    if (request.action === "home") {
      cam.position.set(24, 26, 24);
      cam.zoom = zoom;
      controls.current?.target.set(0, 0, 0);
    } else
      cam.zoom = Math.max(
        zoom * 0.55,
        Math.min(
          zoom * 2.8,
          cam.zoom * (request.action === "in" ? 1.2 : 1 / 1.2),
        ),
      );
    cam.updateProjectionMatrix();
    controls.current?.update();
    invalidate();
  }, [request, camera, zoom, invalidate]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableRotate={false}
      enableDamping={false}
      minZoom={zoom * 0.55}
      maxZoom={zoom * 2.8}
      screenSpacePanning={false}
      mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 2 }}
      target={[0, 0, 0]}
    />
  );
}

function Metrics({
  onMetrics,
  version,
}: {
  onMetrics: Props["onMetrics"];
  version: string;
}) {
  const { gl, invalidate } = useThree();
  const frames = useRef(0);
  const reportedVersion = useRef("");
  useLayoutEffect(() => {
    reportedVersion.current = "";
    invalidate();
  }, [invalidate, version]);
  useFrame(() => {
    gl.domElement.dataset.renderFrame = String(++frames.current);
    if (reportedVersion.current === version) return;
    // R3F renders after useFrame. Read the actual completed frame, not a timer
    // that might fire while GLB/texture loading is still suspended.
    queueMicrotask(() => {
      if (gl.info.render.calls === 0 || reportedVersion.current === version)
        return;
      reportedVersion.current = version;
      onMetrics({
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      });
    });
  });
  return null;
}

function LabelProjection({
  container,
  placements,
  dense,
}: {
  container: RefObject<HTMLDivElement | null>;
  placements: Placement[];
  dense: boolean;
}) {
  useFrame(({ camera, size }) => {
    const occupied: { x: number; y: number; w: number; h: number }[] = [];
    const overlaps = (box: { x: number; y: number; w: number; h: number }) =>
      occupied.some(
        (o) =>
          box.x < o.x + o.w + 5 &&
          box.x + box.w + 5 > o.x &&
          box.y < o.y + o.h + 5 &&
          box.y + box.h + 5 > o.y,
      );
    const ranks = new Map<string, number>(),
      seen = new Map<string, number>();
    placements.forEach((p) => {
      const n = seen.get(p.districtId) ?? 0;
      ranks.set(p.id, n);
      seen.set(p.districtId, n + 1);
    });
    const priority = (id: string) => {
      const e = container.current?.querySelector(`[data-label-id="${id}"]`);
      return e?.classList.contains("selected")
        ? 2
        : e?.classList.contains("has-activity")
          ? 1
          : 0;
    };
    const ordered = [...placements].sort(
      (a, b) =>
        priority(b.id) - priority(a.id) ||
        ranks.get(a.id)! - ranks.get(b.id)! ||
        compareIds(a, b),
    );
    const fit = Math.min(
      size.width / (dense ? 59 : 27),
      size.height / (dense ? 47 : 20),
    );
    const limit = dense
      ? Math.max(6, Math.floor(size.width / 125)) *
        Math.max(1, Math.floor((camera as OrthographicCamera).zoom / fit))
      : Infinity;
    let visible = 0;
    for (const p of ordered) {
      const e = container.current?.querySelector<HTMLButtonElement>(
        `[data-label-id="${p.id}"]`,
      );
      if (!e || e.hidden) continue;
      e.style.visibility = "hidden";
      const point = new Vector3(p.x, p.height + 0.2, p.z).project(camera);
      if (
        point.z < -1 ||
        point.z > 1 ||
        point.x < -1 ||
        point.x > 1 ||
        point.y < -1 ||
        point.y > 1 ||
        visible >= limit
      )
        continue;
      const w = e.offsetWidth,
        h = e.offsetHeight;
      const x = Math.max(
        w / 2 + 4,
        Math.min(size.width - w / 2 - 4, (point.x * 0.5 + 0.5) * size.width),
      );
      const initialY = (-point.y * 0.5 + 0.5) * size.height;
      let y = initialY;
      const box = { x: x - w / 2, y: y - h / 2, w, h };
      for (let attempt = 1; attempt <= 4 && overlaps(box); attempt++) {
        y =
          initialY + (attempt % 2 ? -1 : 1) * Math.ceil(attempt / 2) * (h + 6);
        box.y = y - h / 2;
      }
      if (overlaps(box) || box.y < 8 || box.y + h > size.height - 75) continue;
      e.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      e.style.visibility = "visible";
      occupied.push(box);
      visible++;
    }
    for (const e of container.current?.querySelectorAll<HTMLElement>(
      "[data-district-x]",
    ) ?? []) {
      e.style.display = "";
      const point = new Vector3(
        Number(e.dataset.districtX),
        0.1,
        Number(e.dataset.districtZ),
      ).project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width,
        y = (-point.y * 0.5 + 0.5) * size.height;
      const box = {
        x: x - e.offsetWidth / 2,
        y: y - e.offsetHeight / 2,
        w: e.offsetWidth,
        h: e.offsetHeight,
      };
      if (
        overlaps(box) ||
        box.x < 0 ||
        box.x + box.w > size.width ||
        box.y < 8 ||
        box.y + box.h > size.height - 75
      )
        e.style.display = "none";
      else occupied.push(box);
      e.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    }
  });
  return null;
}

function Town(props: Props & { labels: RefObject<HTMLDivElement | null> }) {
  const { map, selected, overview, relationships, activity, onSelect } = props;
  const invalidate = useThree((state) => state.invalidate);
  useEffect(
    () => invalidate(),
    [invalidate, map, selected, overview, activity],
  );
  const placements = useMemo(() => createLayout(map), [map]);
  const indexes = useMemo(
    () => new Map(placements.map((p) => [p.id, p])),
    [placements],
  );
  const parts = useMemo(
    () =>
      placements.flatMap((p) =>
        buildingParts(
          p,
          buildingActivities(activity, p.id).some((a) => a.status === "open"),
        ),
      ),
    [placements, activity],
  );
  const chosen = indexes.get(selected)!;
  const dense = map.layoutProfile === "dense";
  const selectedRelations = relationships
    ? map.relationships.filter((r) => r.from === selected || r.to === selected)
    : [];
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight
        position={[-8, 18, 10]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={dense ? -34 : -17}
        shadow-camera-right={dense ? 34 : 17}
        shadow-camera-top={dense ? 34 : 17}
        shadow-camera-bottom={dense ? -34 : -17}
        shadow-normalBias={0.025}
      />
      <Landscape map={map} />
      <KitInstances parts={parts} onSelect={onSelect} />
      <Line
        points={[
          [
            chosen.x - chosen.width / 2 - 0.2,
            0.035,
            chosen.z - chosen.depth / 2 - 0.2,
          ],
          [
            chosen.x + chosen.width / 2 + 0.2,
            0.035,
            chosen.z - chosen.depth / 2 - 0.2,
          ],
          [
            chosen.x + chosen.width / 2 + 0.2,
            0.035,
            chosen.z + chosen.depth / 2 + 0.2,
          ],
          [
            chosen.x - chosen.width / 2 - 0.2,
            0.035,
            chosen.z + chosen.depth / 2 + 0.2,
          ],
          [
            chosen.x - chosen.width / 2 - 0.2,
            0.035,
            chosen.z - chosen.depth / 2 - 0.2,
          ],
        ]}
        color="#476a55"
        lineWidth={2}
      />
      {selectedRelations.map((relation) => {
        const from = indexes.get(relation.from)!,
          to = indexes.get(relation.to)!;
        return (
          <Line
            key={relation.id}
            points={[
              [from.x, 0.18, from.z],
              [(from.x + to.x) / 2, 0.55, (from.z + to.z) / 2],
              [to.x, 0.18, to.z],
            ]}
            color="#476a55"
            lineWidth={2.5}
            dashed
            dashSize={0.22}
            gapSize={0.12}
          />
        );
      })}
      <CameraControls request={props.viewRequest} dense={dense} />
      <LabelProjection
        container={props.labels}
        placements={placements}
        dense={dense}
      />
      <Metrics onMetrics={props.onMetrics} version={props.map.mappingVersion} />
    </>
  );
}

function Unavailable({ onMetrics }: { onMetrics: Props["onMetrics"] }) {
  useEffect(
    () => onMetrics({ calls: 0, triangles: 0, geometries: 0, textures: 0 }),
    [onMetrics],
  );
  return (
    <p className="scene-fallback" role="status">
      3D zobrazenie tu nie je dostupné. Budovy môžeš vybrať v zozname.
    </p>
  );
}

export function CityScene(props: Props) {
  const labels = useRef<HTMLDivElement>(null);
  return (
    <div className="scene-layer">
      <Canvas
        orthographic
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [24, 26, 24], near: 0.1, far: 150 }}
        gl={{ antialias: true, alpha: true }}
        fallback={<Unavailable onMetrics={props.onMetrics} />}
        aria-label="3D mesto projektu: posun potiahnutím, priblíženie kolieskom"
      >
        <Suspense fallback={null}>
          <Town {...props} labels={labels} />
        </Suspense>
      </Canvas>
      <div className="canvas-labels" ref={labels}>
        {props.map.buildings.map((building) => {
          const open = buildingActivities(props.activity, building.id).filter(
            (a) => a.status === "open",
          );
          const failed = open.some((a) => currentCheck(a) === "failed");
          return (
            <button
              key={building.id}
              data-label-id={building.id}
              className={`building-label ${props.selected === building.id ? "selected" : ""} ${open.length ? "has-activity" : ""}`}
              hidden={
                !props.overview && props.selected !== building.id && !failed
              }
              onClick={() => props.onSelect(building.id)}
              aria-pressed={props.selected === building.id}
            >
              {building.shortLabel}
              {open.length > 0 ? (
                <span aria-label={`${open.length} otvorené simulované zmeny`}>
                  {" "}
                  · {open.length}
                </span>
              ) : null}
              {failed ? (
                <span
                  className="check-flag"
                  aria-label="Zlyhaná kontrola v simulácii"
                >
                  !
                </span>
              ) : null}
            </button>
          );
        })}
        {[...props.map.districts].sort(compareIds).map((district, index) => (
          <span
            key={district.id}
            className="district-label"
            data-district-x={districtSlots(props.map)[index][0]}
            data-district-z={
              districtSlots(props.map)[index][1] +
              (props.map.layoutProfile === "dense" ? 0 : 2)
            }
          >
            {district.label}
          </span>
        ))}
      </div>
    </div>
  );
}
