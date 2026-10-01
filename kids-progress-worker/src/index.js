// 아이 학습 페이지 별 기록 저장소 — 설계는 ../DESIGN.md
const KEY_RE = /^[a-z0-9-]{3,40}$/;
const MAX_BODY = 32 * 1024;

function corsHeaders(env, origin) {
  const ok = env.ALLOWED_ORIGIN.split(",").map(s => s.trim()).includes(origin);
  return ok ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", "Vary": "Origin" } : null;
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors } });

const empty = epoch => ({ epoch, stars: {}, best: {}, notes: {}, nt: {} });
const obj = v => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

// 별은 큰 값, 최고 기록은 작은 값, 메모는 늦게 고친 것 — 어떤 순서로 합쳐도 별이 줄지 않는다.
export function merge(cur, inc) {
  const out = { epoch: cur.epoch, stars: { ...cur.stars }, best: { ...cur.best }, notes: { ...cur.notes }, nt: { ...cur.nt } };
  for (const [k, v] of Object.entries(obj(inc.stars))) if (Number.isInteger(v) && v >= 0 && v <= 3 && v > (out.stars[k] || 0)) out.stars[k] = v;
  for (const [k, v] of Object.entries(obj(inc.best))) if (typeof v === "number" && v > 0 && (!out.best[k] || v < out.best[k])) out.best[k] = v;
  const nt = obj(inc.nt);
  for (const [k, v] of Object.entries(obj(inc.notes))) {
    if (typeof v !== "string") continue;
    const t = typeof nt[k] === "number" ? nt[k] : 0;
    if (!(k in out.notes) || t > (out.nt[k] || 0)) { out.notes[k] = v.slice(0, 500); out.nt[k] = t; }
  }
  return out;
}

async function load(env, key) {
  const row = await env.DB.prepare("SELECT data FROM progress WHERE key = ?").bind(key).first();
  return row ? JSON.parse(row.data) : null;
}
async function store(env, key, data) {
  await env.DB.prepare("INSERT INTO progress (key, data, updated) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET data = ?2, updated = ?3")
    .bind(key, JSON.stringify(data), Date.now()).run();
}

export default {
  async fetch(req, env) {
    const cors = corsHeaders(env, req.headers.get("Origin") || "");
    if (!cors) return new Response("forbidden", { status: 403 });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method === "GET") {                   // 읽기 전용: 목록 페이지가 별 개수를 보여 줄 때 쓴다 (없으면 null, 기록을 만들지 않는다)
      const g = new URL(req.url).pathname.match(/^\/p\/([^/]+)$/);
      if (!g || !KEY_RE.test(g[1])) return json({ error: "key" }, 404, cors);
      return json(await load(env, g[1]), 200, cors);
    }
    if (req.method !== "POST") return json({ error: "method" }, 405, cors);

    const m = new URL(req.url).pathname.match(/^\/(sync|reset)\/([^/]+)$/);
    if (!m || !KEY_RE.test(m[2])) return json({ error: "key" }, 404, cors);
    const [, action, key] = m;

    if (action === "reset") {
      const fresh = empty(Date.now().toString(36));
      await store(env, key, fresh);
      return json(fresh, 200, cors);
    }

    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "too large" }, 413, cors);
    let inc;
    try { inc = obj(JSON.parse(text)); } catch { return json({ error: "json" }, 400, cors); }

    const cur = await load(env, key);
    const epoch = typeof inc.epoch === "string" ? inc.epoch.slice(0, 20) : "0";
    if (!cur) {                                   // 처음 저장: 기기 기록을 그대로 받아들인다
      const first = merge(empty(epoch), inc);
      await store(env, key, first);
      return json(first, 200, cors);
    }
    if (epoch !== cur.epoch) return json(cur, 200, cors);   // 초기화 전 기록 → 서버 것을 따르게 한다
    const next = merge(cur, inc);
    if (JSON.stringify(next) !== JSON.stringify(cur)) await store(env, key, next);
    return json(next, 200, cors);
  }
};
