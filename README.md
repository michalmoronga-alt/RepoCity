# RepoCity 🏙️

**Watch your codebase grow into a living city.**

RepoCity is a universal, read-only visual companion for software repositories. A repository becomes a city; architectural domains become districts; components become buildings; pull requests become visible construction, renovation, inspection and completion.

RepoCity is **not** an orchestrator. It must never modify source repositories, branches, issues, pull requests, CI, or existing agent workflows.

## Current direction (15 Oct 2026)

- **Primary value (approved):** a calm companion **and** a practical map for people working through AI agents; explain functional responsibilities and observed activity in plain language.
- **First experience:** confirm/correct the map, switch City/Overview and inspect purpose, evidence and related changes.
- **First proof:** the initial ten-building viewer established mapping and interaction. Owner feedback now calls for **40–60 functional buildings**, denser streets and clearer architectural variety. Identifiable pilot evidence stays local.
- **Visual:** Classic human city first. Magic World and Orcs are future theme packs.
- **Rendering:** lightweight low-poly **3D with an orthographic/isometric camera**, implemented with React + Three.js / React Three Fiber. Real-device qualification remains open.
- **World model:** stable city core + organically generated districts; each district consists of many buildings, roads, lots, landscaping and temporary construction sites.
- **Content:** modular, socket-compatible assets (floor, roof, extension, terrace, road, props) with structured specifications.
- **Progress:** four epochs remain a later direction; the first prototype has no epoch gate. Size is not a quality/productivity score; useful simplification can improve the city.
- **History:** start with an honest snapshot and a few labeled simulated activities; evolve toward a deterministic timeline with explicit coverage and stable identities.
- **AI architect:** optional *city-only* designer for unique layouts, building recipes, landmarks and district identities, governed by validation rules. No uncontrolled code execution or changes to the observed project.
- **Reuse first:** study open-source approaches and properly licensed/free asset packs before building replacements.

## Principles

1. **Observer only:** GitHub read-only integration for the MVP; optional local read-only agent/worktree telemetry later.
2. **Truthful:** do not invent working agents, tests or PR status; represent unknown as unknown.
3. **Stable:** the same source data + config + generator version + seed results in the same world. Incremental changes don't redraw established neighborhoods.
4. **Universal:** semantic concepts are theme-independent; repo naming/layout conventions must be detected, not hard-coded for one project.
5. **Scalable:** aggregate fine-grained files into architectural units; not one building per file nor one building per PR.
6. **Legible:** the city tells a story before it becomes decorative noise.
7. **Licensing:** verify and attribute third-party assets/code; no copying proprietary game content.

## Start here

- [Product vision and terminology](docs/VISION.md)
- [Architecture and data/event model](docs/ARCHITECTURE.md)
- [Modular building system](docs/BUILDING_SYSTEM.md)
- [Research and asset/license register](docs/RESEARCH_AND_ASSETS.md)
- [Prototype 001 acceptance criteria](docs/PROTOTYPE_001.md)
- [Development roadmap](docs/ROADMAP.md)
- [Source-backed mapping pilot](docs/MAPPING_PILOT.md)
- [Current status and open gates](docs/STATUS.md)
- [Approved product decisions](docs/DECISIONS.md)
- [City meanings and state rules](docs/CITY_RULES.md)
- [Synthetic functional map](examples/maps/sample-service-office.json)
- [Sample asset specification](examples/assets/classic-floor-a3.json)
- [Sample simulated events](examples/events/sample-events.json)

Status: **dense-city iteration implemented; owner trial pending**. The public demo has 50 functional buildings and eight building archetypes, with City/Overview, purpose/evidence, relationship lines, pan/zoom/home and an explicitly labeled nine-event simulation. Detailed labels are limited by zoom and available space; the building selector always lists every building. Live GitHub data is not connected. Private mapping evidence stays local; finer mapping boundaries remain proposals until owner confirmation.

Public examples are synthetic. Identifiable project maps and evidence live under ignored `.local/`; observing a project never authorizes modifying it.

## Run the prototype

Use Node.js 22.12+ (tested with 24.12) and npm:

```sh
npm ci
npm run dev
```

Open [the local viewer](http://127.0.0.1:5173/). No account, Firebase, source-repository execution or GitHub token is needed. The server binds to loopback.

The public checkout starts with the fictional [dense service-office map](examples/maps/sample-dense-office.json). In development only, an optional `.local/pilot-map.json` inside **RepoCity** is read by the dev server. The upload button can also open a map JSON from your device. That file is parsed locally in the browser and is not uploaded or persisted. Neither path scans or modifies the observed repository. The original [ten-building fixture](examples/maps/sample-service-office.json) still opens as a compact map.

```sh
npm test
npm run verify:assets
npm run notices
npm run build
npm run preview
```

The production build includes only the synthetic fixture and graphical assets. Preview does not serve the optional private mapping endpoint. Do not put identifiable source data in `public/` or `src/`.

Map schema version 1 supports the optional `layoutProfile: "dense"` and an explicit building `archetype`: `house`, `workshop`, `warehouse`, `office`, `tower`, `gallery`, `market` or `civic`. Dense maps allow 8–60 buildings, up to five districts and 15 buildings per district. Omitting the profile preserves the original compact layout (8–12 buildings, at most three per district); omitting the archetype selects `house`. Unsupported values and overfull layouts are rejected. This remains an authored layout, not an automatic architecture mapper or a general incremental city generator.

Visual assets: [Kenney Fantasy Town Kit 2.0](https://kenney.nl/assets/fantasy-town-kit), CC0; [original license](public/kit/License.txt), [exact subset and hashes](public/kit/manifest.json), [import/verification notes](docs/RESEARCH_AND_ASSETS.md). Regenerate the subset with `python tools/import_kenney.py`.

[Dependency notices](public/THIRD_PARTY_NOTICES.txt) are shipped with the build; `npm run notices` reproduces them from the locked packages and preserved license texts. GitHub Actions checks tests, assets, notices and the production build on push/PR.

See [visual direction and deliberate differences](docs/design/DIRECTION.md), [actual verification and remaining gates](docs/STATUS.md), and [next steps](docs/ROADMAP.md).
