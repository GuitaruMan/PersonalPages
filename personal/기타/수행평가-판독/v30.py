# -*- coding: utf-8 -*-
"""판독문 칸 검사 (단순판).

원본 잉크 자동 검출은 연필 흐림·얼룩 때문에 오탐이 많아 쓰지 않는다.
여기서는 확실한 것만 잡는다.
  1) 한 줄이 30칸을 넘으면 오류 (원고지는 30칸이다)
  2) 불확실 표시 ⟨ ⟩ 의 짝이 안 맞으면 오류

칸 배치 자체는 블록 이미지의 칸 번호 눈금을 보며 판독할 때 맞춘다.

usage: python v30.py s5_01.json ...   |   python v30.py --all   (s*_*.json 전부)
"""
import io, json, sys, glob

sys.stdout.reconfigure(encoding='utf-8')
L, R = chr(10216), chr(10217)   # U+27E8, U+27E9
COLS = 30
PUNCT = '.,'          # 앞 글자와 같은 칸에 쓰는 부호


def cells(t):
    """판독문 한 줄을 '칸' 단위 리스트로 쪼갠다.

    - 불확실 표시 ⟨ ⟩ 는 빼고 센다
    - 마침표·쉼표는 앞 글자와 같은 칸에 쓴다
    - 옛한글 낱자 조합(ᄒ+ᆡ 등)은 여러 코드포인트지만 한 칸이다
    """
    t = t.replace(L, '').replace(R, '')
    out = []
    for ch in t:
        o = ord(ch)
        if ch in PUNCT and out and out[-1][-1] != ' ':
            continue
        # 중성(1160~11A7)·종성(11A8~11FF) 낱자는 앞 칸에 붙는다
        if 0x1160 <= o <= 0x11FF and out:
            out[-1] += ch
            continue
        out.append(ch)
    return out


def plain(t):
    return cells(t)


def check(path):
    d = json.load(io.open(path, encoding='utf-8'))
    tx = list(d.get('tx', []))
    while tx and not tx[-1].strip():
        tx.pop()
    name = '%s번 %s' % (d.get('n'), d.get('name', ''))

    over = [(i, len(cells(t)), t) for i, t in enumerate(tx, 1) if len(cells(t)) > COLS]
    unbal = [(i, t) for i, t in enumerate(tx, 1) if t.count(L) != t.count(R)]

    if not over and not unbal:
        print('  OK   %-12s %d행' % (name, len(tx)))
        return True
    print('  실패 %-12s %d행 중 %d건' % (name, len(tx), len(over) + len(unbal)))
    for i, n, t in over[:60]:
        print('        %2d행 %d칸 (초과)  %s' % (i, n, t))
    for i, t in unbal:
        print('        %2d행 괄호 불일치  %s' % (i, t))
    return False


def main():
    a = sys.argv[1:]
    files = sorted(glob.glob('s?_*.json')) if (not a or a[0] == '--all') else a
    if not files:
        print('검사할 파일 없음')
        return 1
    ok = sum(1 for f in files if check(f))
    print()
    print('%d / %d 통과' % (ok, len(files)))
    return 0 if ok == len(files) else 1


if __name__ == '__main__':
    sys.exit(main())
