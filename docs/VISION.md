# Vision and product semantics

## What RepoCity is

A fun, universal, visually rich **living mirror** of software development. A passive city-building simulation that consumes repository events and shows the project evolving in time. No gameplay actions may change the source project.

## Hierarchy

| Software concept | City representation |
|---|---|
| Repository / project | City |
| Architectural domain / package group / meaningful subsystem | District |
| Component / service / bounded responsibility | Persistent building or ensemble |
| Dependencies or structural links | Optional meaningful streets / bridges; aesthetics fill other roads |
| PR touching existing component | Temporary scaffold, renovation, construction activity |
| PR introducing a new component | Proposed site, then building when merged |
| CI/review | Inspector / testing effects with sourced outcomes |
| Release / milestone | Gate event, unlock, monument |
| Documentation | Shared library and local neighborhood archives |
| Agent session | Worker only when source telemetry supports identification |
| Timeline | Historical replay; do not rewrite history |

## Shared city infrastructure

Town Hall (repository), Library (docs), Builders Guild (work activity), Test Tower (CI), Release Gate (releases), Depot (dependencies/assets), Hall of Fame (milestones). Some only unlock when relevant evidence exists.

## Districts

Districts are *collections of buildings*, not one building per module. The mapper clusters semantically meaningful modules; scanner heuristics and optional AI suggestions must expose confidence and allow a deterministic fallback. Different repos may have different scales and architectures.

Example for a furniture/CAD engine: Hardware District, Fronts District, Materials District, AI Workflow District. Example for a typical web app: Frontend, API, Data, Integrations.

## Growth and history

Four proposed epochs: Settlement, Growing Town, Developed City, Golden Age. Milestones unlock visual capacity (e.g. higher floors, special buildings) but are **not** objective judgments of developer performance. Epoch mapping must be versioned and explainable. A large initial import creates a consistent snapshot; historical replay should only claim coverage for ingested history.

## Themes

MVP: Classic human town. Future: Magic World and Orcs, implemented by swapping theme packs and labels without changing repo semantics. Additional personalization through visual recipes, not uncontrolled asset proliferation.

## AI Architect

The architect reads a sanitized project summary and existing city layout, proposes:
- district identities, placements, palettes and landscaping;
- recipes from validated interchangeable parts;
- rare landmarks reflecting verified milestones;
- future theme variants.

The architect may NOT modify source repos, PRs, tests, pipelines, agent configs or workflow. Generated city content must pass a schema validator, asset compatibility tests, spatial collision tests and style limits before it enters the world. The deterministic non-AI generator must always remain available.

## Non-goals for first prototype

No agent orchestration, code editing, multiplayer, in-game resource economy, full 3D free-camera game, asset marketplace or always-on AI model calls.
