import { ARCHETYPES, type Archetype } from "./archetypes";

export interface SourceAnchor {
  path: string;
  line: number;
}
export interface Building {
  id: string;
  districtId: string;
  label: string;
  shortLabel: string;
  purpose: string;
  sourceAnchors: SourceAnchor[];
  archetype: Archetype;
}
export interface District {
  id: string;
  label: string;
}
export interface Relationship {
  id: string;
  from: string;
  to: string;
  label: string;
}
export interface CityMap {
  label: string;
  mappingVersion: string;
  synthetic: boolean;
  ownerConfirmed: boolean;
  snapshot: string | null;
  reviewDate: string | null;
  buildings: Building[];
  districts: District[];
  relationships: Relationship[];
  layoutProfile: "compact" | "dense";
}

function record(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Mapa má nesprávny tvar.");
  return input as Record<string, unknown>;
}
function text(input: unknown, limit = 500): string {
  if (typeof input !== "string" || !input.trim() || input.length > limit)
    throw new Error("V mape chýba platný názov alebo popis.");
  return input;
}
function id(input: unknown) {
  const value = text(input, 80);
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) throw new Error("Mapa má neplatné ID.");
  return value;
}
function array(input: unknown, min: number, max: number) {
  if (!Array.isArray(input) || input.length < min || input.length > max)
    throw new Error("Tento prototyp podporuje 8–60 budov a najviac 5 štvrtí.");
  return input as unknown[];
}
function unique(items: { id: string }[]) {
  if (new Set(items.map((v) => v.id)).size !== items.length)
    throw new Error("Mapa obsahuje opakované ID.");
}
export function parseMap(input: unknown): CityMap {
  const raw = record(input),
    project = record(raw.project),
    acceptance = record(raw.acceptance);
  if (raw.schemaVersion !== 1)
    throw new Error("Táto verzia mapy zatiaľ nie je podporovaná.");
  const districts = array(raw.districts, 1, 5).map((value) => {
    const r = record(value);
    return { id: id(r.id), label: text(r.label, 120) };
  });
  const buildings = array(raw.buildings, 8, 60).map((value) => {
    const r = record(value);
    const archetype = r.archetype ?? "house";
    if (!ARCHETYPES.includes(archetype as Archetype))
      throw new Error("Neznámy typ budovy.");
    const anchors =
      r.sourceAnchors === undefined
        ? []
        : array(r.sourceAnchors, 0, 30).map((value) => {
            const a = record(value);
            if (
              typeof a.line !== "number" ||
              !Number.isSafeInteger(a.line) ||
              a.line < 1
            )
              throw new Error("Neplatný zdrojový odkaz.");
            return { path: text(a.path, 300), line: a.line };
          });
    return {
      id: id(r.id),
      districtId: id(r.districtId),
      label: text(r.label, 120),
      shortLabel: text(r.shortLabel ?? r.label, 120),
      purpose: text(r.purpose),
      sourceAnchors: anchors,
      archetype: archetype as Archetype,
    };
  });
  const relationships = array(raw.relationships, 0, 40).map((value) => {
    const r = record(value);
    return {
      id: id(r.id),
      from: id(r.from),
      to: id(r.to),
      label: text(r.label, 200),
    };
  });
  unique(districts);
  unique(buildings);
  unique(relationships);
  const districtIds = new Set(districts.map((d) => d.id)),
    buildingIds = new Set(buildings.map((b) => b.id));
  for (const building of buildings)
    if (!districtIds.has(building.districtId))
      throw new Error("Budova nemá existujúcu štvrť.");
  for (const relation of relationships)
    if (!buildingIds.has(relation.from) || !buildingIds.has(relation.to))
      throw new Error("Vzťah smeruje na neexistujúcu budovu.");
  const layoutProfile = raw.layoutProfile ?? "compact";
  if (layoutProfile !== "compact" && layoutProfile !== "dense")
    throw new Error("Neznáme rozloženie mesta.");
  if (layoutProfile === "compact" && buildings.length > 12)
    throw new Error("Väčšia mapa potrebuje výslovné husté rozloženie.");
  for (const district of districts)
    if (
      buildings.filter((b) => b.districtId === district.id).length >
      (layoutProfile === "dense" ? 15 : 3)
    )
      throw new Error("Štvrť prekračuje kapacitu svojho rozloženia.");
  const snapshot = project.sourceSnapshot;
  if (
    snapshot !== null &&
    (typeof snapshot !== "string" || !/^[a-f0-9]{40}$/i.test(snapshot))
  )
    throw new Error("Neplatný zdrojový snapshot.");
  const synthetic = raw.kind === "synthetic_mapping_proposal";
  if (
    !synthetic &&
    (!snapshot || buildings.some((b) => b.sourceAnchors.length === 0))
  )
    throw new Error(
      "Zdrojová mapa potrebuje snapshot a podklady každej budovy.",
    );
  return {
    label: text(project.label, 120),
    mappingVersion: text(raw.mappingVersion, 80),
    synthetic,
    ownerConfirmed: acceptance.ownerConfirmed === true,
    snapshot: snapshot as string | null,
    reviewDate:
      typeof project.reviewDate === "string" ? project.reviewDate : null,
    buildings,
    districts,
    relationships,
    layoutProfile,
  };
}
