export type Check = "unknown" | "passed" | "failed";
export type Review = "unknown" | "requested" | "approved" | "changes_requested";
export interface Activity {
  id: string;
  buildingId: string;
  title: string;
  status: "open" | "merged" | "closed";
  head: string;
  lifecycleSequence: number;
  headSequence: number;
  checks: Record<string, { value: Check; sequence: number }>;
  reviews: Record<string, { value: Review; sequence: number }>;
}
export interface ActivityState {
  activities: Record<string, Activity>;
  seen: Record<string, true>;
}
type Base = { id: string; activityId: string; sequence: number };
export type CityEvent =
  | (Base & { kind: "open"; buildingId: string; title: string; head: string })
  | (Base & { kind: "head"; head: string })
  | (Base & { kind: "check"; head: string; value: Check })
  | (Base & { kind: "review"; head: string; value: Review })
  | (Base & { kind: "merge" | "close" | "reopen" });
export const emptyState = (): ActivityState => ({ activities: {}, seen: {} });

export function applyEvent(
  state: ActivityState,
  event: CityEvent,
): ActivityState {
  if (state.seen[event.id]) return state;
  const next: ActivityState = {
    activities: { ...state.activities },
    seen: { ...state.seen, [event.id]: true },
  };
  const previous = state.activities[event.activityId];
  if (event.kind === "open" && !previous) {
    next.activities[event.activityId] = {
      id: event.activityId,
      buildingId: event.buildingId,
      title: event.title,
      status: "open",
      head: event.head,
      lifecycleSequence: event.sequence,
      headSequence: event.sequence,
      checks: {},
      reviews: {},
    };
    return next;
  }
  if (!previous) return next; // The simulated fixture opens before dependent observations.
  const activity: Activity = {
    ...previous,
    checks: { ...previous.checks },
    reviews: { ...previous.reviews },
  };
  if (event.kind === "head" && event.sequence > activity.headSequence) {
    activity.head = event.head;
    activity.headSequence = event.sequence;
  } else if (event.kind === "check" || event.kind === "review") {
    const observations =
      event.kind === "check" ? activity.checks : activity.reviews;
    if (
      !observations[event.head] ||
      event.sequence > observations[event.head].sequence
    ) {
      if (event.kind === "check")
        activity.checks[event.head] = {
          value: event.value,
          sequence: event.sequence,
        };
      else
        activity.reviews[event.head] = {
          value: event.value,
          sequence: event.sequence,
        };
    }
  } else if (
    (event.kind === "merge" ||
      event.kind === "close" ||
      event.kind === "reopen") &&
    event.sequence > activity.lifecycleSequence
  ) {
    activity.status =
      event.kind === "merge"
        ? "merged"
        : event.kind === "close"
          ? "closed"
          : "open";
    activity.lifecycleSequence = event.sequence;
  }
  next.activities[event.activityId] = activity;
  return next;
}
export function replay(events: CityEvent[]) {
  return events.reduce(applyEvent, emptyState());
}
export function currentCheck(activity: Activity): Check {
  return activity.checks[activity.head]?.value ?? "unknown";
}
export function currentReview(activity: Activity): Review {
  return activity.reviews[activity.head]?.value ?? "unknown";
}
export function buildingActivities(state: ActivityState, buildingId: string) {
  return Object.values(state.activities).filter(
    (a) => a.buildingId === buildingId,
  );
}
