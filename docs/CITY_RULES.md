# Pravidlá mesta — v0.1

Konkrétny návrh pre prvú mapu a prototyp podľa [schváleného smeru](DECISIONS.md). Pravidlá zatiaľ nie sú overenou implementáciou.

## Význam prvkov

| Prvok | Význam | Čo ukáže kliknutie |
|---|---|---|
| Mesto | Jeden projekt | Zdroj, posledná aktualizácia, pokrytie histórie |
| Štvrť | Funkčná oblasť | Účel, budovy a dôvod zaradenia |
| Budova | Trvalá zodpovednosť alebo služba | Účel, priradené zdroje a všetky súvisiace aktivity |
| Pozemok | Návrh novej časti | Otvorená zmena; budova vznikne po potvrdení začlenenej štruktúry |
| Lešenie | Otvorená zmena existujúcej budovy | Samostatné aktivity všetkých súvisiacich zmien |
| Kontrolná značka | Pozorovaný výsledok kontroly | Výsledok, čas, príslušná verzia a zdroj |
| Pamätník | Overené vydanie alebo zaznamenaný míľnik | Pôvod; ručný míľnik je označený ako ručný |
| Bežná ulica | Usporiadanie mesta | Nemá automaticky architektonický význam |
| Zvýraznené spojenie | Zdrojovo podložený vzťah | Smer, dôvod, zdroj a istota |
| Pracovník | Pozorovaná aktivita | Identifikácia konkrétneho agenta len pri spoľahlivom dôkaze |

Dekoratívny pohyb obyvateľov je kulisa. Nevyjadruje počet pracujúcich ľudí alebo agentov.

## Prvé potvrdenie mapy

Budova môže pokrývať súbory z viacerých priečinkov. Súbor môže mať vedľajší vzťah k ďalším budovám; jedna udalosť sa tým nestáva viacerými dokončenými úlohami.

Mapper navrhne účel, zdrojové kotvy a istotu zaradenia. Používateľ opraví názov, skupinu alebo priradenie. Prijatá mapa sa uloží v RepoCity. Premenovanie cesty alebo budovy samo nevytvorí novú identitu.

Neurčité zaradenie zostáva návrhom na potvrdenie. Zdieľané UI, identita a pozorovacie mechanizmy môžu byť spoločnou infraštruktúrou s prepojeniami namiesto duplikovaných domén.

## Mesto a Prehľad

**Mesto:** pokojná scéna, stabilná kamera, stručné názvy štvrtí, nenápadná aktivita a dostupná karta budovy.

**Prehľad:** názvy budov, súvisiace otvorené zmeny a samostatné stavy kontrol a review. Výber budovy ukáže súvisiace časti.

Karta najprv vysvetlí účel, potom pozorované aktivity a zdroje. Návrhy AI sa označujú samostatne.

## Každá zmena má vlastný stav

| Situácia | Správanie mesta |
|---|---|
| Otvorená zmena | Samostatná aktivita a lešenie |
| Dve zmeny tej istej časti | Zostanú viditeľné obe; dokončenie jednej nezruší druhú |
| Vyžiadané review | „Čaká na review“; nie dôkaz pracujúceho kontrolóra |
| Dokončené review | Skutočný výsledok review, oddelený od výsledkov testov |
| Zlyhaná kontrola | Značka danej zmeny; existujúca budova zostáva |
| Chýbajúce údaje | „Neznáme“; absencia testov sa tvrdí iba pri dôkaze |
| Úspech staršej verzie | Historický výsledok, ktorý neoveruje novšiu verziu |
| Začlenenie zmeny | Dokončí sa daná aktivita; budova sa upraví podľa potvrdeného rozdielu |
| Zatvorenie bez začlenenia | Aktivita sa zruší, budova a historický záznam zostanú |
| Znovuotvorenie | Obnoví sa tá istá aktivita |
| Priama zmena hlavnej vetvy | Označená priama zmena bez vymysleného review |
| Návrat zmeny | Nová rekonštrukcia bez vymazania pôvodnej histórie |
| Zjednodušenie alebo odstránenie časti | Úprava mapy podľa potvrdenej štruktúry; nie automaticky zhoršenie |
| Výpadok synchronizácie | Posledný známy stav s časom aktualizácie a viditeľnou neaktuálnosťou |

Jednotlivá kontrola, súhrn kontrol a pripravenosť na začlenenie sú rôzne informácie. Výsledky sa viažu k príslušnej verzii a identite behu. Review má vlastné pravidlá aktuálnosti. Prvý prototyp nesľubuje úplné vyhodnocovanie pravidiel GitHubu.

## Veľkosť a rast

Prvý prototyp používa obmedzené vizuálne archetypy. Pôdorys a výška nemerajú kvalitu, množstvo práce ani počet PR. Každá budúca metrika potrebuje jednotku, zdroj a vysvetlenie. Zmenšenie projektu nesmie automaticky znížiť jeho reputáciu.

Štyri epochy sú ďalšia fáza. Ich pravidlá musia byť vysvetliteľné a verzované.

## Čas a stabilita

- Rovnaký vstup, prijatá mapa, seed, verzie generátora a katalógu znamenajú rovnaké mesto.
- Nová udalosť ani premenovanie nepresťahujú existujúcu budovu.
- Opakovaná udalosť nevytvorí duplicitnú aktivitu; oneskorený výsledok neoverí novší kód.
- Prvý import je snapshot, nie vymyslená história stavby.
- Prehrávanie histórie uvádza dostupné obdobie a medzery. Nová interpretácia mapy má vlastnú verziu; staré záznamy zostanú reprodukovateľné.

## Prvá obrazovka

Scéna s približne 10 budovami, posun/priblíženie, Mesto/Prehľad, jedna karta budovy a stručná legenda. Stačí niekoľko označených ukážkových udalostí, krokovanie a návrat na začiatok; plná časová os je ďalší krok.

Konkrétne pilotné podklady sú v ignorovanom `.local/`. Verejné príklady neobsahujú názvy, cesty, commity, PR ani identifikátory pozorovaného projektu. Pred publikovaním sa kontroluje aj obsah diffu.
