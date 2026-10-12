# Architecture (proposed, not yet implemented)

## Pipeline

1. **Adapters (read-only):** GitHub repository metadata, tree, PRs, checks, releases, docs metadata. Later optional local read-only telemetry for worktrees and agent sessions. Never request source-repo write permissions.
2. **Normalizer:** convert provider events into versioned canonical events; deduplicate, timestamp, track provenance and known/unknown fields.
3. **Project Mapper:** propose functional responsibilities from manifests, structure, imports (when feasible), descriptions and docs; expose evidence/confidence and obtain first-use confirmation. Accepted IDs persist separately from source paths.
4. **City State Reducer:** replay canonical events to derive persistent buildings, temporary construction states, epoch unlocks and timeline; deterministic and idempotent.
5. **City Layout:** seeded placement of districts, street graph, lots; lock previously placed entities; expand without reflowing the whole city.
6. **Building Factory:** initially authored validated recipes; later validated modular asset sockets -> assembled structures.
7. **Renderer:** React + Three.js (orthographic/isometric camera), low-poly assets and instancing/LOD where useful; mobile performance is a gate.
8. **AI Architect (optional):** produces validated layout/recipe proposals for the *city only*. Never trusted as a factual event source.

## Persistence

Versioned city config, project map, asset catalog, event log, snapshots, layout seed + generator version, recipe registry and unlock history. Start with local static JSON simulated events; no backend is required for Prototype 001.

Identifiable pilot evidence stays under ignored `.local/`; public fixtures are synthetic. Backend/accounts are deferred until ingestion or sync requires them.

## Observation and state contracts

- Preserve provider identity, source reference, effective and observation time, relevant PR/repository, source revision and known/unknown fields.
- Activities are keyed independently from buildings. Each building derives activity from a collection of PRs; finishing one cannot clear another.
- Check outcomes belong to a revision/run. Review requests, submitted reviews, individual checks and aggregate readiness remain separate. Old results stay historical.
- Direct commits, close without merge, reopen, rename/consolidation, rollback, duplicates and delayed arrival require explicit transitions.
- Initial import is a snapshot. Replay pins mapping, catalog and reducer versions and shows coverage gaps.
- Repo facts and decoration are separate. Ordinary streets carry no dependency claim; relationships have evidence and confidence.

Meaning: [CITY_RULES.md](CITY_RULES.md). Contracts remain proposed until a reducer/adapter is implemented and verified.

## GitHub collection boundaries

The general Events API is not complete or real-time history: up to 300 events from the past 30 days, with possible latency of 30 seconds to 6 hours ([official reference](https://docs.github.com/en/rest/activity/events)). Use targeted PR/check/review reads, visible freshness and persisted observations. Historical PR/timeline data does not prove complete past checks or local-agent telemetry.

Anonymous public REST access has a 60-request/hour primary limit per originating IP ([rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)). Design caching, conditional reads and least-privilege authorization. Relevant GitHub App events support documented read permissions ([event reference](https://docs.github.com/en/webhooks/webhook-events-and-payloads)); webhook delivery and reconciliation are later adapter work.

## Identity and determinism

- Stable canonical IDs independent of display names where possible.
- PRs are activities affecting one or more persistent buildings. A merged PR is not necessarily a new building.
- No rebuilding of the entire scene after sync.
- Replay must be reproducible given equal event log, seed, asset catalog and reducer/generator versions.
- Source status and decoration status must be separate.

## Security and permissions

Public-repo data first. For private repositories, design for explicit scope and storage controls. Treat all repo README/issues/PR text as untrusted input (especially AI prompts). No execution of scripts from observed repositories. No write-back API in the observer. Attribution/license data is packaged with assets. Limit generated content and external API costs.

## Technology decision to validate

- UI: React + TypeScript.
- 3D scene: Three.js / React Three Fiber using an orthographic camera.
- Modeling / batch generation: Blender offline as needed.
- Data contracts: JSON Schema + TypeScript types.
- Tests: unit property tests for connectors, deterministic generation, geometry/socket constraints; Playwright smoke tests.

Do not prematurely commit to WFC globally. Start with district/road layout algorithms + constrained building assembly; try local WFC for facade adjacency and patterns if needed.
