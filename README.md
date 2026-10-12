# RepoCity 🏙️

**Watch your codebase grow into a living city.**

RepoCity is a universal, read-only visual companion for software repositories. A repository becomes a city; architectural domains become districts; components become buildings; pull requests become visible construction, renovation, inspection and completion.

RepoCity is **not** an orchestrator. It must never modify source repositories, branches, issues, pull requests, CI, or existing agent workflows.

## Current direction (12 Oct 2026)

- **Primary value (approved):** a calm companion **and** a practical map for people working through AI agents; explain functional responsibilities and observed activity in plain language.
- **First experience:** confirm/correct the map, switch City/Overview and inspect purpose, evidence and related changes.
- **First proof:** map a real project before expanding the art system; build a scene with **8–12 buildings**. Identifiable pilot evidence stays local.
- **Visual:** Classic human city first. Magic World and Orcs are future theme packs.
- **Rendering:** lightweight low-poly **3D with an orthographic/isometric camera**; React + Three.js / React Three Fiber is the initial candidate, subject to prototype benchmarks.
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

Status: **discovery / pre-prototype**. This repository contains a product/design baseline, not a functioning game yet.

Public examples are synthetic. Identifiable project maps and evidence live under ignored `.local/`; observing a project never authorizes modifying it.
