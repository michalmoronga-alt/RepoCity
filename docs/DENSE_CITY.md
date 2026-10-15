# Hustejšie mesto — iterácia po spätnej väzbe z 15. októbra 2026

## Rozhodnutie majiteľa

Grafický štýl prvej ukážky pôsobí dobre. Desať budov však nevystihuje veľkosť rozsiahleho projektu: dve budovy na štvrť sú málo a domy sa príliš podobajú. Michal zvolil orientačný cieľ **40–60 budov, kompaktné husté mesto**.

## Čo sa zmení

- Existujúce veľké zodpovednosti rozčleníme na menšie vysvetliteľné funkcie. Každá skutočná budova potrebuje účel a zdrojové kotvy; počet spresní čítanie projektu.
- Päť štvrtí dostane skupiny budov, kratšie ulice a kompaktné bloky. Hustotu zvýši rozloženie aj počet budov.
- Typy budov dostanú odlišné pôdorysy a siluety: dielňa, sklad, kancelária, veža, ateliér a väčšia verejná budova. Okná, strechy a doplnky vytvoria ďalšie varianty pri zachovaní teplej palety.
- Vzdialený pohľad ukáže hlavné názvy a vybranú aktivitu; detailné názvy sa sprístupnia podľa výberu, priblíženia a voľného miesta. Zoznam budov zostáva dostupný.
- Podrobnejšie mapovanie má vlastnú verziu a zostane návrhom do potvrdenia. Potvrdenie pôvodných desiatich celkov sa nevydáva za potvrdenie nových hraníc.

## Poradie práce

1. Pripnúť nový čítaný snapshot; navrhnúť jemnejšie funkčné mapovanie. Konkrétne dôkazy zostávajú lokálne, verejná ukážka je nezávislá a fiktívna.
2. Rozšíriť recepty a rozloženie; zachovať možnosť načítať pôvodnú malú mapu. Nové rozloženie je výslovná nová generácia, nie dôkaz vyriešeného inkrementálneho rastu.
3. Overiť pôdorysy, styky dielov, výber, popisky a simuláciu pri väčšom počte budov. Zdieľať vykresľovanie opakovaných dielov; výkon väčšej scény sa musí nanovo zmerať.
4. Predložiť hustejšie mesto majiteľovi. Živé čítanie GitHubu nasleduje po doladení tejto vizuálnej iterácie.

## Stav

Implementované: verejná fiktívna mapa s 50 budovami, samostatný lokálny návrh jemnejšej zdrojovej mapy, osem typov stavieb a kompaktné uličné bloky. Zachované je načítanie pôvodnej malej mapy. Pozície sú rovnaké pri premenovaní, zmene poradia a prehrávaní aktivít.

Generátor `authored-neighborhoods-3` má tri pozemky v rade a vycentruje rady každej štvrte podľa jej obsahu. Pri zmene počtu budov sa teda rady môžu posunúť. Toto výslovné nové rozloženie nerieši stabilný inkrementálny rast.

Pri každom type sa overili reálne importované vrcholy, pôdorysná obálka, výška a kontakt so zemou. Doplnené vežičky a prístrešky majú zámerné architektonické prekrytia; nejde o univerzálne skladanie ľubovoľných dielov.

Čaká sa na prijatie nových funkčných hraníc a vzhľadu majiteľom. Merania a overené interakcie: [STATUS.md](STATUS.md).
