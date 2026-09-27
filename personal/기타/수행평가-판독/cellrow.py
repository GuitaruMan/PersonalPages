# -*- coding: utf-8 -*-
"""칸 번호로 행을 만든다. 입력: '1:가 2:나 5:다 ...' 처럼 칸번호:글자, 나머지는 빈칸.
한 칸에 여러 글자면 '7:‘목' 처럼 그대로 적는다(둥근따옴표/전각부호 규칙 적용)."""
import sys
def row(spec, n=30):
    cells = [' '] * n
    for tok in spec.split():
        k, v = tok.split(':', 1)
        if len(v) > 1:  # 글자와 같은 칸의 부호는 일반 부호로(v30에서 앞 글자에 붙음)
            v = v.replace('，', ',').replace('．', '.')
        cells[int(k) - 1] = v
    return ''.join(cells)
