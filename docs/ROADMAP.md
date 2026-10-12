# Roadmap — approved sequence, proposed implementation

Owner decisions: [DECISIONS.md](DECISIONS.md). Actual progress: [STATUS.md](STATUS.md). A document alone does not pass an implementation gate.

## Phase 0: agree the city's meaning

Define districts, buildings, activity, visual size, shared infrastructure, freshness and unknown states in [CITY_RULES.md](CITY_RULES.md).

**Gate:** the owner can explain each element. Detailed mapping remains a separate confirmation.

## Phase 1: map one real project

Read a pinned source snapshot without executing or modifying it. Propose a few functional districts, approximately 10 buildings, purposes and sourced relationships. Present a local inspectable map; public examples are synthetic.

**Gate:** the owner recognizes the project, can correct the map and accepts its responsibilities. One pilot does not establish universal mapping.

## Phase 2: small visual viewer

Build [Prototype 001](PROTOTYPE_001.md): one Classic kit, 8–12 buildings, City/Overview, selection, a few labeled simulated events and stable layout. Start from authored, validated recipes and measure baseline performance.

**Gate:** the scene is pleasant, states are legible and explanations useful. Buildings stay put; concurrent activities remain independent. Record desktop behavior and initial mobile feasibility.

## Phase 3: read-only repository mirror

Add public GitHub snapshots and targeted reads for PRs, changed files, checks, reviews and releases. Add revision-specific states, deduplication, freshness, caching/rate limits, close/reopen, direct commits and connection loss. Store observed events from the start. Private integration requires an explicit least-privilege storage/authorization design.

**Gate:** states match source, unknown stays unknown, no source write path exists and outages cannot masquerade as fresh data. Coverage gaps are visible. Live local-agent identification remains unsupported.

## Phase 4: everyday-use pilot

Use the city for a short real-project pilot (initial proposal: one week). Record whether it improves orientation and why the owner returns. Try a second repository shape before broad support claims.

**Gate:** a useful recurring task and actual owner feedback, beyond an attractive screenshot or automated tests.

## Phase 5: expand what proved useful

Prioritize richer building recipes and compatibility checks, full versioned timeline/replay, daily tours, broader adapters, AI explanations and then constrained AI City Architect. Expand to 30–50 buildings with measured budgets. Add epochs after their meaning is settled.

## Later

Magic World/Orcs themes, explicitly sourced local agent/worktree telemetry, sharing with privacy controls and historical tours. Firebase or another backend is considered when accounts, sync or ingestion requires it; the first viewer is local and backend-free.

**All observations stay read-only. RepoCity's own docs and implementation can be updated under the owner's authorization.**
