# Gera a máscara de pontos de terra (esfera de Fibonacci) usada pelo globo animado do hero.
# Fonte: Natural Earth ne_110m_land.geojson (domínio público).
import json, math, base64, numpy as np

N = 48000
land = json.load(open('/tmp/land.geojson'))
i = np.arange(N)
y = 1 - 2 * (i + 0.5) / N
r = np.sqrt(1 - y * y)
th = i * math.pi * (3 - math.sqrt(5))
x, z = np.cos(th) * r, np.sin(th) * r
lat = np.degrees(np.arcsin(y))
lon = np.degrees(np.arctan2(z, x))

inside = np.zeros(N, dtype=bool)
def pip(ring, px, py):
    ring = np.asarray(ring)
    res = np.zeros(px.shape, dtype=bool)
    xs, ys = ring[:, 0], ring[:, 1]
    j = len(ring) - 1
    for k in range(len(ring)):
        xi, yi, xj, yj = xs[k], ys[k], xs[j], ys[j]
        cond = ((yi > py) != (yj > py)) & (px < (xj - xi) * (py - yi) / ((yj - yi) or 1e-12) + xi)
        res ^= cond
        j = k
    return res

for f in land['features']:
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys:
        outer = np.asarray(poly[0])
        mnx, mny = outer.min(0); mxx, mxy = outer.max(0)
        m = (lon >= mnx) & (lon <= mxx) & (lat >= mny) & (lat <= mxy)
        if not m.any():
            continue
        idx = np.where(m)[0]
        hit = pip(outer, lon[idx], lat[idx])
        for hole in poly[1:]:
            hit &= ~pip(hole, lon[idx], lat[idx])
        inside[idx[hit]] = True

# Remove Antártida abaixo de -62° para deixar o polo sul mais limpo
inside &= lat > -62
print('land points:', inside.sum(), 'of', N)
bits = np.packbits(inside.astype(np.uint8), bitorder='little').tobytes()
b64 = base64.b64encode(bits).decode()
open('/home/user/src/data/globe-land.ts', 'w').write(
    '// Máscara de pontos de terra (gerada por scripts/gen-globe-points.py a partir do Natural Earth 110m).\n'
    f'export const GLOBE_POINT_COUNT = {N}\n'
    f"export const GLOBE_LAND_MASK = '{b64}'\n"
)
print('b64 length', len(b64))
