# -*- coding: utf-8 -*-
"""답안 판독용 렌더러. 칸 번호 눈금을 위에 찍어 칸을 세기 쉽게 만든다.

usage:
  python grid4.py block <쪽> <시작행> <끝행> [dpi]   -> b{쪽}_{시작}-{끝}.png
  python grid4.py cell  <쪽> <행> <시작칸> <끝칸> [dpi] -> c.png
  python grid4.py row   <쪽> <행> [dpi]               -> r{쪽}_{행}.png  (한 행 전체 + 칸번호)

PDF 경로와 격자 좌표는 같은 폴더의 grid.json 에서 읽는다.
파일이 없으면 만드는 법을 안내한다. 반마다 좌표가 다르니 반드시 실측할 것.
"""
import fitz, sys, os, io, json
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
CONF = os.path.join(HERE, 'grid.json')

SAMPLE = '''{
  "pdf": "E:/ForClaude/ForTeaching/수행평가/미)1-4수행평가.pdf",
  "rows": 35,
  "cols": 30,
  "_주석": "아래 값은 폭 1214 · 높이 1720 으로 정규화한 원고지 격자의 픽셀 좌표",
  "odd":  {"y0": 264, "y1": 1664, "x0": 104, "x1": 1166},
  "even": {"y0": 87,  "y1": 1487, "x0": 104, "x1": 1166},
  "norm_w": 1214,
  "norm_h": 1720
}'''

if not os.path.exists(CONF):
    print('grid.json 이 없다. 같은 폴더에 아래 내용으로 만들고 값을 실측해 고칠 것:\n')
    print(SAMPLE)
    sys.exit(1)

_c = json.load(io.open(CONF, encoding='utf-8'))
PDF = _c['pdf']
ROWS, COLS = _c.get('rows', 35), _c.get('cols', 30)
_W, _H = _c.get('norm_w', 1214), _c.get('norm_h', 1720)
G = {k: (_c[k]['y0'] / _H, _c[k]['y1'] / _H, _c[k]['x0'] / _W, _c[k]['x1'] / _W)
     for k in ('odd', 'even')}

_doc = None


def doc():
    global _doc
    if _doc is None:
        _doc = fitz.open(PDF)
    return _doc


def geo(page):
    return G['odd' if page % 2 == 1 else 'even']


def render(page, r0, r1, c0=1, c1=COLS, dpi=150, pad_rows=0.0):
    """r0~r1행, c0~c1칸 영역을 잘라 PIL 이미지로 돌려준다."""
    p = doc()[page - 1]
    W, H = p.rect.width, p.rect.height
    y0, y1, x0, x1 = geo(page)
    rh = (y1 - y0) / ROWS
    cw = (x1 - x0) / COLS
    top = y0 + rh * (r0 - 1) - rh * pad_rows
    bot = y0 + rh * r1 + rh * pad_rows
    left = x0 + cw * (c0 - 1)
    right = x0 + cw * c1
    clip = fitz.Rect(left * W, max(0, top) * H, right * W, min(1, bot) * H)
    pix = p.get_pixmap(matrix=fitz.Matrix(dpi / 72.0, dpi / 72.0), clip=clip)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples)


def with_ruler(im, c0, c1, every=5):
    """이미지 위에 칸 번호 눈금 띠를 붙인다."""
    n = c1 - c0 + 1
    band = 22
    out = Image.new('RGB', (im.width, im.height + band), 'white')
    out.paste(im, (0, band))
    d = ImageDraw.Draw(out)
    cw = im.width / float(n)
    for k in range(n + 1):
        x = int(round(k * cw))
        col = (200, 0, 0) if (c0 + k - 1) % every == 0 else (170, 170, 170)
        d.line([(x, 0), (x, band)], fill=col, width=1)
    for k in range(n):
        num = c0 + k
        if num % every == 0 or num == 1 or num == COLS:
            x = int(round((k + 0.5) * cw))
            d.text((x - 6, 5), str(num), fill=(200, 0, 0))
    return out


def cmd_block(page, r0, r1, dpi=150):
    im = render(page, r0, r1, dpi=dpi, pad_rows=0.06)
    im = with_ruler(im, 1, COLS)
    out = 'b%02d_%02d-%02d.png' % (page, r0, r1)
    im.save(out)
    print(out, im.size)


def cmd_row(page, r, dpi=400):
    im = render(page, r, r, dpi=dpi, pad_rows=0.05)
    im = with_ruler(im, 1, COLS)
    out = 'r%02d_%02d.png' % (page, r)
    im.save(out)
    print(out, im.size)


def cmd_cell(page, r, c0, c1, dpi=900):
    im = render(page, r, r, c0, c1, dpi=dpi, pad_rows=0.05)
    im = with_ruler(im, c0, c1, every=1)
    im.save('c.png')
    print('c.png', im.size, '(%d~%d칸)' % (c0, c1))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        sys.exit(1)
    k = a[0]
    if k == 'block':
        cmd_block(int(a[1]), int(a[2]), int(a[3]), int(a[4]) if len(a) > 4 else 150)
    elif k == 'row':
        cmd_row(int(a[1]), int(a[2]), int(a[3]) if len(a) > 3 else 400)
    elif k == 'cell':
        cmd_cell(int(a[1]), int(a[2]), int(a[3]), int(a[4]), int(a[5]) if len(a) > 5 else 900)
    else:
        print(__doc__)
