# Prototype 001 — Small Meaningful City

Goal: prove that a pleasant small city helps the owner understand a real project's functional parts and changes. Built after the local source-backed mapping pilot, without requiring live GitHub integration.

## Scope

- Classic human low-poly scene; orthographic/isometric camera, pan and zoom.
- Approximately **8–12** functional buildings in a few districts, restrained streets and landscaping. Public demo content is synthetic.
- One coherent kit and a small set of authored, validated recipes; comprehensive Building Factory deferred.
- City/Overview, a purpose-first building card and relationships on demand.
- A few labeled simulated events: open, concurrent changes, failed check, review request, merge and closure without merge.
- Simple event stepping and reset. Full timeline, daily tour, epochs, landmarks and AI Architect deferred.
- Visible source coverage. Real structural mapping and simulated activity are distinguished.
- Desktop interaction/performance baseline and initial mobile feasibility check. Set numeric budgets from measurements before increasing complexity.

## Acceptance

- The owner recognizes each responsibility and can correct its mapping before accepting it.
- Clicking explains purpose, activity and evidence. Ordinary roads imply no dependency.
- Equal accepted map + data + seed + catalog/generator versions produce equal IDs/layout.
- New/repeated/delayed events do not move buildings or duplicate activities.
- Completing one of two PRs on the same building leaves the other visible.
- Closing without merge removes that activity, preserving the existing building and history.
- Failed checks belong to their activity. Unknown checks, requested review and submitted review remain separate.
- An older check result cannot certify a newer revision. Commit authors do not prove active agents.
- Sample recipes have no floating parts or unintended collisions. Expand socket tests as recipes grow.
- The owner can navigate/select buildings; record device/browser and measured behavior. Mobile qualification stays open until tested on a representative device.
- No observer code mutates or executes observed projects. Public fixtures contain no identifiable pilot data.

## Exit evidence

A running browser viewer, reproducible fixtures, source/state correspondence checks, render/interaction checks and recorded owner feedback. A map, screenshot or passing headless test alone does not complete this prototype.

Only then connect live GitHub reads and expand the city system in the [roadmap](ROADMAP.md).
