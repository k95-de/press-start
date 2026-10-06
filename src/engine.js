/* KHALED: THE GAME · engine
   Stage scaling, click-by-click navigation, warp between worlds, HUD, sound,
   speaker notes and the presenter window. Levels live in levels.js / arcade.js. */
(function () {
  const G = window.GAME;
  const $ = (s, r = document) => r.querySelector(s);
  const stage = $("#stage");

  /* ------------------------------------------------------------ scaling */
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.setProperty("--s", s);
  }
  addEventListener("resize", fit);
  fit();

  /* ------------------------------------------------------------ sound (synthesised, no files) */
  const SFX = {
    ctx: null, out: null, on: true,
    init() {
      if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.out = this.ctx.createGain(); this.out.gain.value = 0.3; this.out.connect(this.ctx.destination);
      } catch (e) { this.ctx = null; }
    },
    tone(f, d, type = "square", v = 0.25, f2 = null, at = 0) {
      const c = this.ctx, t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(this.out); o.start(t); o.stop(t + d + 0.05);
    },
    noise(d, v, f1, f2, at = 0, q = 1) {
      const c = this.ctx, t = c.currentTime + at, n = Math.floor(c.sampleRate * d);
      const b = c.createBuffer(1, n, c.sampleRate), ch = b.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
      const s = c.createBufferSource(); s.buffer = b;
      const fl = c.createBiquadFilter(); fl.type = "bandpass"; fl.Q.value = q;
      fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + d);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + d * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(fl); fl.connect(g); g.connect(this.out); s.start(t);
    },
    pluck(f, at, v = 0.5) {           // Karplus-Strong string
      const c = this.ctx, sr = c.sampleRate, len = Math.floor(sr * 1.6), N = Math.round(sr / f);
      const b = c.createBuffer(1, len, sr), y = b.getChannelData(0);
      for (let i = 0; i < N; i++) y[i] = Math.random() * 2 - 1;
      for (let i = N; i < len; i++) y[i] = 0.497 * (y[i - N] + y[i - N + 1]);
      const s = c.createBufferSource(); s.buffer = b; const g = c.createGain(); g.gain.value = v;
      s.connect(g); g.connect(this.out); s.start(c.currentTime + at);
    },
    play(name) {
      if (!this.on || !this.ctx) return;
      switch (name) {
        case "blip": this.tone(660, 0.06, "square", 0.08); break;
        case "start": this.tone(988, 0.09, "square", 0.18); this.tone(1319, 0.5, "square", 0.18, null, 0.09); break;
        case "warp": this.noise(1.1, 0.5, 200, 5000, 0, 0.8); this.tone(110, 1.0, "sawtooth", 0.07, 880); break;
        case "land": this.tone(196, 0.25, "triangle", 0.25, 392); break;
        case "unlock": [660, 880, 1320].forEach((f, i) => this.tone(f, 0.16, "triangle", 0.2, null, i * 0.07)); break;
        case "clunk": this.tone(80, 0.18, "square", 0.25, 50); this.noise(0.15, 0.3, 900, 300); break;
        case "flow": this.noise(1.1, 0.18, 300, 1200, 0, 0.6); break;
        case "pop": this.tone(520, 0.08, "square", 0.1, 900); break;
        case "stamp": this.noise(0.25, 0.7, 500, 120); this.tone(70, 0.3, "square", 0.3, 40); break;
        case "coin": this.tone(1047, 0.06, "square", 0.12); this.tone(1568, 0.18, "square", 0.12, null, 0.06); break;
        case "p1": this.tone(440, 0.05, "square", 0.12); break;
        case "p2": this.tone(880, 0.05, "square", 0.12); break;
        case "score": this.tone(220, 0.3, "square", 0.14, 110); break;
        case "strum": [392, 261.6, 329.6, 440].forEach((f, i) => this.pluck(f, i * 0.035, 0.35));
          [392, 261.6, 329.6, 440].forEach((f, i) => this.pluck(f, 0.62 + i * 0.03, 0.25)); break;
        case "fanfare": [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, i > 3 ? 0.5 : 0.14, "square", 0.14, null, i * 0.12)); break;
        case "engine": this.tone(60, 1.6, "sawtooth", 0.08, 180); break;
      }
    }
  };

  /* ------------------------------------------------------------ state */
  const order = G.levels.map(l => l.id);
  const L = {};                       // level implementations, registered by levels.js
  let li = 0, bi = 0, busy = false, started = false, t0 = 0, wt0 = 0, timerHidden = false;
  let presenter = null;

  const beatsOf = i => L[order[i]].beats;
  const totalBeats = () => order.reduce((a, id) => a + L[id].beats, 0);
  const flatIndex = () => { let n = 0; for (let i = 0; i < li; i++) n += beatsOf(i); return n + bi; };

  function setAccent(i) {
    const a = $("#lv-" + order[i]).dataset.accent;
    stage.style.setProperty("--accent", a);
    return a;
  }

  /* ------------------------------------------------------------ HUD */
  const pips = $(".h-pips");
  G.levels.slice(1).forEach((lv, i) => {
    const p = document.createElement("i");
    p.title = `World ${lv.world} · ${lv.name}`;
    p.addEventListener("click", () => jump(i + 1));
    pips.appendChild(p);
  });
  function hud() {
    const lv = G.levels[li];
    $("#hud").classList.toggle("on", li > 0);
    $(".h-wnum").textContent = "WORLD " + lv.world;
    $(".h-wname").textContent = lv.name;
    $(".h-topic").textContent = lv.topic;
    [...pips.children].forEach((p, i) => { p.className = i + 1 < li ? "done" : i + 1 === li ? "cur" : ""; });
    $(".h-xp i").style.transform = `scaleX(${flatIndex() / (totalBeats() - 1)})`;
    const notes = G.notes[order[li]] || [];
    $(".n-meta").textContent = `WORLD ${lv.world} · ${lv.name.toUpperCase()} · CLICK ${bi + 1}/${beatsOf(li)}`;
    $(".n-text").textContent = notes[bi] || "";
    sync();
  }

  /* ------------------------------------------------------------ warp */
  const rings = $(".w-rings");
  for (let i = 0; i < 9; i++) { const r = document.createElement("i"); r.style.animationDelay = (i * 0.12) + "s"; rings.appendChild(r); }

  function show(i) {
    order.forEach((id, k) => $("#lv-" + id).classList.toggle("on", k === i));
  }

  function warpTo(nl, nb, dir) {
    if (busy || nl === li && nb === bi) return;
    busy = true;
    const from = li;
    const lv = G.levels[nl];
    const col = $("#lv-" + order[nl]).dataset.accent;
    const w = $("#warp");
    w.style.setProperty("--wc", col);
    $(".w-num").textContent = nl === 0 ? "" : "WORLD " + lv.world;
    $(".w-name").textContent = lv.name;
    $(".w-topic").textContent = lv.topic;
    SFX.play("warp");
    w.classList.add("run");
    const tl = gsap.timeline();
    tl.set(w, { visibility: "visible" })
      .to(w, { opacity: 1, duration: 0.35, ease: "power2.in" })
      .fromTo(".w-card", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.2)
      .add(() => {
        L[order[from]].exit && L[order[from]].exit();
        if (li !== nl) wt0 = Date.now();
        li = nl; bi = nb;
        setAccent(li); show(li);
        L[order[li]].enter(bi, dir);
        hud();
      }, 0.4)
      .to(".w-card", { scale: 1.6, opacity: 0, duration: 0.35, ease: "power2.in" }, 1.25)
      .to(w, { opacity: 0, duration: 0.4, ease: "power2.out" }, 1.35)
      .add(() => { w.classList.remove("run"); w.style.visibility = "hidden"; busy = false; SFX.play("land"); });
  }

  /* ------------------------------------------------------------ navigation */
  function next() {
    if (busy) return;
    SFX.init();
    if (!started) { started = true; t0 = wt0 = Date.now(); }
    if (bi < beatsOf(li) - 1) { bi++; L[order[li]].show(bi, 1); hud(); }
    else if (li < order.length - 1) warpTo(li + 1, 0, 1);
  }
  function prev() {
    if (busy) return;
    if (bi > 0) { bi--; L[order[li]].show(bi, -1); hud(); }
    else if (li > 0) warpTo(li - 1, beatsOf(li - 1) - 1, -1);
  }
  function jump(nl) {
    menu(false);
    if (busy || nl < 0 || nl >= order.length) return;
    SFX.init();
    if (nl === li) return;
    warpTo(nl, nl === 0 ? 1 : 0, nl > li ? 1 : -1);
  }

  addEventListener("keydown", e => {
    if (e.repeat && !["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) return;
    const k = e.key;
    if (["ArrowRight", " ", "PageDown", "Enter"].includes(k)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); prev(); }
    else if (k === "m" || k === "M") menu();
    else if (k === "Escape") menu(false);
    else if (k === "t" || k === "T") { timerHidden = !timerHidden; tickTimer(); }
    else if (/^[0-7]$/.test(k)) jump(+k);
    else if (k === "n" || k === "N") $("#notes").classList.toggle("on");
    else if (k === "p" || k === "P") openPresenter();
    else if (k === "s" || k === "S") { SFX.on = !SFX.on; }
    else if (k === "f" || k === "F") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
    else if (k === "l" || k === "L") {
      const on = document.body.classList.toggle("lite");
      const t = $("#toast"); t.textContent = on ? "TEAMS MODE ON · less background motion" : "TEAMS MODE OFF · full motion";
      t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 1800);
    }
    else if (k === "h" || k === "H") document.body.classList.toggle("clean");
    else if (k === "ArrowUp" || k === "ArrowDown" || k === "w" || k === "s") { /* arcade */ }
  });
  $(".c-next").addEventListener("click", next);
  $(".c-prev").addEventListener("click", prev);


  /* ------------------------------------------------------------ world menu (M) */
  const menuEl = $("#menu"), mgrid = $(".mn-grid");
  G.levels.forEach((lv, i) => {
    const b = document.createElement("button");
    b.className = "mn-item";
    b.style.setProperty("--c", $("#lv-" + lv.id).dataset.accent);
    b.innerHTML = `<span class="px">${i ? "WORLD " + lv.world : "MAP"}</span><b>${lv.name}</b><small>${lv.topic || "All worlds"}</small><em>${fmt(lv.secs)}</em>`;
    b.addEventListener("click", () => jump(i));
    mgrid.appendChild(b);
  });
  function menu(on) {
    const open = on === undefined ? !menuEl.classList.contains("on") : on;
    menuEl.classList.toggle("on", open);
    [...mgrid.children].forEach((b, i) => b.classList.toggle("cur", i === li));
  }
  menuEl.addEventListener("click", e => { if (e.target === menuEl) menu(false); });

  /* ------------------------------------------------------------ countdown timer (T hides it) */
  function fmt(sec) { const a = Math.abs(Math.round(sec)); return (sec < 0 ? "+" : "") + Math.floor(a / 60) + ":" + String(a % 60).padStart(2, "0"); }
  const TOTAL = G.levels.reduce((a, l) => a + l.secs, 0);
  function tickTimer() {
    const el = $("#timer");
    if (!started || timerHidden) { el.className = ""; return; }
    const now = Date.now(), all = (now - t0) / 1000, here = (now - wt0) / 1000;
    const budget = G.levels[li].secs;
    const plannedEnd = G.levels.slice(0, li + 1).reduce((a, l) => a + l.secs, 0);
    const left = TOTAL - all;
    let state = "ok";
    if (here > budget * 0.8) state = "warn";
    if (here > budget || all > plannedEnd) state = "over";
    if (left < 0) state = "late";
    el.className = "on " + state;
    $(".tm-main").textContent = fmt(left);
    $(".tm-w").textContent = li ? "WORLD " + G.levels[li].world + " · " + G.levels[li].name.toUpperCase() : "START";
    $(".tm-ws").textContent = fmt(here) + " / " + fmt(budget);
    $(".tm-bar b").style.transform = `scaleX(${Math.min(1, here / budget)})`;
  }
  setInterval(tickTimer, 250);

  /* ------------------------------------------------------------ presenter window */
  function openPresenter() {
    presenter = window.open("notes.html", "khaled-presenter", "width=980,height=640");
    setTimeout(sync, 600);
  }
  function sync() {
    if (!presenter || presenter.closed) return;
    const id = order[li], notes = G.notes[id] || [];
    let nextLine;
    if (bi < beatsOf(li) - 1) nextLine = notes[bi + 1];
    else if (li < order.length - 1) nextLine = "→ WARP TO: " + G.levels[li + 1].name + " · " + G.notes[order[li + 1]][0];
    presenter.postMessage({
      type: "state", world: G.levels[li].world, name: G.levels[li].name, topic: G.levels[li].topic,
      beat: bi + 1, beats: beatsOf(li), now: notes[bi] || "", next: nextLine || "End. Questions.",
      t0: started ? t0 : 0, flat: flatIndex(), total: totalBeats(),
      plan: G.levels.map((l, i) => ({ name: l.name, secs: l.secs, cur: i === li }))
    }, "*");
  }
  addEventListener("message", e => {
    const d = e.data || {};
    if (d.type !== "cmd") return;
    if (d.cmd === "next") next(); else if (d.cmd === "prev") prev();
    else if (d.cmd === "hello") sync();
    else if (d.cmd === "jump") jump(d.world);
  });

  /* ------------------------------------------------------------ public */
  window.SFX = SFX;
  window.GameEngine = {
    register(id, impl) { L[id] = impl; },
    jump, next, prev,
    boot() {
      order.forEach(id => L[id].build && L[id].build());
      setAccent(0); show(0); L[order[0]].enter(0, 1); hud();
      // dev hook: __go(level, beat) jumps without the warp (for screenshots)
      window.__go = (l, b = 0) => {
        L[order[li]].exit && L[order[li]].exit();
        li = l; bi = b; wt0 = Date.now(); setAccent(li); show(li); L[order[li]].enter(bi, -1); hud();
      };
    }
  };
})();
