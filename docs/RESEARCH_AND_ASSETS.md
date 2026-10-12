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
| https://github.com/marian42/wavefunctioncollapse | Modular adjacency constraints / WFC city | MIT as previously documented; re-check LICENSE + attribution before copying |
| https://github.com/josauder/procedural_city_generation | Streets, plots and Blender urban generation | MPL-2.0 reported; re-check repository license / file-level notices |
| https://github.com/p-schulz/osm_building_grammar | Building grammar, floors, roofs and facades | **license not verified; reference only until reviewed** |
| https://kenney.nl/assets/fantasy-town-kit | Low-poly Classic-style 3D buildings | CC0 reported, 160 files; confirm license per downloaded pack |
| https://kenney.nl/assets/city-kit-roads | Road modules | verify specific pack license prior to redistribution |
| https://kenney-assets.itch.io/building-kit | Modular wall/window/door kit | verify exact included file license |
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
