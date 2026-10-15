import { ArrowRight, GitBranch } from "lucide-react";
import type { CityMap } from "../domain/map";
import { ARCHETYPE_LABELS } from "../domain/archetypes";
import {
  buildingActivities,
  currentCheck,
  currentReview,
  type ActivityState,
} from "../domain/activity";

const CHECK_LABELS = {
  unknown: "Neznáma",
  passed: "Úspešná",
  failed: "Zlyhaná",
};
const REVIEW_LABELS = {
  unknown: "Neznáme",
  requested: "Vyžiadané",
  approved: "Schválené",
  changes_requested: "Vyžiadané úpravy",
};
const STATUS_LABELS = {
  open: "Otvorená",
  merged: "Začlenená",
  closed: "Zatvorená bez začlenenia",
};
interface Props {
  map: CityMap;
  selected: string;
  onSelect: (id: string) => void;
  activity: ActivityState;
  relationships: boolean;
  onRelationships: () => void;
}
export default function Inspector({
  map,
  selected,
  onSelect,
  activity,
  relationships,
  onRelationships,
}: Props) {
  const building = map.buildings.find((b) => b.id === selected)!;
  const district = map.districts.find((d) => d.id === building.districtId)!;
  const activities = buildingActivities(activity, building.id);
  const links = map.relationships.filter(
    (r) => r.from === selected || r.to === selected,
  );
  return (
    <aside className="inspector" aria-label="Vybraná budova">
      <div className="building-choice">
        <label htmlFor="building-choice">Budova</label>
        <select
          id="building-choice"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
        >
          {map.buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.shortLabel}
            </option>
          ))}
        </select>
      </div>
      <div aria-live="polite">
        <h2>{building.label}</h2>
        <p className="district-name">{district.label}</p>
        <p className="quiet">{ARCHETYPE_LABELS[building.archetype]}</p>
        <p className="purpose">{building.purpose}</p>
      </div>
      <div className="source-scope">
        <div>
          <span>Rozsah</span>
          <strong>
            {map.synthetic
              ? "Fiktívna mapa"
              : map.ownerConfirmed
                ? "Prijatá lokálna mapa"
                : "Návrh lokálnej mapy"}
          </strong>
        </div>
        <div>
          <span>Stav údajov</span>
          <strong>Živé údaje nepripojené</strong>
        </div>
      </div>
      {activities.length > 0 ? (
        <section className="activity-section" aria-label="Simulované zmeny">
          <h3>Simulované zmeny</h3>
          {activities.map((a) => (
            <div key={a.id} className={`activity-row ${a.status}`}>
              <div>
                <strong>{a.title}</strong>
                <span>{STATUS_LABELS[a.status]}</span>
              </div>
              <dl>
                <div>
                  <dt>Kontrola</dt>
                  <dd className={`check-${currentCheck(a)}`}>
                    {CHECK_LABELS[currentCheck(a)]}
                  </dd>
                </div>
                <div>
                  <dt>Posúdenie</dt>
                  <dd>{REVIEW_LABELS[currentReview(a)]}</dd>
                </div>
              </dl>
              <span className="revision">{a.head}</span>
              {Object.keys(a.checks).some((head) => head !== a.head) ? (
                <details className="history">
                  <summary>Staršie kontroly</summary>
                  {Object.entries(a.checks)
                    .filter(([head]) => head !== a.head)
                    .map(([head, check]) => (
                      <p key={head}>
                        {head}: {CHECK_LABELS[check.value]} · neoveruje aktuálnu
                        verziu
                      </p>
                    ))}
                </details>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}
      <section className="relationship-section">
        <div className="section-heading">
          <h3>Súvisiace časti</h3>
          <button
            className={`icon-button ${relationships ? "active" : ""}`}
            aria-label={relationships ? "Skryť väzby" : "Ukázať väzby"}
            aria-pressed={relationships}
            onClick={onRelationships}
          >
            <GitBranch size={18} />
          </button>
        </div>
        {links.map((r) => {
          const other = map.buildings.find(
            (b) => b.id === (r.from === selected ? r.to : r.from),
          )!;
          const from = map.buildings.find((b) => b.id === r.from)!;
          const to = map.buildings.find((b) => b.id === r.to)!;
          return (
            <button
              key={r.id}
              className="relationship-row"
              onClick={() => onSelect(other.id)}
            >
              <span>
                <strong>{other.shortLabel}</strong>
                <small>{r.label}</small>
                <span className="relation-direction">
                  {from.shortLabel} → {to.shortLabel}
                </span>
              </span>
              <ArrowRight size={16} />
            </button>
          );
        })}
        {links.length === 0 ? (
          <p className="quiet">V tejto mape nie sú doložené ďalšie väzby.</p>
        ) : null}
        {relationships ? (
          <p className="quiet">
            Zvýraznené spojenia sú vzťahy z mapy. Bežné cesty znamenajú iba
            rozloženie.
          </p>
        ) : null}
      </section>
      <details className="evidence">
        <summary>Podklady a pokrytie</summary>
        <p>
          {map.synthetic
            ? "Budovy a vzťahy sú vymyslená ukážka. Neopisujú skutočný repozitár."
            : "Účel budovy je doložený uvedeným snapshotom. Aktuálny stav behu, kontrol a práce agentov je neznámy."}
        </p>
        {map.snapshot ? (
          <p>
            Snapshot: <code>{map.snapshot.slice(0, 10)}</code>
            {map.reviewDate ? ` · čítané ${map.reviewDate}` : ""}
          </p>
        ) : null}
        {building.sourceAnchors.map((a) => (
          <p key={`${a.path}:${a.line}`}>
            <code>
              {a.path}:{a.line}
            </code>
          </p>
        ))}
        <p>
          Mapa: {map.mappingVersion}. Vybrané vzťahy nepredstavujú úplný graf
          závislostí.
        </p>
      </details>
    </aside>
  );
}
