# -*- coding: utf-8 -*-
"""30칸 초과 행을 원본 관행(문장부호·따옴표는 앞 칸에 붙음)에 맞춰 줄인다."""
import io, json, sys
sys.path.insert(0, '.')
sys.stdout.reconfigure(encoding='utf-8')
from v30 import cells

def fix(path):
    d = json.load(io.open(path, encoding='utf-8'))
    tx = d['tx']
    for i in range(len(tx)):
        while len(cells(tx[i])) > 30:
            t = tx[i]
            done = False
            for j in range(len(t) - 1):
                if t[j] in '.,' and t[j + 1] == ' ':
                    tx[i] = t[:j + 1] + t[j + 2:]; done = True; break
            if done: continue
            for j in range(len(t) - 1):
                if t[j] == ' ' and t[j + 1] in "'\"":
                    tx[i] = t[:j] + t[j + 1:]; done = True; break
            if done: continue
            tx[i] = ''.join(cells(t)[:30]); break
    json.dump(d, io.open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    for p in sys.argv[1:]:
        fix(p)
    print('완료')
