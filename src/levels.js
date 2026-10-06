/* KHALED: THE GAME · worlds 0–4, 6, 7 (the arcade lives in arcade.js)
   Every level: build() once, enter(beat, dir) when it appears, show(beat, dir) per click.
   dir = 1 forward (animate), -1 backward or jump (set the state instantly). */
(function () {
  const G = window.GAME, E = window.GameEngine, S = () => window.SFX;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const html = (tag, cls, inner = "", parent) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    e.innerHTML = inner;
    if (parent) parent.appendChild(e);
    return e;
  };
  const plate = id => id === "ansys" ? `<span class="plate ansys">Ansys</span>`
    : id === "ibm" ? `<span class="plate"><img src="assets/logos/ibm.svg" alt="IBM"></span>`
    : id ? `<span class="plate"><img src="assets/logos/${id}.png" alt=""></span>` : "";
  window.KG = { $, $$, svg, html, plate };

  /* stroke-draw helpers for SVG paths: pathLength=1 trick */
  const prep = p => { p.setAttribute("pathLength", 1); p.style.strokeDasharray = "1 1"; p.style.strokeDashoffset = 1; return p; };
  const drawn = (p, on) => { p.style.strokeDashoffset = on ? 0 : 1; };

  /* ======================================================================== 0 · TITLE */
  const MAPNODES = [[300, 430], [700, 430], [1100, 430], [1500, 430], [1300, 800], [900, 800], [500, 800]];
  E.register("title", {
    beats: 2,
    build() {
      const p = G.player;
      $(".t-kicker").textContent = p.event;
      $(".t-first").textContent = p.first;
      $(".t-last").textContent = p.last;
      $(".t-tag").textContent = p.tagline;

      const s = $(".t-mapsvg");
      const d = "M120 430 H1640 A185 185 0 0 1 1640 800 H300";
      svg("path", { d, class: "shell", fill: "none", stroke: "#141C2C", "stroke-width": 34, "stroke-linecap": "round" }, s);
      const grad = svg("linearGradient", { id: "mapg", x1: 0, x2: 1 }, svg("defs", {}, s));
      ["#FFB547", "#7CC4FF", "#FF7A3D", "#A77BFF", "#FF3DA8", "#F5C451", "#34E39B"].forEach((c, i) =>
        svg("stop", { offset: i / 6, "stop-color": c }, grad));
      this.fluid = prep(svg("path", { d, fill: "none", stroke: "url(#mapg)", "stroke-width": 14, "stroke-linecap": "round" }, s));
      svg("path", { d, fill: "none", stroke: "rgba(255,255,255,.5)", "stroke-width": 4, "stroke-dasharray": "14 40", class: "mapflow" }, s);

      // retro grid floor: lines converge at the horizon, cross-lines roll toward you
      const gs = $(".t-grid"), HZ = 660;
      for (let i = -24; i <= 24; i++) {
        const l = svg("line", { x1: 960 + i * 14, y1: HZ, x2: 960 + i * 230, y2: 1080 }, gs);
        l.style.opacity = 0.32;
      }
      this.rows = [];
      for (let k = 0; k < 16; k++) this.rows.push(svg("line", { x1: 0, x2: 1920, y1: HZ, y2: HZ }, gs));
      this.phase = 0;
      this.tick = (t, dt) => {
        if (document.body.classList.contains("lite")) return;
        this.phase = (this.phase + dt / 1100) % 1;
        this.rows.forEach((l, k) => {
          const z = k + 1 - this.phase, y = HZ + 420 / z;
          l.setAttribute("y1", y); l.setAttribute("y2", y);
          l.style.opacity = y > 1080 ? 0 : Math.min(0.55, (y - HZ) / 260);
        });
      };

      const box = $(".t-nodes");
      G.levels.slice(1).forEach((lv, i) => {
        const [x, y] = MAPNODES[i];
        const c = $("#lv-" + lv.id).dataset.accent;
        const n = html("div", "t-node", `<div class="dot">${lv.world}</div><b>${lv.name}</b><small>${lv.topic}</small>`, box);
        n.style.cssText = `left:${x}px;top:${y}px;--c:${c}`;
        n.addEventListener("click", () => E.jump(i + 1));
      });
    },
    exit() { gsap.ticker.remove(this.tick); },
    enter(b, dir) {
      gsap.ticker.remove(this.tick); gsap.ticker.add(this.tick);
      if (b === 0 && dir > 0) {
        this.state(0);
        gsap.fromTo([".t-kicker", ".t-first", ".t-last", ".t-tag", ".t-press"], { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" });
      } else this.state(b);
    },
    state(b) {
      gsap.killTweensOf([".t-intro", ".t-map", ".t-node", this.fluid]);
      gsap.set(".t-intro", { opacity: b ? 0 : 1, y: 0, visibility: b ? "hidden" : "visible" });
      gsap.set(".t-map", { opacity: b ? 1 : 0, visibility: b ? "visible" : "hidden" });
      gsap.set(".t-node", { opacity: b ? 1 : 0, scale: 1 });
      gsap.set(".t-maphead", { opacity: b ? 1 : 0, y: 0 });
      gsap.set(".t-bgc", { opacity: b ? 0.3 : 1 });
      drawn(this.fluid, !!b);
      $(".mapflow").style.opacity = b ? 1 : 0;
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      S().play("start");
      const tl = gsap.timeline();
      tl.to(".t-press", { scale: 1.25, duration: 0.12, yoyo: true, repeat: 3 })
        .to(".t-intro", { opacity: 0, y: -80, duration: 0.6, ease: "power2.in" })
        .set(".t-intro", { visibility: "hidden" })
        .to(".t-bgc", { opacity: 0.3, duration: 0.6 }, "<")
        .set(".t-map", { visibility: "visible", opacity: 1 })
        .fromTo(".t-maphead", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
        .to(this.fluid, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, "<")
        .fromTo(".t-node", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.18, ease: "back.out(2)",
          onStart: () => S().play("coin") }, "<0.2")
        .add(() => { $(".mapflow").style.opacity = 1; });
    }
  });
  // the map's flowing dashes
  const style = document.createElement("style");
  style.textContent = ".mapflow{animation:flow 1.2s linear infinite;opacity:0;transition:opacity .6s}";
  document.head.appendChild(style);

  /* ======================================================================== 1 · ORIGINS */
  const LONK = 14.8, LATK = 17.4, LON0 = -14, LATTOP = 58, X0 = (1920 - 126 * LONK) / 2;
  const proj = (lon, lat) => [X0 + (lon - LON0) * LONK, (LATTOP - lat) * LATK];
  const PINPOS = { egypt: "b", cyprus: "tl", riyadh: "r", singapore: "l", esslingen: "l", nuremberg: "r", bvs: "l" };

  E.register("origins", {
    beats: 1 + G.origins.steps.length,
    build() {
      const O = G.origins;
      this.cv = $(".o-canvas"); this.ctx = this.cv.getContext("2d");
      const D = window.MAPDOTS.dots, [ex, ey] = proj(O.places.egypt.lon, O.places.egypt.lat);
      this.dots = [];
      for (let i = 0; i < D.length; i += 2) {
        const [x, y] = proj(D[i], D[i + 1]);
        if (x < -10 || x > 1930 || y < -10 || y > 1090) continue;
        this.dots.push([x, y, Math.hypot(x - ex, y - ey)]);
      }
      this.maxR = Math.max(...this.dots.map(d => d[2])) + 140;
      // pre-render the full map once
      this.base = document.createElement("canvas"); this.base.width = 1920; this.base.height = 1080;
      const bc = this.base.getContext("2d");
      bc.fillStyle = "rgba(170,182,210,.44)"; bc.beginPath();
      this.dots.forEach(([x, y]) => { bc.moveTo(x + 2.4, y); bc.arc(x, y, 2.4, 0, 6.283); });
      bc.fill();

      const pins = $(".o-pins");
      this.pins = {};
      for (const k in O.places) {
        const pl = O.places[k], [x, y] = proj(pl.lon, pl.lat);
        const e = html("div", "o-pin " + PINPOS[k] + (k === "bvs" ? " next" : ""),
          `<i></i><div class="lab"><b>${pl.label}</b><small>${pl.sub}</small></div>`, pins);
        e.style.left = x + "px"; e.style.top = y + "px";
        this.pins[k] = e;
      }
      const pr = O.profile;
      $(".o-profile").innerHTML = `<div class="top"><img src="assets/img/portrait.jpg" alt="">
          <div><div class="k">${pr.kicker.toUpperCase()}</div><h3>${G.player.first}<br>${G.player.last}</h3></div></div>
        <dl>${pr.lines.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>`;
      this.arcs = []; this.active = null; this.R = this.maxR;
    },
    pt(k) { const p = G.origins.places[k]; return proj(p.lon, p.lat); },
    curve(a, b, low) {
      const [x1, y1] = this.pt(a), [x2, y2] = this.pt(b);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1);
      let nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      if (low) { nx = -nx * 0.6; ny = -ny * 0.6; }
      const h = Math.min(260, len * 0.32);
      return [x1, y1, mx + nx * h, my + ny * h, x2, y2];
    },
    strokeArc(c, t, dashed) {
      const ctx = this.ctx, [x1, y1, cx, cy, x2, y2] = c, pts = [];
      const n = 60;
      for (let i = 0; i <= n * t; i++) {
        const u = i / n, v = 1 - u;
        pts.push([v * v * x1 + 2 * v * u * cx + u * u * x2, v * v * y1 + 2 * v * u * cy + u * u * y2]);
      }
      if (pts.length < 2) return;
      const col = dashed ? "52,227,155" : "255,181,71";
      ctx.setLineDash(dashed ? [14, 12] : []);
      ctx.lineCap = "round";
      [[12, 0.16], [3.5, 1]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(${col},${a})`; ctx.lineWidth = w; ctx.beginPath();
        pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      });
      ctx.setLineDash([]);
      if (t < 1) {
        const [hx, hy] = pts[pts.length - 1];
        ctx.fillStyle = "#fff"; ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(hx, hy, 7, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      }
    },
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, 1920, 1080);
      if (this.R >= this.maxR) ctx.drawImage(this.base, 0, 0);
      else {
        const R = this.R;
        ctx.fillStyle = "rgba(170,182,210,.44)"; ctx.beginPath();
        this.dots.forEach(([x, y, d]) => { if (d < R - 90) { ctx.moveTo(x + 2.4, y); ctx.arc(x, y, 2.4, 0, 6.283); } }); ctx.fill();
        ctx.fillStyle = "rgba(255,200,120,.9)"; ctx.beginPath();
        this.dots.forEach(([x, y, d]) => { if (d >= R - 90 && d < R) { ctx.moveTo(x + 2.6, y); ctx.arc(x, y, 2.6, 0, 6.283); } }); ctx.fill();
      }
      this.arcs.forEach(a => this.strokeArc(a.c, 1, a.dashed));
      if (this.active) this.strokeArc(this.active.c, this.active.t, this.active.dashed);
    },
    pinsFor(b) {           // which pins are visible after b clicks
      const vis = new Set(["egypt", "riyadh"]);
      const add = { 1: ["cyprus"], 2: ["singapore"], 3: ["esslingen", "nuremberg"], 4: ["bvs"] };
      for (let i = 1; i <= b; i++) (add[i] || []).forEach(k => vis.add(k));
      return vis;
    },
    stepPanel(b, animate) {
      const st = G.origins.steps[b - 1], box = $(".o-step");
      gsap.killTweensOf(box);
      if (!st) { gsap.set(box, { opacity: 0 }); return; }
      const fill = () => {
        box.classList.toggle("next", !!st.dashed);
        box.innerHTML = `<div class="y">${st.year}</div><h4>${st.title}</h4><p>${st.text}</p>`;
      };
      if (!animate) { fill(); gsap.set(box, { opacity: 1, x: 0 }); return; }
      gsap.timeline().to(box, { opacity: 0, x: -30, duration: 0.25 }).add(fill).to(box, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" });
    },
    state(b) {
      gsap.killTweensOf(this);
      this.active = null; this.R = this.maxR;
      this.arcs = [];
      G.origins.steps.slice(0, b).forEach(st => st.arcs.forEach(([a, c, low]) => this.arcs.push({ c: this.curve(a, c, low), dashed: !!st.dashed })));
      const vis = this.pinsFor(b);
      for (const k in this.pins) gsap.set(this.pins[k], { opacity: vis.has(k) ? 1 : 0, scale: 1 });
      if (b === 4) gsap.set(this.pins.egypt, { opacity: 0 });
      gsap.set(".o-profile", { opacity: 1, x: 0 });
      gsap.killTweensOf(".polaroid");
      gsap.set(".polaroid", { opacity: b === 0 ? 1 : 0, y: 0, scale: 1 });
      this.stepPanel(b, false);
      this.render();
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      this.R = 0; gsap.set([this.pins.egypt, this.pins.riyadh], { opacity: 0 }); gsap.set(".o-profile", { opacity: 0, x: 60 });
      gsap.timeline()
        .to(this, { R: this.maxR, duration: 1.6, ease: "power1.in", onUpdate: () => this.render() })
        .fromTo(this.pins.egypt, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.4, onStart: () => S().play("pop") }, 0.15)
        .fromTo(this.pins.riyadh, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.4, onStart: () => S().play("pop") }, 0.45)
        .to(".o-profile", { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 0.6)
        .fromTo(".polaroid", { opacity: 0, y: 80, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.3, ease: "back.out(1.6)", onStart: () => S().play("pop") }, 1.1);
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(b - 1);
      const st = G.origins.steps[b - 1], tl = gsap.timeline();
      if (b === 1) { gsap.set(".polaroid", { opacity: 1 }); gsap.to(".polaroid", { opacity: 0, y: 60, scale: 0.85, duration: 0.45, stagger: 0.1, ease: "power2.in" }); }
      this.stepPanel(b, true);
      st.arcs.forEach(([a, c, low]) => {
        const arc = { c: this.curve(a, c, low), t: 0, dashed: !!st.dashed };
        tl.add(() => { this.active = arc; S().play("blip"); })
          .to(arc, { t: 1, duration: 0.95, ease: "power2.inOut", onUpdate: () => this.render() })
          .add(() => { this.arcs.push(arc); this.active = null; this.render(); })
          .fromTo(this.pins[c], { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", onStart: () => S().play("pop") });
        if (c === "bvs") tl.to(this.pins.egypt, { opacity: 0, duration: 0.3 }, "<");
      });
    },
    exit() { gsap.killTweensOf(this); }
  });

  /* ======================================================================== 2 · BLUEPRINT */
  function gearPath(cx, cy, n, ro, ri) {
    const pts = [], step = Math.PI * 2 / n;
    for (let i = 0; i < n; i++) {
      const a = i * step - Math.PI / 2;
      [[0, ri], [0.18, ro], [0.47, ro], [0.65, ri]].forEach(([f, r]) => pts.push([cx + r * Math.cos(a + f * step), cy + r * Math.sin(a + f * step)]));
    }
    return "M" + pts.map(p => p.map(v => v.toFixed(1)).join(" ")).join(" L") + " Z";
  }
  function dim(g, x1, y1, x2, y2, label) {      // dimension line with arrows + text
    svg("line", { x1, y1, x2, y2, class: "ink thin" }, g);
    const ang = Math.atan2(y2 - y1, x2 - x1), a = 14;
    [[x1, y1, 1], [x2, y2, -1]].forEach(([x, y, s]) => {
      const p = `M${x + s * a * Math.cos(ang - 0.35)} ${y + s * a * Math.sin(ang - 0.35)} L${x} ${y} L${x + s * a * Math.cos(ang + 0.35)} ${y + s * a * Math.sin(ang + 0.35)}`;
      svg("path", { d: p, class: "ink thin" }, g);
    });
    svg("line", { x1, y1: y1 - 22, x2: x1, y2: y1 + 22, class: "ink thin" }, g);
    svg("line", { x1: x2, y1: y2 - 22, x2, y2: y2 + 22, class: "ink thin" }, g);
    const t = svg("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 12, "text-anchor": "middle" }, g);
    t.textContent = label;
  }

  E.register("blueprint", {
    beats: 3,
    build() {
      const s = $(".b-svg");
      // drawing 1 · gear (B.Sc.)
      const g1 = svg("g", { class: "d1" }, s);
      const cx = 510, cy = 390;
      svg("line", { x1: cx - 230, y1: cy, x2: cx + 230, y2: cy, class: "cl" }, g1);
      svg("line", { x1: cx, y1: cy - 230, x2: cx, y2: cy + 230, class: "cl" }, g1);
      svg("path", { d: gearPath(cx, cy, 18, 175, 150), class: "ink" }, g1);
      svg("circle", { cx, cy, r: 70, class: "ink" }, g1);
      svg("circle", { cx, cy, r: 28, class: "ink" }, g1);
      svg("path", { d: `M${cx - 8} ${cy - 28} V${cy - 40} H${cx + 8} V${cy - 28}`, class: "ink" }, g1);
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        svg("circle", { cx: cx + 110 * Math.cos(a), cy: cy + 110 * Math.sin(a), r: 20, class: "ink thin" }, g1);
      }
      dim(g1, cx - 175, 168, cx + 175, 168, "2013 → 2018");
      // drawing 2 · car side view (M.Eng.)
      const g2 = svg("g", { class: "d2", transform: "translate(1060 200)" }, s);
      svg("line", { x1: -20, y1: 244, x2: 720, y2: 244, class: "cl" }, g2);
      svg("path", { class: "ink", d: "M30 200 C30 172 46 160 82 155 L205 140 C245 100 305 72 385 70 C455 68 505 82 548 110 L622 130 C662 138 682 152 684 182 L686 200 L600 200 A55 55 0 0 0 490 200 L215 200 A55 55 0 0 0 105 200 Z" }, g2);
      svg("path", { class: "ink thin", d: "M222 140 C255 110 302 92 372 90 L374 140 Z" }, g2);
      svg("path", { class: "ink thin", d: "M392 90 C440 90 482 99 516 120 L392 140 Z" }, g2);
      svg("path", { class: "ink thin", d: "M383 145 V196 M120 168 H180 M610 150 H660" }, g2);
      [[160, 200], [545, 200]].forEach(([x, y]) => {
        svg("circle", { cx: x, cy: y, r: 44, class: "ink" }, g2);
        svg("circle", { cx: x, cy: y, r: 18, class: "ink thin" }, g2);
        svg("line", { x1: x - 60, y1: y, x2: x + 60, y2: y, class: "cl" }, g2);
        svg("line", { x1: x, y1: y - 60, x2: x, y2: y + 60, class: "cl" }, g2);
      });
      dim(g2, 160, 300, 545, 300, "2019 → 2021");
      this.p1 = $$(".d1 .ink, .d1 .cl", s).map(prep);
      this.p2 = $$(".d2 .ink, .d2 .cl", s).map(prep);
      this.t1 = $$(".d1 text", s); this.t2 = $$(".d2 text", s);

      const [e1, e2] = G.education;
      const card = (e, n) => `<div class="tag">DRAWING ${n} / 2</div><h3>${e.degree}</h3>
        ${e.degree2 ? `<h5>${e.degree2}</h5>` : ""}
        <div class="row">${e.logos.map(plate).join("")}<div><h5>${e.school}</h5><small style="font-size:19px;color:#9FC0EA">${e.place}</small></div></div>
        <div class="row"><span class="yrs">${e.years}</span></div><p>${e.note}</p>`;
      $(".b-text1").innerHTML = card(e1, 1);
      $(".b-text2").innerHTML = card(e2, 2);
      $(".b-titleblock").innerHTML = [["PROJECT", "KHALED ABDELHADI"], ["DRAWING", "EDUCATION"], ["DRAWN", "2013 – 2021"], ["SCALE", "1 : 1"]]
        .map(([a, b]) => `<div>${a}</div><div>${b}</div>`).join("");
    },
    state(b) {
      gsap.killTweensOf([...this.p1, ...this.p2, ".b-text", ".b-stamp", ".b-titleblock", ...this.t1, ...this.t2]);
      this.p1.forEach(p => drawn(p, true)); this.p2.forEach(p => drawn(p, b >= 1));
      gsap.set(this.t1, { opacity: 1 }); gsap.set(this.t2, { opacity: b >= 1 ? 1 : 0 });
      gsap.set(".b-text1", { opacity: 1, y: 0 }); gsap.set(".b-text2", { opacity: b >= 1 ? 1 : 0, y: 0 });
      gsap.set(".b-titleblock", { opacity: 1 });
      gsap.set(".b-stamp", { opacity: b >= 2 ? 1 : 0, scale: 1 });
    },
    drawSet(paths, texts, card, tl, at) {
      tl.to(paths, { strokeDashoffset: 0, duration: 1.3, stagger: 0.06, ease: "power2.inOut" }, at)
        .to(texts, { opacity: 1, duration: 0.4 }, at + 1)
        .fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, at + 0.6);
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      this.p1.forEach(p => drawn(p, false)); gsap.set(this.t1, { opacity: 0 }); gsap.set([".b-text1", ".b-titleblock"], { opacity: 0 });
      const tl = gsap.timeline();
      this.drawSet(this.p1, this.t1, ".b-text1", tl, 0.1);
      tl.to(".b-titleblock", { opacity: 1, duration: 0.5 }, 1.2);
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(b - 1);
      if (b === 1) { S().play("blip"); this.drawSet(this.p2, this.t2, ".b-text2", gsap.timeline(), 0); }
      if (b === 2) gsap.fromTo(".b-stamp", { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power4.in", onComplete: () => S().play("stamp") });
    }
  });

  /* ======================================================================== 3 · THE PLANT */
  const TH = ["#3D8BFF", "#3BE3A5", "#FFD84A", "#FF9A2E", "#FF4D3D"];   // cold at the pump → hot at the radiator
  const PY = 800, DIP = 125;
  const VX = k => k * 1920 + 960;
  function segPath(xs, xe, end) {
    const r = 60, a = xs + (xe - xs) * 0.3, b = xs + (xe - xs) * 0.7, y2 = PY + DIP;
    return `M${xs} ${PY} H${a - r} Q${a} ${PY} ${a} ${PY + r} V${y2 - r} Q${a} ${y2} ${a + r} ${y2} H${b - r} Q${b} ${y2} ${b} ${y2 - r} V${PY + r} Q${b} ${PY} ${b + r} ${PY} H${end}`;
  }

  E.register("plant", {
    beats: G.plant.length + 1,
    build() {
      const s = $(".p-svg"), defs = svg("defs", {}, s);
      this.fluids = []; this.flows = []; this.valves = [];
      const ends = [VX(0), VX(1), VX(2), VX(3), 7680 + 700];
      const starts = [-120, VX(0), VX(1), VX(2), VX(3)];
      ends.forEach((xe, k) => {
        const xs = starts[k];
        const d = k === 0 ? `M${xs} ${PY} H${xe}` : segPath(xs, xe, xe);
        const gr = svg("linearGradient", { id: "pg" + k, gradientUnits: "userSpaceOnUse", x1: xs, x2: xe, y1: 0, y2: 0 }, defs);
        svg("stop", { offset: 0, "stop-color": TH[Math.max(0, k - 1)] }, gr);
        svg("stop", { offset: 1, "stop-color": TH[k] }, gr);
        svg("path", { d, class: "shell" }, s);
        svg("path", { d, class: "shell2" }, s);
        this.fluids.push(prep(svg("path", { d, class: "fluid", stroke: `url(#pg${k})` }, s)));
        this.flows.push(svg("path", { d, class: "flow" }, s));
      });
      // flanges either side of every valve, and at the pump
      [...G.plant.map((_, k) => VX(k)), 240].forEach(x => [-92, 92].forEach(dx =>
        svg("rect", { x: x + dx - 9, y: PY - 34, width: 18, height: 68, rx: 3, fill: "#3A465C", stroke: "#58667F", "stroke-width": 2 }, s)));
      svg("rect", { x: 7680 + 680, y: PY - 34, width: 18, height: 68, rx: 3, fill: "#3A465C", stroke: "#58667F", "stroke-width": 2 }, s);
      // valves
      G.plant.forEach((st, k) => {
        const g = svg("g", { transform: `translate(${VX(k)} ${PY})` }, s);
        const ring = svg("circle", { r: 74, fill: "none", stroke: TH[k], "stroke-width": 6, opacity: 0 }, g);
        svg("path", { d: "M-58 -42 L0 0 L-58 42 Z M58 -42 L0 0 L58 42 Z", fill: "#3A465C", stroke: "#58667F", "stroke-width": 3 }, g);
        svg("circle", { r: 16, fill: "#58667F" }, g);
        svg("rect", { x: -7, y: -104, width: 14, height: 90, fill: "#58667F" }, g);
        const wheel = svg("g", { transform: "translate(0 -112)" }, g);
        const w = svg("g", {}, wheel);
        svg("circle", { r: 50, fill: "none", stroke: "#9AA8BF", "stroke-width": 9 }, w);
        for (let i = 0; i < 4; i++) svg("line", { x1: 0, y1: 0, x2: 50 * Math.cos(i * Math.PI / 2), y2: 50 * Math.sin(i * Math.PI / 2), stroke: "#9AA8BF", "stroke-width": 7 }, w);
        svg("circle", { r: 10, fill: TH[k] }, w);
        this.valves.push({ ring, w });
      });
      // station cards
      const box = $(".p-stations");
      G.plant.forEach((st, k) => {
        const e = html("div", "p-station", "", box);
        e.style.left = k * 1920 + "px";
        e.style.setProperty("--tc", TH[k]);
        e.innerHTML = `<div class="p-year">${st.years.slice(0, 4)}</div>
          <img class="p-img${st.img2 ? " p-img-a" : ""}" src="${st.img}" alt="">${st.img2 ? `<img class="p-img p-img-b" src="${st.img2}" alt="">` : ""}
          <div class="p-card panel"><div class="lab"><span>${st.years}</span><span>${st.label}</span></div>
            <div class="p-orgs">${st.orgs.map(o => `<div class="p-org">${plate(o.logo)}<div><b>${o.org}</b><small>${o.place} · ${o.role}</small></div></div>`).join("")}</div>
            <ul>${st.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
            <div class="chips">${st.tools.map(t => `<span>${t}</span>`).join("")}</div></div>
          <div class="p-tag" style="left:960px">STATION ${k + 1}</div>`
          + (k === 0 ? `<div class="p-pump"><svg viewBox="-60 -60 120 120" width="120" height="120"><circle r="52" fill="#2A3446" stroke="#58667F" stroke-width="4"/>
              <g class="imp">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0 0 Q14 -18 6 -40" stroke="#9AA8BF" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(${i * 60})"/>`).join("")}<circle r="10" fill="#FF4D3D"/></g></svg><span>PUMP</span></div>` : "");
      });
      const oe = html("div", "p-out", "", box);
      oe.style.left = "7680px";
      let tubes = "";
      for (let x = 84; x < 570; x += 24) tubes += `<rect x="${x}" y="50" width="10" height="510" fill="#2A3446"/>`;
      for (let y = 70; y < 560; y += 14) tubes += `<line x1="64" x2="576" y1="${y}" y2="${y}" stroke="#1C2433" stroke-width="2"/>`;
      oe.innerHTML = `<h3 class="rad-title">Every cooling circuit ends at the radiator.</h3>
        <div class="rad"><svg class="rad-core" viewBox="0 0 640 600" width="640" height="600">
  <defs><linearGradient id="radheat" x1="0" x2="1"><stop offset="0" stop-color="#FF4D3D"/><stop offset=".5" stop-color="#FFD84A"/><stop offset="1" stop-color="#3D8BFF"/></linearGradient></defs>
  <rect x="0" y="30" width="64" height="550" rx="14" fill="#2A3446" stroke="#58667F" stroke-width="3"/>
  <rect x="576" y="30" width="64" height="550" rx="14" fill="#2A3446" stroke="#58667F" stroke-width="3"/>
  <rect x="64" y="50" width="512" height="510" fill="#121823" stroke="#58667F" stroke-width="3"/>
  <rect class="rad-heat" x="64" y="50" width="512" height="510" fill="url(#radheat)" opacity="0"/>
  ${tubes}
</svg>
          <div class="fan"><svg viewBox="-200 -200 400 400" width="400" height="400"><circle r="196" fill="none" stroke="#3A465C" stroke-width="10"/>
            <g class="blades">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M0 -20 C60 -40 120 -110 40 -180 C10 -150 -10 -80 0 -20Z" fill="rgba(154,168,191,.55)" transform="rotate(${i * 360 / 7})"/>`).join("")}
            <circle r="34" fill="#2A3446" stroke="#58667F" stroke-width="4"/></g></svg></div>
          <svg class="rad-ret" viewBox="0 0 1600 900" width="1600" height="900">
            <path class="ret-shell" d="M640 90 H790 Q850 90 850 150 V1000"/>
            <path class="ret-fluid" pathLength="1" d="M640 90 H790 Q850 90 850 150 V1000"/>
            <path class="ret-flow" d="M640 90 H790 Q850 90 850 150 V1000"/></svg>
          <span class="ret-tag">RETURN TO PUMP ↓</span>
        </div>
        <div class="rad-tag hot">HOT IN</div><div class="rad-tag cool">COOL OUT</div>`;
      this.rad = oe;
      this.st = $$(".p-station", box);
    },
    count(b) { $(".p-count").textContent = b < G.plant.length ? `STATION ${b + 1} / ${G.plant.length}` : "RADIATOR"; },
    radOn(on, f) {
      const r = this.rad, d = f ? 0.8 : 0;
      r.classList.toggle("on", on);
      gsap.to($(".ret-fluid", r), { strokeDashoffset: on ? 0 : 1, duration: f ? 1.6 : 0, delay: f ? 0.6 : 0, ease: "power1.inOut" });
      gsap.to($(".rad-heat", r), { opacity: on ? 0.55 : 0, duration: d });
      gsap.to([$(".rad-title", r), ...$$(".rad-tag", r)], { opacity: on ? 1 : 0, y: 0, duration: d, stagger: f ? 0.2 : 0 });
    },
    state(b) {
      gsap.killTweensOf([".p-world", ".p-par", ...this.fluids, ".p-img", ".p-card", ".p-card *", ".rad-heat", ".rad-title", ".rad-tag"]);
      gsap.set(".p-world", { x: -b * 1920 }); gsap.set(".p-par", { x: -b * 1920 * 0.3 });
      this.fluids.forEach((f, k) => drawn(f, k <= b));
      this.flows.forEach((f, k) => f.classList.toggle("on", k <= b));
      this.valves.forEach((v, k) => { gsap.set(v.ring, { opacity: k <= b ? 1 : 0 }); gsap.set(v.w, { rotation: k <= b ? 360 : 0, svgOrigin: "0 0" }); });
      this.st.forEach((e, k) => {
        gsap.set($$(".p-img", e), { opacity: k <= b ? 1 : 0, y: 0 });
        gsap.set($(".p-card", e), { opacity: k <= b ? 1 : 0, x: 0 });
        gsap.set($$(".p-card .p-org, .p-card li, .p-card .chips", e), { opacity: 1, y: 0 });
      });
      this.radOn(b >= G.plant.length, false);
      this.count(b);
    },
    animateTo(b) {
      const tl = gsap.timeline(), fl = this.fluids[b];
      this.count(b);
      tl.to(".p-world", { x: -b * 1920, duration: b ? 1.3 : 0.01, ease: "power2.inOut" }, 0)
        .to(".p-par", { x: -b * 1920 * 0.3, duration: b ? 1.3 : 0.01, ease: "power2.inOut" }, 0)
        .add(() => S().play("flow"), 0.1)
        .to(fl, { strokeDashoffset: 0, duration: 1.3, ease: "power1.inOut" }, b ? 0.15 : 0.1)
        .add(() => this.flows[b].classList.add("on"), 1.3);
      if (b < G.plant.length) {
        const v = this.valves[b], e = this.st[b];
        tl.add(() => S().play("clunk"), 1.25)
          .to(v.w, { rotation: 360, svgOrigin: "0 0", duration: 0.8, ease: "power2.out" }, 1.25)
          .fromTo(v.ring, { opacity: 0, scale: 0.6, svgOrigin: "0 0" }, { opacity: 1, scale: 1, duration: 0.5 }, 1.35)
          .fromTo($$(".p-img", e), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.25, ease: "power3.out" }, 1.4)
          .fromTo($(".p-card", e), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, 1.5)
          .fromTo($$(".p-card .p-org, .p-card li, .p-card .chips", e), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 1.7);
      } else {
        tl.add(() => { this.radOn(true, true); S().play("engine"); }, 1.35);
      }
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0); drawn(this.fluids[0], false); this.flows[0].classList.remove("on");
      gsap.set(this.valves[0].w, { rotation: 0 }); gsap.set(this.valves[0].ring, { opacity: 0 });
      gsap.set([...$$(".p-img", this.st[0]), $(".p-card", this.st[0])], { opacity: 0 });
      this.animateTo(0);
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(b - 1);
      this.animateTo(b);
    }
  });

  /* ======================================================================== 4 · SKILL TREE */
  const ROOT = [960, 560];
  E.register("skills", {
    beats: 4,
    build() {
      const K = G.skills, s = $(".s-svg"), box = $(".s-nodes");
      const defs = svg("defs", {}, s);
      const rg = svg("linearGradient", { id: "rootg", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      svg("stop", { offset: 0, "stop-color": K.branches[0].color }, rg);
      svg("stop", { offset: 1, "stop-color": K.branches[1].color }, rg);
      const root = html("div", "s-root", `<svg viewBox="0 0 300 300"><polygon points="${[0, 1, 2, 3, 4, 5].map(i => {
        const a = Math.PI / 6 + i * Math.PI / 3; return `${150 + 130 * Math.cos(a)},${150 + 130 * Math.sin(a)}`; }).join(" ")}"
        fill="#0E0A1C" stroke="url(#rootg)" stroke-width="6"/></svg><div><b>${K.root.title}</b><small>${K.root.sub}</small></div>`, box);
      this.nodes = [[], []]; this.lines = [[], []];
      const cols = [{ x: 400, ys: [235, 390, 545, 700, 855] }, { x: 1520, ys: [310, 475, 640, 805] }];
      K.branches.forEach((br, bi) => {
        const c = cols[bi];
        const lab = html("div", "s-hub", br.name.toUpperCase(), box);
        lab.style.cssText = `left:${c.x}px;top:${c.ys[0] - 92}px;--c:${br.color}`;
        br.nodes.forEach((n, i) => {
          const y = c.ys[i], x = c.x, sx = bi ? ROOT[0] + 128 : ROOT[0] - 128, ex = bi ? x - 262 : x + 262;
          svg("path", { d: `M${sx} ${ROOT[1]} C${(sx + ex) / 2} ${ROOT[1]} ${(sx + ex) / 2} ${y} ${ex} ${y}`, class: "link" }, s);
          const lit = prep(svg("path", { d: `M${sx} ${ROOT[1]} C${(sx + ex) / 2} ${ROOT[1]} ${(sx + ex) / 2} ${y} ${ex} ${y}`, class: "lit", stroke: br.color }, s));
          this.lines[bi].push(lit);
          const ico = n.logo ? plate(n.logo) : `<span class="plate ico"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="${br.color}" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg></span>`;
          const e = html("div", "s-node", `${ico}<div><b>${n.title}</b><small>${n.by} · ${n.date}</small></div><span class="lock">LOCKED</span>`, box);
          e.style.cssText = `left:${x}px;top:${y}px;--c:${br.color}`;
          this.nodes[bi].push(e);
        });
      });
      const N = K.next, nx = html("div", "s-next", `<div class="px">NEXT UNLOCK · ${N.when.toUpperCase()}</div>
        <div class="s-next-items"><span class="plate"><img src="assets/logos/ihk.png" alt="IHK"></span>${N.items.map(t => `<span>${t}</span>`).join("")}</div><div class="s-load"><i></i></div>`, box);
      this.nextEl = nx;
      const Q = K.quests;
      $(".s-quests").innerHTML = `<div class="px">BONUS LEVEL</div><h3>${Q.title}</h3>${Q.items.map((q, i) =>
        `<div class="q"><i>0${i + 1}</i><b>${q.t}</b><span>${q.d}</span></div>`).join("")}`;
    },
    setBranch(bi, on) {
      this.nodes[bi].forEach(n => { n.classList.toggle("on", on); $(".lock", n).textContent = on ? "UNLOCKED" : "LOCKED"; });
      this.lines[bi].forEach(l => drawn(l, on));
    },
    state(b) {
      gsap.killTweensOf([".s-root", ".s-node", ".s-hub", ".s-quests", ".s-quests .q", ".s-nodes", ".s-svg", ...this.lines.flat()]);
      gsap.set([".s-root", ".s-hub", ".s-node"], { opacity: "", scale: 1 });
      gsap.set(".s-root", { opacity: 1 }); gsap.set(".s-hub", { opacity: 1 });
      this.setBranch(0, b >= 1); this.setBranch(1, b >= 2);
      gsap.killTweensOf(this.nextEl); gsap.set(this.nextEl, { opacity: b >= 2 ? 1 : 0, y: 0 });
      gsap.set([".s-nodes", ".s-svg"], { opacity: b >= 3 ? 0.18 : 1 });
      gsap.set(".s-quests", { opacity: b >= 3 ? 1 : 0, visibility: b >= 3 ? "visible" : "hidden", y: 0 });
      gsap.set(".s-quests .q", { opacity: b >= 3 ? 1 : 0, x: 0 });
    },
    unlock(bi, tl) {
      this.nodes[bi].forEach((n, i) => {
        const at = i * 0.45;
        tl.to(this.lines[bi][i], { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, at)
          .add(() => {
            n.classList.add("on"); $(".lock", n).textContent = "UNLOCKED"; S().play("unlock");
            const plus =html("div", "s-plus", "+1 SKILL", $(".s-nodes"));
            plus.style.left = (parseFloat(n.style.left) - 40) + "px"; plus.style.top = (parseFloat(n.style.top) - 90) + "px";
            gsap.fromTo(plus, { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 1, onComplete: () => plus.remove() });
          }, at + 0.35)
          .fromTo(n, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, at + 0.35);
      });
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      gsap.timeline()
        .fromTo(".s-root", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.8)", onStart: () => S().play("pop") })
        .fromTo(".s-hub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 0.4)
        .fromTo(".s-node", { opacity: 0 }, { opacity: 0.35, duration: 0.5, stagger: 0.05 }, 0.6);
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(b - 1);
      if (b === 1) this.unlock(0, gsap.timeline());
      if (b === 2) {
        const tl = gsap.timeline();
        this.unlock(1, tl);
        tl.fromTo(this.nextEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", onStart: () => S().play("blip") }, "+=0.2");
      }
      if (b === 3) {
        S().play("coin");
        gsap.timeline()
          .to([".s-nodes", ".s-svg"], { opacity: 0.18, duration: 0.5 })
          .set(".s-quests", { visibility: "visible" })
          .fromTo(".s-quests", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.2)
          .fromTo(".s-quests .q", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.25 }, 0.6);
      }
    }
  });

  /* ======================================================================== 6 · PLAYER STATS */
  E.register("stats", {
    beats: 2,
    build() {
      const T = G.stats;
      $(".st-left").innerHTML = `<div class="frame"><img src="assets/img/portrait.jpg" alt=""><span class="lv">PLAYER 1</span></div>
        <div><h3>${G.player.first}<br>${G.player.last}</h3><div class="cls" style="margin-top:12px">CLASS · ${T.klass}</div></div>
        <div class="abil"><span class="px">LANGUAGES</span><div class="langs">
          <span>Arabic<em>native</em></span><span>English<em>fluent</em></span><span>German<em>professional</em></span></div></div>`;
      $(".st-str").innerHTML = `<h4>STRENGTHS</h4><div class="st-cards">` + T.strengths.map(s =>
        `<div class="st-card"><b>${s.name}</b><p>${s.ex}</p></div>`).join("") + `</div>`;
      $(".st-grow").innerHTML = `<h4>LEVELLING UP · QUESTS ACTIVE</h4>` + T.growth.map(g =>
        `<div class="st-q"><div><b>${g.name}</b><div class="xpb"><i data-l="${g.xp}"></i></div><div class="xpl">XP IN PROGRESS</div></div><p>${g.how}</p></div>`).join("");
    },
    state(b) {
      gsap.killTweensOf([".st-left", ".st-card", ".st-grow", ".st-q", ".xpb i"]);
      gsap.set(".st-left", { opacity: 1, x: 0 });
      gsap.set(".st-card", { opacity: 1, y: 0 });
      gsap.set(".st-grow", { opacity: b ? 1 : 0 });
      gsap.set(".st-q", { opacity: b ? 1 : 0, y: 0 });
      $$(".xpb i").forEach(i => gsap.set(i, { scaleX: b ? +i.dataset.l : 0 }));
      gsap.set(".st-str", { opacity: 1 });
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      gsap.set(".st-card", { opacity: 0 });
      gsap.timeline()
        .fromTo(".st-left", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" })
        .fromTo(".st-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, onStart: () => S().play("blip") }, 0.4);
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(0);
      const tl = gsap.timeline();
      tl.to(".st-grow", { opacity: 1, duration: 0.3 })
        .fromTo(".st-q", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.25, onStart: () => S().play("coin") }, 0.1);
      $$(".xpb i").forEach((i, k) => tl.fromTo(i, { scaleX: 0 }, { scaleX: +i.dataset.l, duration: 1, ease: "power2.out" }, 0.4 + k * 0.25));
    }
  });

  /* ======================================================================== 7 · NEXT MISSION */
  E.register("mission", {
    beats: 3,
    build() {
      const M = G.mission;
      $(".m-brief").innerHTML = `<div class="px">MISSION BRIEFING</div><h2>${M.title}</h2><div class="sub">${M.sub}</div>
        <div class="m-track"><i></i></div>
        <div class="m-qs">${M.quarters.map(q => `<div class="m-q"><div class="d">${q.q}</div><small class="stp">STEP ${q.q}</small><b>${q.name}</b><p>${q.text}</p></div>`).join("")}</div>`;
      $(".m-load").innerHTML = `<div class="m-col"><h3>WHAT I EXPECT FROM SALES SCHOOL</h3>${M.expect.map((t, i) => `<div><i>0${i + 1}</i>${t}</div>`).join("")}</div>
        <div class="m-col bring"><h3>WHAT I BRING TO THE TEAM</h3>${M.bring.map((t, i) => `<div><i>+</i>${t}</div>`).join("")}</div>`;
      const p = G.player;
      $(".m-contact").textContent = `${p.email}  ·  ${p.linkedin}  ·  ${p.site}`;
      const s = $(".m-svg"), d = "M580 390 C800 250 1120 530 1340 390";
      svg("path", { d, fill: "none", stroke: "#12261B", "stroke-width": 34, "stroke-linecap": "round" }, s);
      this.pipe = prep(svg("path", { d, fill: "none", stroke: "#34E39B", "stroke-width": 14, "stroke-linecap": "round" }, s));
      this.flow = svg("path", { d, class: "mflow", fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": 4, "stroke-dasharray": "14 36", opacity: 0 }, s);
      const st = document.createElement("style");
      st.textContent = ".mflow{animation:flow 1s linear infinite}";
      document.head.appendChild(st);
      this.bctx = $(".m-burst").getContext("2d");
    },
    state(b) {
      gsap.killTweensOf([".m-brief", ".m-load", ".m-final", ".m-q", ".m-track i", ".m-col div", ".m-node", ".m-conn", ".m-thanks", this.pipe, this.flow]);
      gsap.set(".m-brief", { opacity: b === 0 ? 1 : 0, visibility: b === 0 ? "visible" : "hidden" });
      gsap.set(".m-q", { opacity: 1, y: 0 }); gsap.set(".m-track i", { scaleX: 1 });
      gsap.set(".m-load", { opacity: b === 1 ? 1 : 0, visibility: b === 1 ? "visible" : "hidden" });
      gsap.set(".m-col div", { opacity: 1, x: 0 });
      gsap.set(".m-final", { opacity: b === 2 ? 1 : 0, visibility: b === 2 ? "visible" : "hidden" });
      gsap.set([".m-node", ".m-conn", ".m-thanks"], { opacity: b === 2 ? 1 : 0, scale: 1, y: 0 });
      drawn(this.pipe, b === 2); gsap.set(this.flow, { opacity: b === 2 ? 1 : 0 });
      this.bctx.clearRect(0, 0, 1920, 1080);
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      gsap.set(".m-q", { opacity: 0 }); gsap.set(".m-track i", { scaleX: 0 });
      const tl = gsap.timeline();
      tl.fromTo([".m-brief .px", ".m-brief h2", ".m-brief .sub"], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 });
      $$(".m-q").forEach((q, i) => {
        tl.to(".m-track i", { scaleX: (i + 0.5) / 4, duration: 0.5, ease: "power1.inOut" }, 0.8 + i * 0.55)
          .fromTo(q, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, onStart: () => S().play("blip") }, 1.0 + i * 0.55);
      });
      tl.to(".m-track i", { scaleX: 1, duration: 0.4 });
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      this.state(b - 1);
      if (b === 1) {
        gsap.timeline()
          .to(".m-brief", { opacity: 0, duration: 0.35 }).set(".m-brief", { visibility: "hidden" })
          .set(".m-load", { visibility: "visible", opacity: 1 })
          .fromTo(".m-col h3", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.2 })
          .fromTo(".m-col div", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, onStart: () => S().play("coin") }, "<0.2");
      }
      if (b === 2) {
        gsap.set([".m-node", ".m-conn", ".m-thanks"], { opacity: 0 });
        drawn(this.pipe, false); gsap.set(this.flow, { opacity: 0 });
        gsap.timeline()
          .to(".m-load", { opacity: 0, duration: 0.35 }).set(".m-load", { visibility: "hidden" })
          .set(".m-final", { visibility: "visible", opacity: 1 })
          .fromTo(".m-me", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)", onStart: () => S().play("pop") })
          .fromTo(".m-bvs", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)", onStart: () => S().play("pop") }, "<0.25")
          .to(this.pipe, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", onStart: () => S().play("flow") })
          .to(this.flow, { opacity: 1, duration: 0.3 })
          .fromTo(".m-conn", { opacity: 0 }, { opacity: 1, duration: 0.1, repeat: 5, yoyo: true }, "<")
          .set(".m-conn", { opacity: 1 })
          .add(() => { S().play("fanfare"); this.burst(); })
          .fromTo(".m-thanks", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }, "<");
      }
    },
    burst() {
      const ctx = this.bctx, cols = ["#34E39B", "#FFD84A", "#3DF0FF", "#FFFFFF", "#FF3DA8"], P = [];
      for (let i = 0; i < 140; i++) {
        const a = Math.random() * 6.283, v = 6 + Math.random() * 14;
        P.push({ x: 960, y: 390, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, s: 6 + Math.random() * 8, c: cols[i % cols.length] });
      }
      const t0 = performance.now();
      const step = now => {
        const t = (now - t0) / 1000;
        ctx.clearRect(0, 0, 1920, 1080);
        if (t > 2.6 || !$("#lv-mission").classList.contains("on")) return;
        ctx.globalAlpha = Math.max(0, 1 - t / 2.6);
        P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.vx *= 0.985; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });
})();
