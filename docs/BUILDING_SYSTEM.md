# Building system — modular 3D kit

## Core idea

A building is a **recipe**, composed of interoperable pieces. Each piece owns machine-readable metadata and a 3D visual asset. Typical parts: plot/foundation, ground floor, repeatable floor, roof, tower, terrace, facade attachment, door/window, chimney, landscaping, road tile.

This is the target system. [Prototype 001](PROTOTYPE_001.md) starts with a small authored recipe set for 8–12 buildings; it does not require a comprehensive factory or minimum inventory of each part category.

The [15 Oct dense-city iteration](DENSE_CITY.md) adds eight explicit archetypes and a 50-building public fixture. Functional role selects the archetype; stable ID selects facade/roof details. The renderer instances repeated parts while preserving per-building picking. These are authored recipes with checked envelopes, not the full socket-based factory described below.

## Identifiers vs metadata

Use a readable immutable ID like `CL-BLD-FL-02-A3`:
- CL: Classic theme
- BLD: building component
- FL: floor
- 02: visual variant
- A3: compatibility family

**Do not** encode every rule in the filename. Store structured JSON specifications. Family A3 is a hint, *not* a substitute for dimension/socket checks.

## Data contract (draft)

Asset:
- `id`, `theme`, `kind`, `variant`, `assetPath`
- `footprint` in integer grid cells, `heightUnits`, `anchor`, `rotationSteps`
- `compatibilityFamily` and sockets (e.g. top/bottom/socket kind/size/position)
- `bounds`, `allowedEpochs`, `tags`, `licenseRef`

Recipe:
- stable building ID and plot footprint
- ordered parts with transforms, rotation, optional decoration sockets
- validation results and generator version
- deterministic random seed

See [example](../examples/assets/classic-floor-a3.json).

## Rules

1. Parts physically fit: bounds, anchors, vertical offsets and no unintended intersections.
2. Matched sockets are checked by kind, size and facing, not just tag.
3. Roads connect via N/E/S/W in **world coordinates**, not camera-left/camera-right.
4. Compatible rotations must be explicit; unsupported variants should be rejected.
5. Repeatable floors have constraints on maximum height and roof attachment.
6. The renderer should reuse meshes/materials; do not create a separate unique mesh for every building.
7. Generated unique architecture should start as **new recipes using validated existing pieces**.
8. World evolution preserves stable building positions unless an explicitly recorded renovation changes one.

## Spatial generation

Stage 1: street graph + neighborhoods + land parcels. Stage 2: allocate archetypes (house, workshop, warehouse, tower, lab, civic building, monument). Stage 3: assemble component recipes. Stage 4: context-based decoration. Stage 5: transient PR activities.

Wang tiles / constrained adjacency can help roads, facades and roof transitions; global WFC is optional. Keep roads traversable and reserve space for district growth.

## Epochs

Four visual phases remain a later proposal; the first prototype has no epoch progression. Unlocks will be governed by versioned verifiable events. Initial heights express visual archetypes, not code quality, developer performance or PR count. Useful simplification may consolidate buildings without being treated as failure.

## Visual consistency

Orthographic projection, fixed world-unit scale, lighting direction, materials, mesh origin and naming. Aim for reusable low-poly assets and a coherent Classic human-city palette.
