/* 피아노 1~3차시 공통: 소리 · 건반 · 따라 치기 · 별 저장
   사용: const P = Piano.stars("서버 이름표", ["활동 id", ...], 서버 기록이 바뀌었을 때 할 일);
         P.S(기록) · P.give(활동, 별 수) · P.draw()
         Piano.Keyboard(자리, 낮은 음, 높은 음, {label, color, fingers, onPress})
         Piano.Tabs(자리, 목록, (몸통, 항목) => Piano.Player(몸통, 항목, 다 쳤을 때 할 일)) */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);

  // ───── 음 이름 ─────
  const NAMES = { 0: "도", 2: "레", 4: "미", 5: "파", 7: "솔", 9: "라", 11: "시" };
  const COLORS = { 0: "var(--do)", 2: "var(--re)", 4: "var(--mi)", 5: "var(--fa)", 7: "var(--sol)", 9: "var(--la)", 11: "var(--si)" };
  const MIDI = { 도: 60, 레: 62, 미: 64, 파: 65, 솔: 67, 라: 69, 시: 71 };
  const isWhite = m => (m % 12) in NAMES;
  const nameOf = m => NAMES[m % 12];
  const colorOf = m => COLORS[m % 12];
  const C_POS = { 60: 1, 62: 2, 64: 3, 65: 4, 67: 5 };   // 도 자리: 오른손 1번이 가운데 도

  // ───── 소리 (피아노 비슷한 합성음) ─────
  let AC = null;
  function tone(m, len = 1) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      const t = AC.currentTime, f = 440 * Math.pow(2, (m - 69) / 12);
      const out = AC.createGain(), lp = AC.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 2600;
      out.gain.setValueAtTime(0, t);
      out.gain.linearRampToValueAtTime(0.32, t + 0.008);
      out.gain.exponentialRampToValueAtTime(0.12, t + 0.25);
      out.gain.exponentialRampToValueAtTime(0.0008, t + 0.6 + len);
      lp.connect(out); out.connect(AC.destination);
      [[1, 1], [2, 0.45], [3, 0.22], [4, 0.1], [5, 0.05]].forEach(([k, a]) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.frequency.value = f * k; g.gain.value = a;
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + 0.7 + len);
      });
    } catch (e) { /* 소리를 못 내는 기기 */ }
  }

  // ───── 별 저장 (../../progress.js) ─────
  function stars(key, acts, onRemote) {
    const S = {}, max = acts.length * 3;
    const total = () => acts.reduce((a, k) => a + Math.min(3, S.stars[k] || 0), 0);
    function draw() {
      document.querySelectorAll("[data-st]").forEach(el => {
        const n = S.stars[el.dataset.st] || 0;
        el.innerHTML = "★".repeat(n) + '<span class="off">' + "★".repeat(3 - n) + "</span>";
      });
      $("total").textContent = "⭐ " + total() + " / " + max;
    }
    const sync = KidsProgress(key, key + "-v1", S, () => { draw(); if (onRemote) onRemote(); }, () => total() + "/" + max);
    function give(act, n) {
      const before = S.stars[act] || 0, after = Math.min(3, Math.max(before, n));
      if (after === before) return;
      S.stars[act] = after; sync.save(); draw();
    }
    return { S, give, draw, save: () => sync.save() };
  }

  // ───── 건반 그리기 ─────
  // opt: label(이름표) · color(무지개) · fingers{midi:번호} · onPress(midi, 건반)
  function Keyboard(host, lo, hi, opt = {}) {
    const whites = [], blacks = [];
    for (let m = lo; m <= hi; m++) (isWhite(m) ? whites : blacks).push(m);
    const n = whites.length, bw = 100 / n * 0.58;
    const kb = document.createElement("div");
    kb.className = "kb"; kb.style.setProperty("--minw", n * 34 + "px");
    const keys = {};
    whites.forEach(m => {
      const b = document.createElement("button");
      b.className = "wk" + (opt.color ? " col" : ""); b.dataset.m = m;
      b.setAttribute("aria-label", nameOf(m));
      if (opt.color) b.style.setProperty("--kc", colorOf(m));
      if (opt.fingers && opt.fingers[m]) b.insertAdjacentHTML("beforeend", '<span class="fn">' + opt.fingers[m] + "</span>");
      b.insertAdjacentHTML("beforeend", '<span class="lab">' + (opt.label ? nameOf(m) : "") + "</span>");
      kb.append(b); keys[m] = b;
    });
    blacks.forEach(m => {
      const i = whites.indexOf(m + 1);
      const b = document.createElement("button");
      b.className = "bk"; b.dataset.m = m; b.setAttribute("aria-label", "검은 건반");
      b.style.left = (i / n * 100) + "%"; b.style.width = bw + "%";
      kb.append(b); keys[m] = b;
    });
    function press(b) {
      const m = +b.dataset.m;
      tone(m); b.classList.add("down");
      setTimeout(() => b.classList.remove("down"), 180);
      if (opt.onPress) opt.onPress(m, b);
    }
    kb.addEventListener("pointerdown", e => {
      const b = e.target.closest("button"); if (!b) return;
      e.preventDefault(); press(b);
    });
    kb.addEventListener("keydown", e => {        // 키보드 사용자: Enter/Space
      if (e.key !== "Enter" && e.key !== " ") return;
      const b = e.target.closest("button"); if (!b) return;
      e.preventDefault(); press(b);
    });
    host.innerHTML = ""; host.append(kb);
    return {
      keys,
      glow(ms) { Object.values(keys).forEach(k => k.classList.remove("glow")); [].concat(ms).forEach(m => keys[m] && keys[m].classList.add("glow")); },
      bad(m) { const k = keys[m]; k.classList.remove("bad"); void k.offsetWidth; k.classList.add("bad"); },
      clear(cls) { Object.values(keys).forEach(k => k.classList.remove(cls)); }
    };
  }

  // ───── 따라 치기 (연습곡·노래·손뼉 박자가 같은 틀을 쓴다) ─────
  // song.lines: 줄마다 [계이름, 가사, 박자]를 글자 하나씩 맞춰 적는다. 띄어쓰기는 낱말 묶음.
  // song.noKeys: 건반·손가락 없이 박자만 (손뼉)
  function Player(host, song, onDone) {
    const notes = [], fingers = song.fingers || {};
    const linesHTML = song.lines.map(([ns, ly, du]) => {
      const g1 = ns.split(" "), g2 = ly ? ly.split(" ") : g1.map(() => ""), g3 = du.split(" ");
      return '<div class="ln">' + g1.map((g, gi) => '<div class="grp">' + [...g].map((nm, k) => {
        const m = MIDI[nm], i = notes.length, d = +g3[gi][k];
        notes.push({ m, d, ly: (g2[gi] || "")[k] || "" });
        const face = song.noKeys ? notes[i].ly : nm;
        return '<div class="nt' + (d >= 2 ? " long" : "") + (d >= 4 ? " xlong" : "") + '" data-i="' + i + '"><span class="ly">' + (song.noKeys ? "" : notes[i].ly) + '</span>' +
          '<span class="ci" style="background:' + (song.noKeys ? "var(--c)" : colorOf(m)) + '">' + face + '</span><span class="fn">' +
          (song.noKeys ? (d >= 2 ? "하나" + "둘셋넷".slice(0, d - 1) : "하나") : (fingers[m] || "")) + "</span></div>";
      }).join("") + "</div>").join("") + "</div>";
    }).join("");
    host.innerHTML =
      '<div class="song"><p class="hint">' + song.hint + "</p>" +
      '<div class="row"><button class="btn pri" data-a="listen">▶ 들어보기</button>' + (song.noKeys ? "" : '<button class="btn" data-a="step">👆 한 음씩</button>') +
      '<button class="btn ghost" data-a="stop" hidden>■ 멈춤</button><label class="slow"><input type="checkbox" data-a="slow"> 천천히</label></div>' +
      '<div class="now-big" hidden></div>' +
      '<div class="row c" data-stepbar hidden><button class="btn" data-a="prev">◀ 앞으로</button><button class="btn pri big" data-a="next">다음 ▶</button></div>' +
      (song.noKeys ? "" : '<div class="kbwrap"><div data-kb></div></div>') +
      '<div class="lines">' + linesHTML + "</div>" +
      '<div class="donebox"><button class="btn pri big" data-a="done">' + (song.doneLabel || "진짜 피아노로 끝까지 쳤어요") + '</button><span class="j" data-msg style="font-size:1.1rem;color:var(--sub)"></span></div></div>';
    const q = s => host.querySelector(s);
    const ntEls = [...host.querySelectorAll(".nt")];
    let idx = -1, mode = "", timers = [];
    const kb = song.noKeys ? null : Keyboard(q("[data-kb]"), 60, 72, { label: true, color: true, fingers, onPress(m) {
      if (mode === "step" && notes[idx] && m === notes[idx].m) setTimeout(() => go(idx + 1), 220);
    } });
    const beat = () => (q('[data-a="slow"]').checked ? 0.85 : 0.55);
    function mark(i) {
      ntEls.forEach((el, k) => { el.classList.toggle("now", k === i); el.classList.toggle("past", i >= 0 && k < i); });
      if (kb) kb.glow(i >= 0 && notes[i] ? notes[i].m : []);
      const big = q(".now-big");
      if (mode === "step" && notes[i]) {
        const n = notes[i];
        big.hidden = false;
        big.innerHTML = '<span class="ci" style="background:' + colorOf(n.m) + '">' + nameOf(n.m) + '</span><span class="tx">' + (fingers[n.m] || "") + "번 손가락" +
          "<small>" + (n.ly ? "가사 '" + n.ly + "' · " : "") + (i + 1) + " / " + notes.length + "</small></span>";
        // 노래 상자 안에서만 굴린다 (화면 전체가 움직이면 건반이 밀려 나간다)
        const box = q(".lines"), d = ntEls[i].getBoundingClientRect().top - box.getBoundingClientRect().top;
        if (d < 0 || d > box.clientHeight - ntEls[i].offsetHeight) box.scrollTo({ top: box.scrollTop + d - box.clientHeight / 3, behavior: "smooth" });
      } else big.hidden = true;
    }
    function stop() {
      timers.forEach(clearTimeout); timers = []; mode = ""; idx = -1; mark(-1);
      q('[data-a="stop"]').hidden = true; q("[data-stepbar]").hidden = true;
      host.querySelectorAll('[data-a="listen"],[data-a="step"]').forEach(b => b.classList.remove("on"));
    }
    function listen() {
      stop(); mode = "listen"; q('[data-a="stop"]').hidden = false; q('[data-a="listen"]').classList.add("on");
      let t = 0; const b = beat();
      notes.forEach((n, i) => {
        timers.push(setTimeout(() => { idx = i; mark(i); tone(n.m, n.d * b); }, t * 1000));
        t += n.d * b;
      });
      timers.push(setTimeout(stop, t * 1000 + 300));
    }
    function go(i) {
      if (mode !== "step") return;
      if (i >= notes.length) {
        stop(); q("[data-msg]").textContent = "끝까지 쳤어요! 진짜 피아노로도 쳤으면 위 단추를 눌러요.";
        return;
      }
      idx = Math.max(0, i); mark(idx);
    }
    host.addEventListener("click", e => {
      const b = e.target.closest("[data-a]"), nt = e.target.closest(".nt");
      if (nt) { const n = notes[+nt.dataset.i]; tone(n.m); if (mode === "step") go(+nt.dataset.i); return; }
      if (!b) return;
      const a = b.dataset.a;
      if (a === "listen") listen();
      else if (a === "stop") stop();
      else if (a === "step") { stop(); mode = "step"; q("[data-stepbar]").hidden = false; q('[data-a="stop"]').hidden = false; b.classList.add("on"); q("[data-msg]").textContent = ""; go(0); }
      else if (a === "next") { tone(notes[idx].m); go(idx + 1); }
      else if (a === "prev") go(idx - 1);
      else if (a === "done") onDone(q("[data-msg]"));
    });
  }

  function Tabs(host, list, make) {
    host.innerHTML = '<div class="tabs" data-tabs></div><div data-body></div>';
    const tabs = host.querySelector("[data-tabs]"), body = host.querySelector("[data-body]");
    tabs.innerHTML = list.map((s, i) => '<button class="btn' + (i ? "" : " on") + '" data-i="' + i + '">' + s.title + "</button>").join("");
    const open = i => { tabs.querySelectorAll(".btn").forEach((t, k) => t.classList.toggle("on", k === i)); make(body, list[i]); };
    tabs.addEventListener("click", e => { const b = e.target.closest(".btn"); if (b) open(+b.dataset.i); });
    open(0);
  }

  // 머리 띠 장식: 흰 건반 14개 + 검은 건반 자리
  function strip() {
    const s = $("strip"), n = 14;
    if (!s) return;
    s.innerHTML = "<i></i>".repeat(n);
    [1, 2, 4, 5, 6, 8, 9, 11, 12, 13].forEach(i => s.insertAdjacentHTML("beforeend", '<b style="left:' + (i / n * 100) + '%"></b>'));
  }

  window.Piano = { $, NAMES, MIDI, C_POS, isWhite, nameOf, colorOf, tone, stars, Keyboard, Player, Tabs, strip };
})();
