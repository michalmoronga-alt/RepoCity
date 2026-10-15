"""Reproduce the small, licensed subset used by Prototype 001."""
import hashlib, io, json, pathlib, struct, sys, urllib.request, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = 'https://kenney.nl/media/pages/assets/fantasy-town-kit/efe948d309-1754222374/kenney_fantasy-town-kit_2.0.zip'
SHA256 = '1a7530c09f4d2fa2cdee259876f089334f8b1f27fa86a0c4f54ef86cdd8676ef'
NAMES = ['wall', 'wall-door', 'wall-window-small', 'wall-wood-window-small', 'roof-point', 'roof-high-point', 'roof-gable', 'chimney', 'tree', 'tree-high-round', 'tree-crooked', 'rock-small', 'rock-large', 'fountain-round', 'fountain-center', 'road', 'road-edge', 'planks', 'poles', 'stall-bench', 'lantern', 'wall-window-round', 'wall-window-stone', 'wall-wood', 'stall-green', 'cart', 'roof-flat']
data = pathlib.Path(sys.argv[1]).read_bytes() if len(sys.argv)>1 else urllib.request.urlopen(URL, timeout=45).read()
assert hashlib.sha256(data).hexdigest() == SHA256, 'Archive changed; re-review source/license before import.'
archive = zipfile.ZipFile(io.BytesIO(data))
license_data = archive.read('License.txt')
assert b'CC0' in license_data, 'Expected CC0 notice missing'
target = ROOT / 'public' / 'kit'
target.mkdir(parents=True, exist_ok=True)
(target / 'License.txt').write_bytes(license_data)
entries = []
sources = ['Models/GLB format/' + n + '.glb' for n in NAMES]
textures = set()
for source in sources:
    raw = archive.read(source)
    size = struct.unpack_from('<I', raw, 12)[0]
    gltf = json.loads(raw[20:20+size])
    assert all('uri' not in b for b in gltf['buffers']), 'External geometry dependency requires review'
    for image in gltf.get('images', []):
        uri = image.get('uri')
        if uri:
            assert uri.startswith('Textures/') and '..' not in uri and ':' not in uri
            textures.add(uri)
    name = pathlib.PurePosixPath(source).name
    (target / name).write_bytes(raw)
    entries.append({'source':source,'path':name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()})
for texture in sorted(textures):
    raw = archive.read('Models/GLB format/' + texture)
    destination = target / texture
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(raw)
    entries.append({'source':'Models/GLB format/' + texture,'path':texture,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()})
manifest = {'creator':'Kenney','pack':'Fantasy Town Kit','version':'2.0','license':'CC0-1.0','downloadedOn':'2026-10-13','subsetUpdatedOn':'2026-10-15','archiveUrl':URL,'archiveSha256':SHA256,'modifications':'Files unchanged. Recipe placements/scales/rotations and runtime material tints (terracotta roofs, warm gravel roads, warm walls) are authored in RepoCity. One shared atlas is used.','files':entries}
(target / 'manifest.json').write_text(json.dumps(manifest,indent=2) + '\n', encoding='utf8')
print(f'Imported {len(entries)} assets, {sum(e["bytes"] for e in entries)} bytes, CC0 notice preserved.')
