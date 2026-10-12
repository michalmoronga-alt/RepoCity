# Stav RepoCity

Checkpoint 13. októbra 2026: prvý lokálny 3D viewer je implementovaný a pripravený na používateľskú skúšku. Celá akceptácia Prototype 001 ešte nie je uzavretá.

## Hotové podklady

- Prečítaný pôvodný baseline a zapísaný schválený smer v [DECISIONS.md](DECISIONS.md).
- Konkrétny návrh významov a stavov v [CITY_RULES.md](CITY_RULES.md).
- Zúžený [prvý prototyp](PROTOTYPE_001.md) a upravené poradie [roadmapy](ROADMAP.md).
- Overené verejné popisy blízkych produktov; ich bežiace aplikácie neboli testované.
- Prečítané dva grafické archívy a ich licencie; z Fantasy Town Kit 2.0 je importovaných 21 GLB a jedna textúra (313 507 bajtov), s pôvodnou licenciou CC0 a manifestom hashov.
- Zvolený lokálny projekt pre prvú zdrojovo podloženú mapu.
- Majiteľ potvrdil lokálnu mapu 5 štvrtí, 10 budov a 8 vybraných zdrojovo doložených vzťahov.
- Zapísaný [postup pilotného mapovania](MAPPING_PILOT.md) a nezávislá [syntetická mapa](../examples/maps/sample-service-office.json).

## Implementované

- Classic 3D scéna: Mesto/Prehľad, výber budovy, účel a podklady, väzby na požiadanie, posun, priblíženie a návrat pohľadu.
- Desať stavov označenej simulácie: východisko a deväť udalostí vrátane súbežných zmien, zlyhanej kontroly, novšej verzie, oneskoreného výsledku, posúdenia, začlenenia a zatvorenia bez začlenenia.
- Budovy pri aktivite nemenia polohu. Dokončenie jednej zmeny zachová druhú; zatvorenie ponechá budovu a históriu.
- Verejná syntetická mapa a voliteľná lokálna mapa. Produkčný build nezačleňuje ani automaticky nenačítava lokálny pilot.
- Chybný import zachová dostupnú mapu; pri chýbajúcom WebGL zostáva výber a vysvetlenie budov dostupné v zozname.

## Overenie tohto checkpointu

- `npm test`: 10 úspešných testov nezávislosti aktivít, kontroly aktuálnej revízie, poradia a duplicít udalostí, replay, stabilného rozloženia, voľných pozemkov a vstupnej mapy.
- `npm run verify:assets`: 22 súborov, kontrola hashov a textúr; dekódované skutočné vrcholy a transformácie GLB, výšky a styčné kotvy stien/striech.
- `npm run build`: TypeScript aj produkčný build úspešné. Väčší grafický JS chunk zostáva upozornením: 988,89 kB / 266,61 kB gzip.
- Samostatný Chromium cez Playwright, desktop 1536 × 1024: kliknutie na 3D budovu, výber cez panel, väzby, posun/zoom/domov, deväť krokov a reset. Zlyhaná kontrola a výsledok staršej verzie sa zobrazili správne.
- Úzka plocha 390 × 844: bez vodorovného pretečenia, názvy budov bez prekrývania po ustálení pohľadu, simulácia a panel pod mestom. Ide o emulovanú veľkosť okna, nie kvalifikáciu skutočného telefónu.
- Produkčná ukážka: 10 budov, 177 draw calls, 22 232 trojuholníkov, 21 geometrií, 2 textúry v prvom dokončenom rámci. Po ustálení sa počas dvoch sekúnd nepridal renderovaný rámec. Nejde o meranie FPS na používateľovom GPU.
- Produkčná stránka bez chýb a upozornení konzoly; sieť iba na lokálny server, bez požiadavky na lokálny pilot. Zoznam zostal funkčný aj pri zámerne vypnutom WebGL.

Vstavané pripojenie overovacieho prehliadača bolo nefunkčné; overenie prebehlo v samostatnom Chromium. Snímky identifikovateľného pilotu sa nepublikujú.

## Ďalší krok

1. Majiteľ vyskúša vzhľad, orientáciu a simuláciu; zapíšeme konkrétne pripomienky a výsledok akceptácie.
2. Doladíme zistené problémy. Pred zväčšovaním scény používame pracovný rozpočet do 240 draw calls, 40 000 trojuholníkov a 1 MB grafických assetov pre tento malý pilot; výkon na reprezentatívnom zariadení treba ešte overiť.
3. Až po prijatí vieweru pripravíme prvé čítanie GitHubu, čerstvosť a chýbajúce údaje podľa [roadmapy](ROADMAP.md).

## Otvorené brány

Používateľská skúška vieweru, automatický mapper, stabilné pridávanie nových štvrtí, univerzálna Building Factory, kompletné socket/kolízne testy, výkon na skutočnom zariadení, živé udalosti, dlhodobá história a identifikácia agentov. Aktuálne rozloženie je malé autorské rozloženie; netvrdí univerzálne organické generovanie mesta.

Identifikovateľné dôkazy pilotu zostávajú v `.local/` a nevstupujú do verejného repozitára.
