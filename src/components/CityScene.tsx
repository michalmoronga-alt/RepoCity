import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
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
import {
  compareIds,
  createLayout,
  DISTRICT_SLOTS,
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
type AssetName =
  | "wall"
  | "wall-door"
  | "wall-window-small"
  | "wall-wood-window-small"
  | "roof-point"
  | "roof-high-point"
  | "roof-gable"
  | "chimney"
  | "tree"
  | "tree-high-round"
  | "tree-crooked"
  | "rock-small"
  | "rock-large"
  | "fountain-round"
  | "fountain-center"
  | "road"
  | "road-edge"
  | "planks"
  | "poles"
  | "stall-bench"
  | "lantern";
const URL_ROOT = "/kit/";
const ROOF_MATERIAL = new MeshStandardMaterial({
  color: "#ac604b",
  roughness: 1,
});
const TINTED_MATERIALS = new WeakMap<Material, MeshStandardMaterial>();
const ASSETS: AssetName[] = [
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
];
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

function House({
  placement,
  selected,
  open,
  onSelect,
}: {
  placement: Placement;
  selected: boolean;
  open: number;
  onSelect: () => void;
}) {
  const { width, depth, floors, variant } = placement;
  const click = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 3) return;
    event.stopPropagation();
    onSelect();
  };
  const faces = Array.from({ length: floors }, (_, floor) =>
    Array.from({ length: 4 }, (_, side) => {
      const rotation = (side * Math.PI) / 2,
        length = side % 2 === 0 ? depth : width,
        across = side % 2 === 0 ? width : depth;
      return Array.from({ length: 2 }, (_, tile) => {
        const offset = ((tile - 0.5) * length) / 2;
        const wall: AssetName =
          floor > 0
            ? "wall-wood-window-small"
            : side === 1 && tile === 0
              ? "wall-door"
              : "wall-window-small";
        const local = new Vector3(
          across / 2 - 0.5,
          floor,
          offset,
        ).applyAxisAngle(new Vector3(0, 1, 0), rotation);
        return (
          <Asset
            key={`${floor}-${side}-${tile}`}
            name={wall}
            position={[local.x, floor, local.z]}
            rotation={rotation}
            scale={[1, 1, length / 2]}
          />
        );
      });
    }),
  );
  return (
    <group position={[placement.x, 0, placement.z]} onClick={click}>
      {faces}
      <Asset
        name={
          variant === 1
            ? "roof-high-point"
            : variant === 3
              ? "roof-gable"
              : "roof-point"
        }
        position={[0, floors, 0]}
        scale={[width, 1, depth]}
      />
      <Asset
        name="chimney"
        position={[width * 0.22, floors + 0.22, -depth * 0.15]}
        scale={[0.45, 0.45, 0.45]}
      />
      {selected ? (
        <Line
          points={[
            [-width / 2 - 0.25, 0.03, -depth / 2 - 0.25],
            [width / 2 + 0.25, 0.03, -depth / 2 - 0.25],
            [width / 2 + 0.25, 0.03, depth / 2 + 0.25],
            [-width / 2 - 0.25, 0.03, depth / 2 + 0.25],
            [-width / 2 - 0.25, 0.03, -depth / 2 - 0.25],
          ]}
          color="#476a55"
          lineWidth={2}
        />
      ) : null}
      {open > 0 ? (
        <group>
          {[0, 1, 2, 3].map((side) => (
            <Asset
              key={side}
              name="poles"
              rotation={(side * Math.PI) / 2}
              scale={
                side % 2 === 0
                  ? [width + 0.7, floors + 0.2, depth + 0.7]
                  : [depth + 0.7, floors + 0.2, width + 0.7]
              }
            />
          ))}
          {[0, 1, 2, 3].map((side) => {
            const front = side % 2 === 0;
            return (
              <Asset
                key={`plank-${side}`}
                name="planks"
                position={
                  front
                    ? [(side === 0 ? 1 : -1) * (width / 2 + 0.3), 0.85, 0]
                    : [0, 0.85, (side === 1 ? 1 : -1) * (depth / 2 + 0.3)]
                }
                scale={front ? [0.3, 1, depth + 0.7] : [width + 0.7, 1, 0.3]}
              />
            );
          })}
        </group>
      ) : null}
    </group>
  );
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
        .scale(new Vector3(1.15, 1, 1.15))
        .setPosition(p.x, 0.006, p.z);
      ref.current!.setMatrixAt(index, matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [placements]);
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
function Landscape() {
  const shape = useMemo(() => {
    const value = new Shape();
    const points = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2,
        radius = 1 + Math.sin(i * 2.3) * 0.035;
      return [Math.cos(angle) * 12 * radius, Math.sin(angle) * 10.4 * radius];
    });
    value.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => value.lineTo(x, y));
    value.closePath();
    return value;
  }, []);
  const roads = useMemo(() => {
    const output: { x: number; z: number; angle: number }[] = [];
    const nodes = DISTRICT_SLOTS.map(([x, z]) => [x, z + 1.45]);
    nodes.forEach(([x, z], index) => {
      const [endX, endZ] = nodes[(index + 1) % nodes.length];
      const length = Math.hypot(endX - x, endZ - z),
        steps = Math.ceil(length / 0.8);
      for (let step = 0; step <= steps; step++)
        output.push({
          x: x + ((endX - x) * step) / steps,
          z: z + ((endZ - z) * step) / steps,
          angle: Math.atan2(endX - x, endZ - z),
        });
    });
    [[0, 0], nodes[0], nodes[3]].slice(1).forEach(([x, z]) => {
      const length = Math.hypot(x, z),
        steps = Math.ceil(length / 0.8);
      for (let step = 0; step <= steps; step++)
        output.push({
          x: (x * step) / steps,
          z: (z * step) / steps,
          angle: Math.atan2(x, z),
        });
    });
    return output;
  }, []);
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
      {TREES.map(([x, z], i) => (
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
      {TREES.filter((_, i) => i < 15 && i % 2 === 0).map(([x, z], i) => (
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

function CameraControls({ request }: { request: ViewRequest }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size, invalidate } = useThree();
  const zoom = Math.min(size.width / 27, size.height / 20);
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
}: {
  container: RefObject<HTMLDivElement | null>;
  placements: Placement[];
}) {
  useFrame(({ camera, size }) => {
    const occupied: { x: number; y: number; w: number; h: number }[] = [];
    const overlaps = (box: { x: number; y: number; w: number; h: number }) =>
      occupied.some(
        (other) =>
          box.x < other.x + other.w + 5 &&
          box.x + box.w + 5 > other.x &&
          box.y < other.y + other.h + 5 &&
          box.y + box.h + 5 > other.y,
      );
    const ordered = [...placements].sort(
      (a, b) =>
        Number(
          container.current
            ?.querySelector(`[data-label-id="${b.id}"]`)
            ?.classList.contains("selected"),
        ) -
        Number(
          container.current
            ?.querySelector(`[data-label-id="${a.id}"]`)
            ?.classList.contains("selected"),
        ),
    );
    ordered.forEach((p) => {
      const element = container.current?.querySelector<HTMLButtonElement>(
        `[data-label-id="${p.id}"]`,
      );
      if (!element || element.hidden) return;
      const point = new Vector3(p.x, p.floors + 1.05, p.z).project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width,
        initialY = (-point.y * 0.5 + 0.5) * size.height;
      let y = initialY;
      const box = {
        x: x - element.offsetWidth / 2,
        y: y - element.offsetHeight / 2,
        w: element.offsetWidth,
        h: element.offsetHeight,
      };
      for (let attempt = 1; attempt <= 6 && overlaps(box); attempt++) {
        y =
          initialY +
          (attempt % 2 === 1 ? -1 : 1) * Math.ceil(attempt / 2) * (box.h + 6);
        box.y = y - box.h / 2;
      }
      occupied.push(box);
      element.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      element.style.visibility =
        point.z < -1 ||
        point.z > 1 ||
        point.x < -1 ||
        point.x > 1 ||
        point.y < -1 ||
        point.y > 1
          ? "hidden"
          : "visible";
    });
    [
      ...(container.current?.querySelectorAll<HTMLElement>(
        "[data-district-x]",
      ) ?? []),
    ].forEach((element) => {
      element.style.display = "";
      const point = new Vector3(
        Number(element.dataset.districtX),
        0.06,
        Number(element.dataset.districtZ),
      ).project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width,
        y = (-point.y * 0.5 + 0.5) * size.height;
      const box = {
        x: x - element.offsetWidth / 2,
        y: y - element.offsetHeight / 2,
        w: element.offsetWidth,
        h: element.offsetHeight,
      };
      if (overlaps(box)) element.style.display = "none";
      else occupied.push(box);
      element.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    });
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
        shadow-camera-left={-17}
        shadow-camera-right={17}
        shadow-camera-top={17}
        shadow-camera-bottom={-17}
        shadow-normalBias={0.025}
      />
      <Landscape />
      {placements.map((placement) => {
        const building = map.buildings.find((b) => b.id === placement.id)!;
        const activities = buildingActivities(activity, building.id),
          open = activities.filter((a) => a.status === "open");
        return (
          <House
            key={building.id}
            placement={placement}
            selected={selected === building.id}
            open={open.length}
            onSelect={() => onSelect(building.id)}
          />
        );
      })}
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
      <CameraControls request={props.viewRequest} />
      <LabelProjection container={props.labels} placements={placements} />
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
              className={`building-label ${props.selected === building.id ? "selected" : ""}`}
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
            data-district-x={DISTRICT_SLOTS[index][0]}
            data-district-z={DISTRICT_SLOTS[index][1] + 2}
          >
            {district.label}
          </span>
        ))}
      </div>
    </div>
  );
}
