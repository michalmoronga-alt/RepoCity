import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Home, Minus, Plus, Upload } from "lucide-react";
import sample from "../examples/maps/sample-service-office.json";
import { parseMap, type CityMap } from "./domain/map";
import { replay, type CityEvent } from "./domain/activity";
import { simulation } from "./data/simulation";
import Inspector from "./components/Inspector";
import SimulationBar from "./components/SimulationBar";
import type { SceneMetrics, ViewRequest } from "./components/CityScene";

const CityScene = lazy(() =>
  import("./components/CityScene").then((module) => ({
    default: module.CityScene,
  })),
);
const SAMPLE_MAP = parseMap(sample);
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback" role="status">
        <h2>3D mesto sa nepodarilo zobraziť</h2>
        <p>
          Mapa je dostupná v zozname budov. Skús znovu načítať stránku v
          prehliadači s podporou WebGL.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const [localMap, setLocalMap] = useState<CityMap | null>(null);
  const [map, setMap] = useState(SAMPLE_MAP);
  const [selected, setSelected] = useState(SAMPLE_MAP.buildings[1].id);
  const [overview, setOverview] = useState(false);
  const [relationships, setRelationships] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [viewRequest, setViewRequest] = useState<ViewRequest>({
    action: "home",
    sequence: 0,
  });
  const [metrics, setMetrics] = useState<SceneMetrics | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const adopt = useCallback((value: CityMap) => {
    setMap(value);
    setSelected(value.buildings[1].id);
    setIndex(0);
    setRelationships(false);
    setMetrics(null);
  }, []);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const controller = new AbortController();
    fetch("/local-pilot-map", { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) return;
        if (!response.ok)
          throw new Error("Lokálnu mapu sa nepodarilo načítať.");
        const value = parseMap(await response.json());
        setLocalMap(value);
        adopt(value);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setError(
            "Lokálna mapa sa nenačítala. Ukážkové mesto zostáva dostupné.",
          );
      });
    return () => controller.abort();
  }, [adopt]);
  const steps = useMemo(() => simulation(map.buildings[2].id), [map]);
  const activity = useMemo(
    () =>
      replay(
        steps
          .slice(0, index + 1)
          .flatMap((step) => (step.event ? [step.event] : [])) as CityEvent[],
      ),
    [steps, index],
  );
  const view = (action: ViewRequest["action"]) =>
    setViewRequest((previous) => ({ action, sequence: previous.sequence + 1 }));
  const onMetrics = useCallback((value: SceneMetrics) => setMetrics(value), []);
  async function loadFile(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 1_000_000)
        throw new Error("Mapa je príliš veľká. Limit je 1 MB.");
      const value = parseMap(JSON.parse(await file.text()));
      setLocalMap(value);
      adopt(value);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Mapa sa nedá načítať.",
      );
    }
    if (fileInput.current) fileInput.current.value = "";
  }
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>RepoCity</h1>
        {localMap ? (
          <select
            aria-label="Projekt"
            className="project-select"
            value={map === SAMPLE_MAP ? "sample" : "local"}
            onChange={(event) =>
              adopt(event.target.value === "sample" ? SAMPLE_MAP : localMap)
            }
          >
            <option value="sample">Ukážkové mesto</option>
            <option value="local">{localMap.label}</option>
          </select>
        ) : (
          <span className="project-name">Ukážkové mesto</span>
        )}
        <button
          className="icon-button load-map"
          aria-label="Otvoriť lokálnu mapu"
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={18} />
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          aria-label="Súbor lokálnej mapy"
          onChange={(event) => void loadFile(event.target.files?.[0])}
        />
        <div className="mode-switch" role="group" aria-label="Režim zobrazenia">
          <button aria-pressed={!overview} onClick={() => setOverview(false)}>
            Mesto
          </button>
          <button aria-pressed={overview} onClick={() => setOverview(true)}>
            Prehľad
          </button>
        </div>
      </header>
      {error ? (
        <div className="notice" role="alert">
          {error}
          <button className="text-button" onClick={() => setError("")}>
            Zavrieť
          </button>
        </div>
      ) : null}
      <main className="workspace">
        <div
          className="city-workspace"
          data-building-count={map.buildings.length}
          data-draw-calls={metrics?.calls}
          data-triangles={metrics?.triangles}
          data-geometries={metrics?.geometries}
          data-textures={metrics?.textures}
        >
          <SceneBoundary>
            <Suspense fallback={null}>
              <CityScene
                map={map}
                selected={selected}
                overview={overview}
                relationships={relationships}
                activity={activity}
                onSelect={setSelected}
                viewRequest={viewRequest}
                onMetrics={onMetrics}
              />
            </Suspense>
            {!metrics ? (
              <div className="scene-loading" role="status">
                Pripravujem mesto…
              </div>
            ) : null}
          </SceneBoundary>
          <div className="city-caption">
            <strong>
              {map.synthetic ? "Fiktívna ukážka" : "Lokálny snapshot"}
            </strong>
            <span>Živá aktivita nepripojená</span>
          </div>
          <div className="camera-toolbar">
            <div className="zoom-group">
              <button
                className="icon-button"
                aria-label="Priblížiť"
                onClick={() => view("in")}
              >
                <Plus size={18} />
              </button>
              <button
                className="icon-button"
                aria-label="Oddialiť"
                onClick={() => view("out")}
              >
                <Minus size={18} />
              </button>
            </div>
            <button
              className="icon-button"
              aria-label="Celé mesto"
              onClick={() => view("home")}
            >
              <Home size={18} />
            </button>
            <span>Potiahni pre posun · koliesko pre priblíženie</span>
          </div>
        </div>
        <Inspector
          map={map}
          selected={selected}
          onSelect={setSelected}
          activity={activity}
          relationships={relationships}
          onRelationships={() => setRelationships((v) => !v)}
        />
      </main>
      <SimulationBar
        steps={steps}
        index={index}
        onReset={() => setIndex(0)}
        onNext={() => {
          setIndex((i) => Math.min(i + 1, steps.length - 1));
          setSelected(map.buildings[2].id);
        }}
      />
    </div>
  );
}
