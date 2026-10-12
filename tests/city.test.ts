import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseMap } from "../src/domain/map";
import { createLayout } from "../src/domain/layout";
import {
  applyEvent,
  buildingActivities,
  currentCheck,
  currentReview,
  replay,
  type CityEvent,
} from "../src/domain/activity";
import { simulation } from "../src/data/simulation";

const fixture = JSON.parse(
  await readFile(
    new URL("../examples/maps/sample-service-office.json", import.meta.url),
    "utf8",
  ),
);
const map = parseMap(fixture);
const target = map.buildings[2].id;
const events = simulation(target).flatMap((step) =>
  step.event ? [step.event] : [],
);

test("two changes remain independent when one merges and the other closes", () => {
  const afterMerge = replay(events.slice(0, 8));
  assert.equal(afterMerge.activities.a.status, "merged");
  assert.equal(afterMerge.activities.b.status, "open");
  assert.equal(
    buildingActivities(afterMerge, target).filter((a) => a.status === "open")
      .length,
    1,
  );
  const afterClose = applyEvent(afterMerge, events[8]);
  assert.equal(
    buildingActivities(afterClose, target).filter((a) => a.status === "open")
      .length,
    0,
  );
  assert.equal(afterClose.activities.b.status, "closed");
  assert.equal(
    Object.keys(afterClose.activities).length,
    2,
    "history survives closure",
  );
  assert.equal(
    map.buildings.length,
    10,
    "activities cannot delete structural buildings",
  );
});
test("late success for an older revision cannot certify the current revision", () => {
  const oldResult = replay(events.slice(0, 5));
  assert.equal(oldResult.activities.a.head, "verzia-a2");
  assert.equal(oldResult.activities.a.checks["verzia-a1"].value, "passed");
  assert.equal(currentCheck(oldResult.activities.a), "unknown");
  assert.equal(currentCheck(replay(events.slice(0, 7)).activities.a), "passed");
});
test("review request does not become a check success or submitted approval", () => {
  const state = replay(events.slice(0, 6));
  assert.equal(currentReview(state.activities.b), "requested");
  assert.equal(currentCheck(state.activities.b), "unknown");
  assert.equal(currentReview(state.activities.a), "unknown");
});
test("deduplication, reset and replay are deterministic", () => {
  const state = replay(events);
  assert.deepEqual(replay([...events, ...events]), state);
  assert.strictEqual(applyEvent(state, events[0]), state);
  assert.deepEqual(replay([]), { activities: {}, seen: {} });
  assert.deepEqual(replay(events), state);
});
test("an older lifecycle event cannot undo closure; reopening keeps the identity", () => {
  const state = replay(events);
  const late: CityEvent = {
    id: "late-close",
    activityId: "a",
    sequence: 2,
    kind: "close",
  };
  assert.equal(applyEvent(state, late).activities.a.status, "merged");
  const reopened = applyEvent(state, {
    id: "reopen-b",
    activityId: "b",
    sequence: 10,
    kind: "reopen",
  });
  assert.equal(reopened.activities.b.status, "open");
  assert.equal(reopened.activities.b.id, "b");
  assert.equal(Object.keys(reopened.activities).length, 2);
});
test("a stale result for the same head cannot overwrite newer evidence", () => {
  const state = replay(events.slice(0, 3));
  const late: CityEvent = {
    id: "late-check",
    activityId: "a",
    sequence: 2,
    kind: "check",
    head: "verzia-a1",
    value: "passed",
  };
  assert.equal(currentCheck(applyEvent(state, late).activities.a), "failed");
});
test("mapping order and renamed labels do not change layout or identities", () => {
  const renamed = {
    ...map,
    buildings: map.buildings
      .map((b) => ({ ...b, label: "Nový názov" }))
      .reverse(),
    districts: [...map.districts].reverse(),
  };
  assert.deepEqual(createLayout(renamed), createLayout(map));
  assert.equal(new Set(createLayout(map).map((p) => p.id)).size, 10);
});
test("all sample recipe footprints stay separate", () => {
  const placements = createLayout(map);
  for (let i = 0; i < placements.length; i++)
    for (let j = i + 1; j < placements.length; j++) {
      const a = placements[i],
        b = placements[j];
      assert(
        Math.abs(a.x - b.x) > (a.width + b.width) / 2 + 0.35 ||
          Math.abs(a.z - b.z) > (a.depth + b.depth) / 2 + 0.35,
        `${a.id} overlaps ${b.id}`,
      );
    }
});
test("foreign IDs, unsupported maps and oversized inputs are rejected", () => {
  assert.throws(() => parseMap({ ...fixture, schemaVersion: 2 }));
  const bad = structuredClone(fixture);
  bad.relationships[0].to = "missing";
  assert.throws(() => parseMap(bad));
  const duplicate = structuredClone(fixture);
  duplicate.buildings[1].id = duplicate.buildings[0].id;
  assert.throws(() => parseMap(duplicate));
  assert.throws(() =>
    parseMap({ ...fixture, buildings: Array(100).fill(fixture.buildings[0]) }),
  );
});

test("every allowed pair of third district lots stays clear in a twelve-building map", () => {
  for (let first = 0; first < map.districts.length; first++)
    for (let second = first + 1; second < map.districts.length; second++) {
      const expanded = {
        ...map,
        buildings: [
          ...map.buildings,
          ...[first, second].map((index) => ({
            ...map.buildings[0],
            id: `extra-${index}`,
            districtId: map.districts[index].id,
          })),
        ],
      };
      const placements = createLayout(expanded);
      for (let i = 0; i < placements.length; i++)
        for (let j = i + 1; j < placements.length; j++) {
          const a = placements[i],
            b = placements[j];
          assert(
            Math.abs(a.x - b.x) > (a.width + b.width) / 2 + 0.35 ||
              Math.abs(a.z - b.z) > (a.depth + b.depth) / 2 + 0.35,
            `${a.id} overlaps ${b.id}`,
          );
        }
    }
});
