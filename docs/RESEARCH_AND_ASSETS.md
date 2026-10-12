# Research, assets & provenance register

**Policy:** maximize use of legally reusable assets and algorithms. External examples are inspiration unless their explicit license allows code/asset reuse. Check source and license at the time of import; document versions, author, URL, changes and required attribution. No extraction/copying of proprietary game models or textures.

## Games — design references (not reusable assets)

- **Townscaper** — context-sensitive modular houses, roofs, terraces and constrained/WFC-style combinations. https://www.townscapergame.com/
- **Foundation** — modular monuments, components/part requirements, organic paths. https://www.polymorph.games/foundation/ and https://www.polymorph.games/foundation/modding/
- **Tiny Glade** — naturalistic contextual detail generation and architectural personalization. https://store.steampowered.com/app/2198150/Tiny_Glade/
- **Manor Lords** — adaptable plots and growing house extensions. https://store.steampowered.com/app/1363080/Manor_Lords/
- **SimCity 2000, The Settlers II, Pharaoh, Anno 1404** — readable city stages, citizen/path animation, specialized districts, landmarks.

## Implementation references / potential reuse

| Source | Useful for | License / caution |
|---|---|---|
| https://github.com/marian42/wavefunctioncollapse | Modular adjacency constraints / WFC city | MIT verified in root LICENSE on 2026-10-12; Unity implementation, not a drop-in web generator; preserve notices if reused |
| https://github.com/josauder/procedural_city_generation | Streets, plots and Blender urban generation | MPL-2.0 verified in root LICENSE on 2026-10-12; Python/Blender reference; file-level reuse review still required |
| https://github.com/p-schulz/osm_building_grammar | Building grammar, floors, roofs and facades | **license not verified; reference only until reviewed** |
| https://kenney.nl/assets/fantasy-town-kit | Low-poly Classic-style 3D buildings | CC0 verified in downloaded 2.0 License.txt; 167 GLB models in inspected archive (website lists 160); sockets/geometry untested |
| https://kenney.nl/assets/city-kit-roads | Road modules | verify specific pack license prior to redistribution |
| https://kenney.nl/assets/building-kit | Modular wall/window/door kit | CC0 verified in downloaded 1.0 License.txt; 79 GLB models (website lists 80); compatibility untested |
| https://paveloliva.gumroad.com/l/buildify | Blender procedural modeling inspiration | tool and showcased kit/assets may have separate terms; **do not redistribute** without permission |
| https://threejs.org/ | 3D rendering with orthographic camera | Check official package license upon installation |
| https://r3f.docs.pmnd.rs/ | React Three Fiber | Check package version and license upon installation |
| https://www.blender.org/ | Offline 3D modeling/rendering | Project files/assets can have separate licensing |
| https://www.mapeditor.org/ | Tile map rules/Wang tiles inspiration | Check specific source license if reusing code |

## Import procedure

1. Select candidate and record original URL, creator, package/version, download date, exact license text and file manifest.
2. Review redistribution, modification and attribution terms; check embedded textures and third-party assets.
3. Import only approved contents under an asset-specific folder, preserving notices.
4. Generate metadata (footprint, sockets, anchors, LOD) and verify geometry alignment.
5. Record modifications, dependency chain and asset provenance; add credits if required.
6. Automated CI lint should reject missing provenance/license references for bundled assets.

**Current status:** no third-party graphical assets are imported or bundled. Links are research leads, not an assertion that every source can be redistributed.

## Research verification — 12 Oct 2026

Primary product materials reviewed; demos were not run:
- [CodeCharta](https://codecharta.com/): metric maps and architecture/hotspot exploration.
- [Chronocity](https://github.com/dat999zx/chronocity): file-based city, history playback and video export. [Root MIT license](https://github.com/dat999zx/chronocity/blob/main/LICENSE) reviewed; not imported.
- [GitCity](https://www.gitcity.in/): a closely related repo-city/agent-citizen concept; site states Shipping Soon. Operational feature completeness unverified.

Differentiation to test: a calm, stable city of functional responsibilities with purpose-first explanations for people directing AI-assisted projects. No claim of uniqueness or market demand.

Inspected Kenney archives in memory without importing graphical content:
- Fantasy Town Kit 2.0: walls, roofs, roads, trees and props; GLB/OBJ/FBX, included CC0 license. 3854691 compressed bytes; SHA-256 `1a7530c09f4d2fa2cdee259876f089334f8b1f27fa86a0c4f54ef86cdd8676ef`.
- Building Kit 1.0: wall/door/window, floor and flat-roof parts; GLB/OBJ/FBX, included CC0 license. 1598905 compressed bytes; SHA-256 `2740ef5772fb5fb3d7aab881db22d129f6b68afe711b1a79e6d5e9e19cf3eec6`.

No standalone JSON metadata was present in either archive. Internal model metadata, exact socket compatibility, pivots, collisions and web/mobile rendering remain unverified. Fantasy Town Kit is a prototype candidate, not an approved completed import.

Exact inspected downloads: [Fantasy Town Kit 2.0](https://kenney.nl/media/pages/assets/fantasy-town-kit/efe948d309-1754222374/kenney_fantasy-town-kit_2.0.zip), [Building Kit 1.0](https://kenney.nl/media/pages/assets/building-kit/0de7aaa492-1743244741/kenney_building-kit.zip). Embedded License.txt identifies Kenney and permits personal, educational and commercial use under CC0; attribution is encouraged but not required by that notice. Review the chosen subset and preserve provenance when importing.

Performance direction: [React Three Fiber scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance) documents resource reuse and on-demand rendering. This supports the candidate approach; it does not qualify RepoCity performance.
