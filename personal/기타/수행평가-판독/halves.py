# -*- coding: utf-8 -*-
"""여러 행을 1~15칸 / 16~30칸 반쪽으로 확대해 한 장에 모은다 (grid4.cell 사용).
usage: python halves.py <쪽> <행> [<행> ...]   -> m.png"""
import sys, os
from PIL import Image
import grid4
GAMMA = float(os.environ.get('GAMMA', '1'))   # 흐린 연필용: GAMMA=2.5 처럼 주면 어둡게 보정
pg = int(sys.argv[1]); rows = [int(x) for x in sys.argv[2:]]
ims = []
for r in rows:
    for c0, c1 in ((1, 15), (16, 30)):
        im = grid4.render(pg, r, r, c0, c1, dpi=280, pad_rows=0.05)
        if GAMMA != 1:
            im = im.point(lambda v: int(255 * (v / 255.0) ** GAMMA))
        ims.append(grid4.with_ruler(im, c0, c1, every=1))
W = max(i.width for i in ims); H = sum(i.height + 8 for i in ims)
o = Image.new('RGB', (W, H), 'white'); y = 0
for i in ims:
    o.paste(i, (0, y)); y += i.height + 8
o.save('m.png'); print('m.png', o.size)
