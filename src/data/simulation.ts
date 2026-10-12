import type { CityEvent } from "../domain/activity";
export interface Step {
  label: string;
  detail: string;
  event?: CityEvent;
}
export function simulation(buildingId: string): Step[] {
  return [
    {
      label: "Východiskové mesto",
      detail: "Budovy sú trvalé. Živá aktivita nie je pripojená.",
    },
    {
      label: "Začína rekonštrukcia",
      detail: "Ukážková zmena A sa otvorí. Na budove pribudne lešenie.",
      event: {
        id: "e1",
        activityId: "a",
        sequence: 1,
        kind: "open",
        buildingId,
        title: "Ukážková zmena A",
        head: "verzia-a1",
      },
    },
    {
      label: "Dve zmeny naraz",
      detail: "Ukážková zmena B má vlastný stav na tej istej budove.",
      event: {
        id: "e2",
        activityId: "b",
        sequence: 2,
        kind: "open",
        buildingId,
        title: "Ukážková zmena B",
        head: "verzia-b1",
      },
    },
    {
      label: "Kontrola A zlyhala",
      detail: "Zlyhanie patrí iba zmene A. Budova ani zmena B nezmiznú.",
      event: {
        id: "e3",
        activityId: "a",
        sequence: 3,
        kind: "check",
        head: "verzia-a1",
        value: "failed",
      },
    },
    {
      label: "Nová verzia A",
      detail:
        "Výsledok starej verzie neoveruje novú verziu. Aktuálna kontrola je neznáma.",
      event: {
        id: "e4",
        activityId: "a",
        sequence: 4,
        kind: "head",
        head: "verzia-a2",
      },
    },
    {
      label: "Oneskorený starší výsledok",
      detail:
        "Úspech verzie a1 ostane v histórii; verzia a2 stále nemá výsledok.",
      event: {
        id: "e5",
        activityId: "a",
        sequence: 5,
        kind: "check",
        head: "verzia-a1",
        value: "passed",
      },
    },
    {
      label: "B čaká na posúdenie",
      detail: "Vyžiadané posúdenie a kontrola sú odlišné informácie.",
      event: {
        id: "e6",
        activityId: "b",
        sequence: 6,
        kind: "review",
        head: "verzia-b1",
        value: "requested",
      },
    },
    {
      label: "Aktuálna kontrola A uspela",
      detail: "Teraz je overená verzia a2. Zmena B zostáva otvorená.",
      event: {
        id: "e7",
        activityId: "a",
        sequence: 7,
        kind: "check",
        head: "verzia-a2",
        value: "passed",
      },
    },
    {
      label: "Zmena A je začlenená",
      detail: "Lešenie zostane, pretože zmena B stále pokračuje.",
      event: { id: "e8", activityId: "a", sequence: 8, kind: "merge" },
    },
    {
      label: "Zmena B je zatvorená",
      detail:
        "B sa zatvorí bez začlenenia. Lešenie zmizne, budova a história zostanú.",
      event: { id: "e9", activityId: "b", sequence: 9, kind: "close" },
    },
  ];
}
