# Pilot: od zdrojov k zrozumiteľnej mape

Cieľom prvého pilotu je overiť, či vlastník vo funkčných štvrtiach a budovách spozná svoj projekt. Výsledkom je návrh mapy na opravu a potvrdenie. Automatický mapper ani 3D viewer tým ešte nevznikajú.

## Postup

1. Zapísať presný lokálny snapshot a stav pracovného stromu. Čítať pravidlá projektu. Zdrojový projekt počas mapovania nemeniť ani nespúšťať; vzdialený aktuálny stav bez overenia netvrdiť.
2. Z dokumentácie vytvoriť hypotézu funkčných zodpovedností. Následne prečítať skutočné zdroje a vybrané volania. Názov priečinka sám osebe neurčuje štvrť.
3. Navrhnúť približne 5 štvrtí a 8–12 budov. Ku každej napísať jednu vetu o účele a uložiť zdrojové dôkazy. Počet je rozpočet malého pilotu, nie univerzálne pravidlo.
4. Zaznamenať niekoľko doložených vzťahov vrátane smeru a významu. Vybraná cesta vo volaniach nie je úplný graf závislostí.
5. Predstaviť klikateľné rozdelenie vlastníkovi. Overiť názvy, hranice a chýbajúce zodpovednosti; rozhodnutia zapísať. Všeobecný súhlas s produktom nenahrádza potvrdenie konkrétnej mapy.

## Čo oddeliť

- **Existencia v zdrojoch:** doložená zodpovednosť a jej konkrétne súbory/miesta.
- **Prijatie mapy:** či vlastník potvrdil navrhnutý názov a hranice budovy.
- **Živá aktivita a výsledky:** samostatné pozorovania s časom a revíziou. Bez získaných údajov zostávajú neznáme.

Používateľská kontrola dát vo vnútornom projekte nie je automaticky úspešné CI. Existujúce testy nie sú dôkazom, že teraz prešli.

Zdieľané ovládanie má jednu budovu s väzbami, nie kópiu v každej štvrti. Spoločná identita, synchronizácia, dokumentácia a testy môžu byť infraštruktúrou alebo pripojenými podkladmi. Nevynucovať z nich funkčné štvrte.

## Hranice mapovania

Prvá mapa zachytáva reprezentatívne zodpovednosti. Prierezový súbor môže slúžiť viacerým budovám. Pokiaľ nie je odôvodnené vlastníctvo jeho zmien, budúca udalosť má byť označená ako nepriradená alebo nejasná; nesmie sa podľa názvu potichu priradiť jednej budove.

ID budovy sa nemení pri úprave názvu. Rozdelenie alebo spojenie budov potrebuje novú verziu mapovania a zapísanú väzbu na pôvodné ID. Konkrétny migračný mechanizmus sa navrhne pred živou históriou.

## Podklady a súkromie

Identifikovateľná mapa, cesty, revízie a zdrojové výpisy pilotu zostávajú v ignorovanom `.local/`. Do verejného repozitára patria všeobecné pravidlá a nezávislé syntetické príklady. Pred každým publikovaním skontrolovať pripravený diff, nielen názvy súborov.

[Ukážková mapa servisnej firmy](../examples/maps/sample-service-office.json) obsahuje 10 fiktívnych budov. Je to návrh dátového tvaru bez implementovaného loadera. Vzťahy nie sú výsledkom čítania skutočného projektu.

## Brána pred 3D prototypom

- Vlastník vie vysvetliť účel každej budovy a potvrdil jej hranice.
- Mapa má stabilné ID, uvedený rozsah a dohľadateľné podklady.
- Existencia, prijatie a živý stav sa nezlievajú do jedného ukazovateľa.
- Prierezové a nepriradené časti ostávajú viditeľné.

Po splnení brány pokračovať podľa [PROTOTYPE_001.md](PROTOTYPE_001.md). Aktuálny stav brán je v [STATUS.md](STATUS.md).
