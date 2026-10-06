/* KHALED: THE GAME · world 5, the arcade.
   Hobby tiles (vector drawings turned into pixel art), a ping pong match and a road race. */
(function () {
  const G = window.GAME, E = window.GameEngine, S = () => window.SFX;
  const { $, $$, html } = window.KG;

  /* ------------------------------------------------------------ pixel sprites */
  const COL = { pong: "#FF3DA8", bike: "#3DF0FF", swim: "#3D8BFF", gym: "#FFD84A", rope: "#FF7A3D", uke: "#E0A458", pad: "#5DC21E", car: "#FF3B3B" };
  function line(c, pts, col, w = 2) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }
  function circ(c, x, y, r, col, fill = true, w = 2) { c.beginPath(); c.arc(x, y, r, 0, 6.283); if (fill) { c.fillStyle = col; c.fill(); } else { c.strokeStyle = col; c.lineWidth = w; c.stroke(); } }
  const SPR = {
    pong(c, f) {
      line(c, [[13, 14], [19, 20]], "#B9773B", 3.2);
      circ(c, 9.5, 9.5, 7, "#FF3DA8"); circ(c, 9.5, 9.5, 4.5, "#C81E7C");
      circ(c, 19, f ? 4 : 7, 2.4, "#FFFFFF");
    },
    bike(c, f) {
      [[6, 16], [18, 16]].forEach(([x, y]) => {
        circ(c, x, y, 4.6, "#3DF0FF", false, 1.8);
        if (f) line(c, [[x - 3, y - 3], [x + 3, y + 3]], "#1E8C99", 1.2); else line(c, [[x, y - 4], [x, y + 4]], "#1E8C99", 1.2);
      });
      line(c, [[6, 16], [11, 16], [9, 9], [16, 9], [18, 16]], "#FFFFFF", 1.8);
      line(c, [[11, 16], [16, 9]], "#FFFFFF", 1.8);
      line(c, [[7, 8], [11, 8]], "#FF3DA8", 2); line(c, [[16, 9], [16, 6], [19, 6]], "#FFFFFF", 1.8);
    },
    swim(c, f) {
      const wave = (y, o, col) => { const p = []; for (let x = 0; x <= 24; x += 2) p.push([x, y + Math.sin(x * 0.7 + o) * 1.3]); line(c, p, col, 2); };
      circ(c, 9, 12, 2.6, "#F2C29B"); line(c, [[7, 10], [11, 10]], "#FF3DA8", 1.6);
      if (f) line(c, [[11, 13], [14, 7], [18, 9]], "#F2C29B", 2); else line(c, [[11, 13], [15, 12], [18, 14]], "#F2C29B", 2);
      wave(15, f ? 1.6 : 0, "#3D8BFF"); wave(19.5, f ? 0 : 1.6, "#2456B8");
    },
    gym(c, f) {
      const y = f ? 10 : 13;
      line(c, [[5, y], [19, y]], "#C9D2E3", 2);
      c.fillStyle = "#FFD84A"; c.fillRect(3, y - 5, 3, 10); c.fillRect(18, y - 5, 3, 10);
      c.fillStyle = "#B88F1A"; c.fillRect(1, y - 3, 2, 6); c.fillRect(21, y - 3, 2, 6);
    },
    rope(c, f) {
      const up = f ? 1.5 : 0;
      if (!f) line(c, [[7, 12], [3, 3], [12, 0.8], [21, 3], [17, 12]].map(([x, y]) => [x, y]), "#FF7A3D", 1.4);
      circ(c, 12, 5.5 - up, 2.4, "#F2C29B");
      line(c, [[12, 8 - up], [12, 15 - up]], "#FFFFFF", 2);
      line(c, [[12, 15 - up], [10, 20 - up]], "#FFFFFF", 2); line(c, [[12, 15 - up], [14, 20 - up]], "#FFFFFF", 2);
      line(c, [[12, 10 - up], [8, 12 - up]], "#FFFFFF", 1.8); line(c, [[12, 10 - up], [16, 12 - up]], "#FFFFFF", 1.8);
      c.fillStyle = "#FF3B3B"; c.fillRect(6, 11 - up, 2.5, 2.5); c.fillRect(15.5, 11 - up, 2.5, 2.5);
      if (f) line(c, [[7, 12 - up], [4, 20], [12, 23], [20, 20], [17, 12 - up]], "#FF7A3D", 1.4);
    },
    uke(c, f) {
      line(c, [[13, 11], [20, 4]], "#8A5A2B", 2.4);
      c.fillStyle = "#8A5A2B"; c.fillRect(19, 2, 3, 3);
      circ(c, 9, 16, 5.2, "#E0A458"); circ(c, 13, 12, 3.8, "#E0A458"); circ(c, 9.6, 15.2, 1.5, "#4A2C12");
      line(c, [[7, 18], [9, 20]], "#4A2C12", 1.2);
      if (f) { c.fillStyle = "#FFFFFF"; c.fillRect(3, 3, 1.6, 5); c.fillRect(3, 3, 4, 1.6); circ(c, 2.4, 8, 1.6, "#FFFFFF"); }
      else { c.fillStyle = "#FFFFFF"; c.fillRect(4, 6, 1.6, 5); circ(c, 3.4, 11, 1.6, "#FFFFFF"); }
    },
    pad(c, f) {
      c.fillStyle = "#E8ECF2"; c.beginPath(); c.moveTo(5, 9); c.lineTo(19, 9); c.quadraticCurveTo(23, 9, 22, 17); c.quadraticCurveTo(21, 20, 18, 18);
      c.lineTo(15, 15); c.lineTo(9, 15); c.lineTo(6, 18); c.quadraticCurveTo(3, 20, 2, 17); c.quadraticCurveTo(1, 9, 5, 9); c.fill();
      c.fillStyle = "#2A2F3A"; c.fillRect(5, 11, 4, 1.6); c.fillRect(6.2, 9.8, 1.6, 4);
      circ(c, 17, 10.6, 1, f ? "#FFFFFF" : "#FFD84A"); circ(c, 18.8, 12.2, 1, "#FF3B3B"); circ(c, 15.2, 12.2, 1, "#3D8BFF"); circ(c, 17, 13.8, 1, "#5DC21E");
      circ(c, 12, 10.5, 1.3, "#5DC21E");
    },
    car(c, f) {
      if (f) { line(c, [[0, 11], [3, 11]], "#FFFFFF", 1); line(c, [[0, 14], [2, 14]], "#FFFFFF", 1); }
      c.fillStyle = "#FF3B3B"; c.beginPath(); c.moveTo(3, 17); c.lineTo(4, 13); c.lineTo(9, 12); c.lineTo(12, 8.5); c.lineTo(17, 8.5); c.lineTo(20, 12); c.lineTo(23, 13.5); c.lineTo(23, 17); c.fill();
      c.fillStyle = "#7FD3FF"; c.beginPath(); c.moveTo(11, 12); c.lineTo(13, 9.6); c.lineTo(16.5, 9.6); c.lineTo(18.5, 12); c.fill();
      circ(c, 7.5, 17, 2.6, "#111"); circ(c, 18.5, 17, 2.6, "#111"); circ(c, 7.5, 17, 1, "#C9D2E3"); circ(c, 18.5, 17, 1, "#C9D2E3");
    }
  };
  function sprite(id, f) {
    const s = document.createElement("canvas"); s.width = s.height = 24;
    const c = s.getContext("2d"); SPR[id](c, f);
    const d = c.getImageData(0, 0, 24, 24);
    for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 90 ? 255 : 0;
    c.putImageData(d, 0, 0);
    return s;
  }

  /* ------------------------------------------------------------ PONG */
  const pong = {
    init(cv) { this.cv = cv; this.c = cv.getContext("2d"); this.reset(); this.sl = 0; this.sr = 0; },
    reset(dir = 1) { this.bx = 160; this.by = 90; this.vx = 2.4 * dir; this.vy = (Math.random() - 0.5) * 2.2; this.ly = this.ly || 75; this.ry = this.ry || 75; },
    manual: 0, keys: {},
    step(dt) {
      const k = dt * 60, PH = 30;
      // Khaled (left): keyboard if used recently, otherwise a sharp AI
      if (performance.now() < this.manual) { if (this.keys.ArrowUp) this.ly -= 4 * k; if (this.keys.ArrowDown) this.ly += 4 * k; }
      else this.ly += Math.max(-3 * k, Math.min(3 * k, (this.by - PH / 2 - this.ly) * 0.16 * k));
      // CPU (right): slower, a little late
      const target = this.vx > 0 ? this.by - PH / 2 + Math.sin(this.bx * 0.05) * 10 : 75;
      this.ry += Math.max(-2.05 * k, Math.min(2.05 * k, (target - this.ry) * 0.09 * k));
      this.ly = Math.max(0, Math.min(180 - PH, this.ly)); this.ry = Math.max(0, Math.min(180 - PH, this.ry));
      this.bx += this.vx * k; this.by += this.vy * k;
      if (this.by < 3 || this.by > 177) { this.vy *= -1; this.by = Math.max(3, Math.min(177, this.by)); S().play("p2"); }
      if (this.bx < 19 && this.bx > 10 && this.by > this.ly - 2 && this.by < this.ly + PH + 2 && this.vx < 0) {
        this.vx = Math.min(4.6, -this.vx * 1.06); this.vy = ((this.by - this.ly) / PH - 0.5) * 4.2; S().play("p1");
      }
      if (this.bx > 301 && this.bx < 310 && this.by > this.ry - 2 && this.by < this.ry + PH + 2 && this.vx > 0) {
        this.vx = -Math.min(4.6, this.vx * 1.06); this.vy = ((this.by - this.ry) / PH - 0.5) * 4.2; S().play("p1");
      }
      if (this.bx < -6) { this.sr++; S().play("score"); this.reset(1); }
      if (this.bx > 326) { this.sl++; S().play("score"); this.reset(-1); }
    },
    draw() {
      const c = this.c;
      c.fillStyle = "#07040B"; c.fillRect(0, 0, 320, 180);
      c.fillStyle = "#3a2a48"; for (let y = 4; y < 180; y += 12) c.fillRect(159, y, 2, 6);
      c.font = "16px 'Press Start 2P'"; c.textAlign = "center";
      c.fillStyle = "#FF3DA8"; c.fillText(this.sl, 130, 26); c.fillStyle = "#3DF0FF"; c.fillText(this.sr, 190, 26);
      c.font = "6px 'Press Start 2P'"; c.fillStyle = "#FF3DA8"; c.fillText("KHALED", 40, 12); c.fillStyle = "#3DF0FF"; c.fillText("CPU", 290, 12);
      c.fillStyle = "#FF3DA8"; c.fillRect(12, Math.round(this.ly), 5, 30);
      c.fillStyle = "#3DF0FF"; c.fillRect(303, Math.round(this.ry), 5, 30);
      c.fillStyle = "#fff"; c.fillRect(Math.round(this.bx) - 2, Math.round(this.by) - 2, 5, 5);
    }
  };
  addEventListener("keydown", e => { if (e.key === "ArrowUp" || e.key === "ArrowDown") { pong.keys[e.key] = true; pong.manual = performance.now() + 2500; if ($("#lv-arcade").classList.contains("on")) e.preventDefault(); } });
  addEventListener("keyup", e => { pong.keys[e.key] = false; });

  /* ------------------------------------------------------------ RACE */
  const race = {
    init(cv) {
      this.cv = cv; this.c = cv.getContext("2d"); this.pos = 0; this.t = 0;
      // pre-render the sky, sun and mountains once
      const b = document.createElement("canvas"); b.width = 400; b.height = 112; const c = b.getContext("2d");
      const g = c.createLinearGradient(0, 0, 0, 112); g.addColorStop(0, "#1A0630"); g.addColorStop(0.6, "#7A1A6E"); g.addColorStop(1, "#FF6A3D"); c.fillStyle = g; c.fillRect(0, 0, 400, 112);
      const sg = c.createLinearGradient(0, 40, 0, 112); sg.addColorStop(0, "#FFE36A"); sg.addColorStop(1, "#FF3DA8");
      c.fillStyle = sg; c.beginPath(); c.arc(200, 100, 46, 0, 6.283); c.fill();
      c.fillStyle = "#7A1A6E"; for (let i = 0; i < 6; i++) c.fillRect(140, 78 + i * 6, 120, 1 + i * 0.6);
      this.sky = b;
      const m = document.createElement("canvas"); m.width = 800; m.height = 40; const mc = m.getContext("2d");
      mc.fillStyle = "#2B0B3F"; mc.beginPath(); mc.moveTo(0, 40);
      for (let x = 0; x <= 800; x += 20) mc.lineTo(x, 40 - (14 + 12 * Math.sin(x * 0.021) + 9 * Math.sin(x * 0.057 + 1)));
      mc.lineTo(800, 40); mc.fill();
      this.mtn = m;
    },
    step(dt) { this.t += dt; this.pos += dt * 46; },
    draw() {
      const c = this.c, H = 225, HZ = 112, curve = Math.sin(this.t * 0.45) * 1.2;
      c.drawImage(this.sky, 0, 0);
      const mx = ((-this.t * 18 * curve) % 400 + 400) % 400;
      c.drawImage(this.mtn, -mx, HZ - 40); c.drawImage(this.mtn, 400 - mx, HZ - 40);
      for (let y = HZ; y < H; y++) {
        const p = (y - HZ) / (H - HZ), z = 1 / (p + 0.02), stripe = Math.floor(z * 1.4 + this.pos) % 2;
        const cx = 200 + curve * 140 * (1 - p) * (1 - p) - curve * 30, w = 6 + p * 230, rw = w * 0.09;
        c.fillStyle = stripe ? "#1B0B2A" : "#240F38"; c.fillRect(0, y, 400, 1);
        c.fillStyle = stripe ? "#FF3B3B" : "#F2F2F2"; c.fillRect(cx - w - rw, y, rw, 1); c.fillRect(cx + w, y, rw, 1);
        c.fillStyle = stripe ? "#2C2C38" : "#33333F"; c.fillRect(cx - w, y, w * 2, 1);
        if (stripe) { c.fillStyle = "#FFFFFF"; c.fillRect(cx - w * 0.02, y, Math.max(1, w * 0.04), 1); }
      }
      // the car (rear view)
      const bob = Math.round(Math.sin(this.t * 20) * 0.6), x = 200 - 28 - Math.round(curve * 14), y = 182 + bob;
      c.fillStyle = "#000"; c.fillRect(x + 2, y + 20, 10, 8); c.fillRect(x + 44, y + 20, 10, 8);
      c.fillStyle = "#FF3B3B"; c.fillRect(x, y + 8, 56, 16); c.fillRect(x + 8, y, 40, 10);
      c.fillStyle = "#3B1030"; c.fillRect(x + 12, y + 2, 32, 7);
      c.fillStyle = "#FFE36A"; c.fillRect(x + 2, y + 12, 10, 4); c.fillRect(x + 44, y + 12, 10, 4);
      c.fillStyle = "#B01E2E"; c.fillRect(x, y + 20, 56, 4);
      c.fillStyle = "#C9D2E3"; c.fillRect(x + 22, y + 16, 12, 4);
      c.font = "8px 'Press Start 2P'"; c.textAlign = "left"; c.fillStyle = "#FFFFFF";
      c.fillText("KM/H " + (240 + Math.round(Math.sin(this.t * 1.3) * 12)), 10, 20);
      c.textAlign = "right"; c.fillStyle = "#FFE36A"; c.fillText("POS 1ST", 390, 20);
    }
  };


  /* ------------------------------------------------------------ TRAINING MODE (gym + jump rope) */
  const gym = {
    init(cv) { this.c = cv.getContext("2d"); this.t = 0; this.skips = 0; this.reps = 0; this.lastF = 0; this.up = false; },
    reset() { this.t = 0; this.skips = 0; this.reps = 0; this.lastF = 0; this.up = false; },
    step(dt) {
      this.t += dt;
      const f = Math.floor(this.t * 5.5) % 4;
      if (f === 2 && this.lastF !== 2) { this.skips++; S().play("p1"); }
      this.lastF = f;
      const press = Math.sin(this.t * 2.4);
      if (press > 0.95 && !this.up) { this.up = true; this.reps++; }
      if (press < 0) this.up = false;
    },
    px(x, y, w, h, col) { this.c.fillStyle = col; this.c.fillRect(Math.round(x), Math.round(y), w, h); },
    person(x, feet, o) {          // 16 px wide, ~44 px tall pixel athlete
      const p = (a, b, w, h, c) => this.px(x + a, feet - b, w, h, c);
      p(3, 3, 4, 3, "#EEE"); p(9, 3, 4, 3, "#EEE");                       // shoes
      p(4, 15, 3, 12, o.skin); p(9, 15, 3, 12, o.skin);                   // legs
      p(3, 21, 10, 7, o.shorts);                                          // shorts
      p(3, 34, 10, 13, o.top);                                            // torso
      p(4, 44, 8, 9, o.skin);                                             // head
      p(4, 45, 8, 3, "#1A1A1A");                                          // hair
      if (o.band) p(4, 42, 8, 2, o.band);                                 // headband
      p(9, 40, 2, 2, "#1A1A1A");                                          // eye
    },
    draw() {
      const c = this.c;
      // room
      this.px(0, 0, 320, 180, "#140A1C");
      for (let x = 0; x < 320; x += 40) this.px(x, 0, 2, 140, "#1B1026");
      this.px(0, 140, 320, 40, "#22132F");
      for (let x = 0; x < 320; x += 16) this.px(x, 140, 8, 2, "#2E1A40");
      // neon sign
      c.font = "10px 'Press Start 2P'"; c.textAlign = "center";
      c.fillStyle = "#FF3DA8"; c.fillText("TRAINING MODE", 160, 22);
      // dumbbell rack
      this.px(250, 118, 54, 3, "#555"); [254, 266, 278, 290].forEach((x, i) => { this.px(x, 110, 8, 8, ["#FFD84A", "#3DF0FF", "#FF3DA8", "#5DC21E"][i]); });

      // ---- boxer skipping rope (left)
      const f = Math.floor(this.t * 5.5) % 4, hop = [0, 3, 7, 3][f], bx = 74, feet = 150 - hop;
      const handsY = feet - 26, lh = bx - 3, rh = bx + 19;
      const apex = [feet - 58, feet - 18, feet + 4 + hop, feet - 30][f];      // rope: over head, front, under feet, behind
      const behind = f === 3;
      const rope = () => {
        for (let i = 0; i <= 40; i++) {
          const u = i / 40, v = 1 - u, cx = bx + 8;
          const x = v * v * lh + 2 * v * u * cx + u * u * rh;
          const y = v * v * handsY + 2 * v * u * (2 * apex - handsY) + u * u * handsY;   // passes through apex at u = 0.5
          this.px(x, y, 2, 2, behind ? "#7A3B1E" : "#FF7A3D");
        }
      };
      if (behind) rope();
      this.c.fillStyle = "rgba(0,0,0,.35)"; this.c.fillRect(bx - 2, 151, 20, 3);   // shadow
      this.person(bx, feet, { skin: "#C98B5E", top: "#FF3B3B", shorts: "#111", band: "#FFFFFF" });
      this.px(bx - 4, handsY - 2, 4, 4, "#C98B5E"); this.px(bx + 16, handsY - 2, 4, 4, "#C98B5E");   // hands
      this.px(bx - 1, feet - 36, 3, 10, "#C98B5E"); this.px(bx + 14, feet - 36, 3, 10, "#C98B5E");   // arms
      if (!behind) rope();

      // ---- lifter, overhead press (right)
      const press = Math.max(0, Math.sin(this.t * 2.4)), lx = 196, lf = 150, sh = lf - 42, barY = sh - 4 - press * 18;
      this.c.fillStyle = "rgba(0,0,0,.35)"; this.c.fillRect(lx - 2, 151, 20, 3);
      this.person(lx, lf, { skin: "#C98B5E", top: "#3D8BFF", shorts: "#2A2A3A" });
      this.px(lx - 3, barY + 2, 3, sh - barY + 4, "#C98B5E"); this.px(lx + 16, barY + 2, 3, sh - barY + 4, "#C98B5E");   // arms
      this.px(lx - 16, barY, 48, 2, "#C9D2E3");                                                            // bar
      this.px(lx - 18, barY - 5, 4, 12, "#FFD84A"); this.px(lx + 30, barY - 5, 4, 12, "#FFD84A");          // plates

      // ---- counters
      c.font = "8px 'Press Start 2P'"; c.textAlign = "center";
      c.fillStyle = "#FF7A3D"; c.fillText("SKIPS " + String(this.skips).padStart(3, "0"), bx + 8, 168);
      c.fillStyle = "#3DF0FF"; c.fillText("REPS " + String(this.reps).padStart(2, "0"), lx + 8, 168);
      c.fillStyle = "#FFFFFF"; c.textAlign = "left"; c.fillText("JUMP ROPE", 14, 44); c.fillStyle = "#9A8AB0"; c.fillText("BOXING STYLE", 14, 56);
      c.textAlign = "right"; c.fillStyle = "#FFFFFF"; c.fillText("GYM", 306, 44); c.fillStyle = "#9A8AB0"; c.fillText("OVERHEAD PRESS", 306, 56);
    }
  };

  /* ------------------------------------------------------------ loop (runs only while a game is visible) */
  let raf = 0, last = 0, game = null;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (game) { game.step(dt); game.draw(); raf = requestAnimationFrame(loop); }
  }
  function run(g) { cancelAnimationFrame(raf); game = g; if (g) { last = performance.now(); raf = requestAnimationFrame(loop); } }

  /* ------------------------------------------------------------ level */
  E.register("arcade", {
    beats: 5,
    build() {
      const grid = $(".a-grid");
      this.tiles = G.hobbies.map(h => {
        const t = html("div", "a-tile", `<canvas width="168" height="168"></canvas><b>${h.name.toUpperCase()}</b><small>${(h.sub || "").toUpperCase()}</small>`, grid);
        t.style.setProperty("--c", COL[h.id]);
        const frames = [sprite(h.id, 0), sprite(h.id, 1)], c = $("canvas", t).getContext("2d");
        c.imageSmoothingEnabled = false;
        const paint = f => { c.clearRect(0, 0, 168, 168); c.drawImage(frames[f], 0, 0, 168, 168); };
        paint(0);
        t.addEventListener("click", () => { if (h.id === "uke") S().play("strum"); else S().play("coin"); t.classList.add("sel"); setTimeout(() => t.classList.remove("sel"), 700); });
        return { el: t, paint, id: h.id };
      });
      pong.init($(".a-pong canvas")); race.init($(".a-race canvas")); gym.init($(".a-gym canvas"));
      $(".a-foot").innerHTML = "ALSO OFF SCREEN<br>CYCLING · SWIMMING · GYM · JUMP ROPE (BOXING STYLE)";
    },
    animateTiles(on) {
      clearInterval(this.iv);
      if (!on) return;
      let f = 0;
      this.iv = setInterval(() => { f ^= 1; this.tiles.forEach(t => t.paint(f)); }, 420);
    },
    view(v) {           // "grid" | "pong" | "race" | "gym"
      $(".a-grid").style.display = v === "grid" ? "grid" : "none";
      $(".a-head").style.display = v === "grid" ? "block" : "none";
      $(".a-pong").classList.toggle("on", v === "pong");
      $(".a-race").classList.toggle("on", v === "race");
      $(".a-gym").classList.toggle("on", v === "gym");
      run(v === "pong" ? pong : v === "race" ? race : v === "gym" ? gym : null);
      this.animateTiles(v === "grid");
    },
    state(b) {
      gsap.killTweensOf([".a-tile", ".a-foot", ".a-game"]);
      this.view(b === 1 ? "pong" : b === 2 ? "race" : b === 3 ? "gym" : "grid");
      gsap.set(".a-tile", { opacity: 1, scale: 1, y: 0 });
      gsap.set(".a-foot", { opacity: b === 4 ? 1 : 0 });
      gsap.set(".a-game", { opacity: 1, scale: 1 });
      this.tiles.forEach(t => t.el.classList.toggle("sel", b === 4));
    },
    enter(b, dir) {
      if (b > 0 || dir < 0) return this.state(b);
      this.state(0);
      gsap.fromTo(".a-tile", { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.13, ease: "back.out(2)",
        onStart: () => S().play("coin"), delay: 0.2 });
      this.tiles.forEach((t, i) => setTimeout(() => S().play("blip"), 300 + i * 130));
    },
    show(b, dir) {
      if (dir < 0) return this.state(b);
      if (b === 1) {
        const t = this.tiles.find(t => t.id === "pong");
        t.el.classList.add("sel"); S().play("coin");
        gsap.timeline().to(t.el, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 3 })
          .add(() => { t.el.classList.remove("sel"); pong.sl = 0; pong.sr = 0; pong.reset(1); this.view("pong"); })
          .fromTo(".a-pong", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 });
      }
      if (b === 2) {
        S().play("engine");
        gsap.timeline().to(".a-pong", { opacity: 0, duration: 0.25 })
          .add(() => { this.view("race"); gsap.set(".a-pong", { opacity: 1 }); })
          .fromTo(".a-race", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 });
      }
      if (b === 3) {
        S().play("coin");
        gsap.timeline().to(".a-race", { opacity: 0, duration: 0.25 })
          .add(() => { gym.reset(); this.view("gym"); gsap.set(".a-race", { opacity: 1 }); })
          .fromTo(".a-gym", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 });
      }
      if (b === 4) {
        gsap.timeline().to(".a-gym", { opacity: 0, duration: 0.25 })
          .add(() => { this.view("grid"); gsap.set(".a-gym", { opacity: 1 }); })
          .fromTo(".a-tile", { opacity: 0.2 }, { opacity: 1, duration: 0.3, stagger: 0.05 })
          .add(() => { this.tiles.forEach(t => t.el.classList.add("sel")); S().play("strum"); })
          .fromTo(".a-foot", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    },
    exit() { run(null); this.animateTiles(false); }
  });
})();
