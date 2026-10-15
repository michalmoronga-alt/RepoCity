# Prvý vizuálny prototyp — 13. október 2026

Vizuálna téza: pokojné klasické mesto z jemných kamenných a drevených dielov, teplá svetlá plocha a jedno zelené zvýraznenie.

Obsah: hlavná 3D pracovná plocha; malá hlavička s projektom a Mesto/Prehľad; jeden panel účelu, aktivít a podkladov; dolný pás s označenou simuláciou a krokovaním.

Interakcia: posun/priblíženie pri pevnom uhle; nenápadné zvýraznenie výberu; objavenie lešenia a značky kontroly po výslovnom kroku simulácie. Bez nepretržitého pohybu ani vymyslených agentov.

[Vizuálny koncept](prototype-concept.png) bol vygenerovaný vstavaným Image Gen ako návrh vzhľadu, nie ako zdroj dát ani hotové UI. Použitý brief: „RepoCity; complete desktop application; 10 Classic low-poly buildings in 5 paired districts; warm stone background #f3f1e9; forest ink #263d32; accent #476a55; serif wordmark; small header, dominant town, plain inspector and simulation strip; Kenney-compatible modular architecture; no fake scores or source-project identifiers.“

## Dizajnový systém

- Pozadie `#f3f1e9`, text `#263d32`, sekundárny text `#69716b`, oddelenia `#d7d8cf`, hlavná akcia `#476a55`.
- Georgia pre názov a vybranú budovu; Segoe UI/system sans pre ovládanie a bežný text.
- Hlavička približne 80 px, panel 320 px, dolný pás približne 108 px na desktope. Na úzkej ploche panel pod mestom.
- Číre plochy, tenké deliace čiary, malé oblé tlačidlá, žiadne vnorené karty. Ovládanie má viditeľné focus stavy.
- Ikony Lucide: priblíženie, oddialenie, návrat pohľadu, krok, reset, zatvorenie. SVG favicon je lokálna jednoduchá značka RepoCity.

## Funkčné požiadavky majú prednosť pred obrázkom

Generátor obrázka doplnil vlastné názvy súvisiacich oblastí. Implementácia používa skutočné názvy a vzťahy z načítanej mapy. Desať budov a dve simultánne aktivity sa overujú na dátach.

Presnú maliarsku geometriu obrázka nenahrádzame bitmapou: scéna sa skladá zo zvolenej licencovanej 3D stavebnice. Rozdiely v detailoch domov a teréne sú zámerné vzhľadom na túto požiadavku. Obrázok určuje náladu, farby, rozloženie a čitateľnosť, nie sockety ani zdrojové fakty.

Technický základ: React 19 + React Three Fiber 9 podľa [pravidla kompatibility](https://r3f.docs.pmnd.rs/getting-started/installation); kreslenie na požiadanie podľa [odporúčania R3F](https://r3f.docs.pmnd.rs/advanced/scaling-performance). Výsledný výkon sa musí merať v bežiacej scéne.

## Porovnanie bežiacej scény s konceptom

1. Kompozícia: dominantné mesto, horná hlavička, pravý panel a spodná simulácia zostali; na úzkej ploche idú ovládanie a panel pod scénu.
2. Typografia: veľký serifový názov a titul budovy; drobnejšie jednotné sans ovládanie. Názvy sa čítajú z mapy.
3. Farby: svetlé teplé pozadie, zelený výber, terakotové strechy. Koncept má mäkší maliarsky tieň; prototyp používa skutočné low-poly objekty a WebGL tiene.
4. Hustota: desať domov v piatich pároch, pokojná zeleň a centrálna fontána. Terén je jednoduchý autorský ostrov; detailnejšie fasády, terasy a organické uličky ešte nie sú hotové.
5. Interakcia: výber, väzby, kamera a simulácia sú ovládateľné. Popisky sa oddeľujú, pri kolízii sa potlačí názov štvrte; na úzkej ploche je doplnkový zoznam budov.

Odchýlky sú zámerné a nejde o presnú 10/10 reprodukciu obrázka. Texty konceptu boli nahradené účelom a názvami načítanej mapy; neoverený živý stav sa označuje ako nepripojený. Konečnú príjemnosť a užitočnosť ešte posúdi majiteľ v bežiacom prototype.

## Spätná väzba a hustejšia iterácia — 15. október

Majiteľ ocenil grafické pôsobenie, ale vyžiadal hustejšie mesto s rôznymi budovami a zvolil mierku 40–60. Predchádzajúci koncept je preto referenciou farieb, typografie a rámca aplikácie; jeho desať domov už neurčuje cieľovú hustotu.

Bežiaca iterácia zachováva teplé pozadie, zelené ovládanie, dominantné mesto, pravý panel a simuláciu. Mení počet a skladbu domov: osem siluet, rozdielne pôdorysy, nižšie sklady, vysoké kontrolné veže, dvojpodlažné kancelárie, ateliéry a verejné budovy s vežičkou. Terakotové strechy dopĺňa tlmená sivá; rastie hustota ulíc a budov pri zachovaní okrajovej zelene. Popisky sa prispôsobujú priestoru a priblíženiu. Pôvodné rozloženie desať domov / dva na štvrť je týmto zámerne nahradené.
