# Prototype 001 — Living District

Goal: prove visually pleasing, deterministic procedural district generation **without integrating GitHub yet**.

## Scope

- Classic human low-poly city; isometric/orthographic camera.
- One independently generated district (~30–50 small buildings) with connected roads, public spaces, decor and spare lots.
- At least: 3 plot sizes, 3 ground-floor variants, 3 floor variants, 4 roofs, 3 facade materials, 8 decor variants and 6 road shapes (can be sourced/imported, subject to licenses).
- Building-level compatibility validation; visible construction scaffolding and renovation.
- Four *logical* epoch stages with a minimum of two visually differentiated implementations.
- 20 simulated events affecting district growth: plan, build, review, CI pass/fail, merge, release and milestone.
- Timeline with pause/play, seek and deterministic replay.
- Click building for why it exists, its recipe and related simulated source IDs.
- Responsive interface and mobile performance check.

## Acceptance tests

- Equal seed + data + version -> identical layout and IDs.
- All roads are valid connected graph where connection is expected.
- No unintended collisions, floating floors or incompatible connectors.
- Ingesting a new event does not relocate existing buildings or erase history.
- Repeated import of same event does not duplicate construction.
- Failed checks shown as observed event states, not arbitrary building destruction.
- Unknown agent source -> anonymous / no named worker.
- Desktop and a representative Android mobile can navigate smoothly (measure frame rate and memory; set numeric targets after baseline profiling).
- Observer code has no mutations or executable commands against source repositories.

## Initial experiments for agents

1. **Asset audit**: inspect Kenney assets; list 3D formats, actual building components, licenses and limitations; do not assume plug-and-play sockets.
2. **Generator comparison**: implement small seeded rule-based lot/building generation; evaluate WFC narrowly for adjacency only.
3. **Rendering spike**: orthographic Three.js scene, pickable buildings, camera pan/zoom, optimized meshes and mobile profile.
4. **Event/replay spike**: canonical simulated PR events -> state reducer -> stable world changes.
5. **UX validation**: compare 3 alternative readable district layouts, test zoom, labels and click targets.

## Exit criteria

A reproducible playable-in-browser *viewer* with one living district, proven build compatibility and timeline. Only then connect to GitHub's read-only API.
