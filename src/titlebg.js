/* KHALED: THE GAME · start-page background: pixel sunset landscape.
   Desert + pyramids + Egypt flag on the left, German hills + castle + German flag on the right,
   a truck driving across. Runs only while the title world is visible, ~30 fps (15 in Teams mode). */
(function () {
  const cv = document.querySelector(".t-bgc"), ctx = cv.getContext("2d");
  const lv = document.getElementById("lv-title");

  /* ------------------------------------------------------------ helpers */
  const R = (x, y, w, h, c, g = ctx) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c, k = 1) => `rgb(${Math.min(255, c[0] * k) | 0},${Math.min(255, c[1] * k) | 0},${Math.min(255, c[2] * k) | 0})`;

  /* ======================================================================== LANDSCAPE */
  const LW = 480, LH = 270, HZ = 190;
  let land = null;
  function buildLand() {
    const b = document.createElement("canvas"); b.width = LW; b.height = LH; const g = b.getContext("2d");
    const sky = g.createLinearGradient(0, 0, 0, HZ);
    sky.addColorStop(0, "#07051A"); sky.addColorStop(0.45, "#2A0F48"); sky.addColorStop(0.78, "#B23C78"); sky.addColorStop(1, "#FF8A3D");
    g.fillStyle = sky; g.fillRect(0, 0, LW, HZ);
    // sun with retro stripes
    const sg = g.createLinearGradient(0, 110, 0, 190); sg.addColorStop(0, "#FFE36A"); sg.addColorStop(1, "#FF4D8A");
    g.fillStyle = sg; g.beginPath(); g.arc(240, 182, 66, 0, 6.283); g.fill();
    for (let i = 0; i < 7; i++) R(170, 150 + i * 6, 140, 1 + i * 0.5, "#B23C78", g);
    // far mountains (soft purple) across
    g.fillStyle = "#3B1A4F"; g.beginPath(); g.moveTo(0, HZ);
    for (let x = 0; x <= LW; x += 4) g.lineTo(x, HZ - 10 - 7 * Math.sin(x * 0.03) - 5 * Math.sin(x * 0.011 + 2)); g.lineTo(LW, HZ); g.fill();
    // ---- left: desert dunes + pyramids + palm
    g.fillStyle = "#A8603A"; g.beginPath(); g.moveTo(0, HZ);
    for (let x = 0; x <= 230; x += 4) g.lineTo(x, HZ - 8 - 6 * Math.sin(x * 0.05 + 1)); g.lineTo(230, HZ); g.fill();
    [[58, 46], [104, 34], [140, 20]].forEach(([cx, h]) => {
      const base = HZ - 4;
      g.fillStyle = "#E3A15F"; g.beginPath(); g.moveTo(cx - h, base); g.lineTo(cx, base - h); g.lineTo(cx, base); g.fill();
      g.fillStyle = "#9C5630"; g.beginPath(); g.moveTo(cx, base - h); g.lineTo(cx + h, base); g.lineTo(cx, base); g.fill();
    });
    // palm
    R(186, HZ - 32, 3, 30, "#3A2016", g);
    [[-12, -2], [-8, -6], [0, -8], [8, -6], [12, -2]].forEach(([dx, dy]) => { g.fillStyle = "#1F4A2A"; g.beginPath(); g.moveTo(187, HZ - 33); g.lineTo(187 + dx, HZ - 33 + dy); g.lineTo(187 + dx * 0.8, HZ - 30 + dy); g.fill(); });
    // ---- right: German hills + castle
    g.fillStyle = "#24442F"; g.beginPath(); g.moveTo(250, HZ);
    for (let x = 250; x <= LW; x += 4) g.lineTo(x, HZ - 14 - 10 * Math.sin((x - 250) * 0.025) - 4 * Math.sin(x * 0.09)); g.lineTo(LW, HZ); g.fill();
    const C = "#170F22", cx0 = 318, cy = HZ - 24;
    R(cx0, cy - 18, 70, 20, C, g);                                     // wall
    for (let x = cx0; x < cx0 + 70; x += 6) R(x, cy - 21, 3, 3, C, g);  // battlements
    R(cx0 + 8, cy - 40, 12, 24, C, g); g.beginPath(); g.moveTo(cx0 + 6, cy - 40); g.lineTo(cx0 + 14, cy - 54); g.lineTo(cx0 + 22, cy - 40); g.fillStyle = C; g.fill();
    R(cx0 + 46, cy - 34, 14, 18, C, g); for (let x = cx0 + 46; x < cx0 + 60; x += 4) R(x, cy - 37, 2, 3, C, g);
    R(cx0 + 28, cy - 30, 10, 14, C, g); g.beginPath(); g.moveTo(cx0 + 26, cy - 30); g.lineTo(cx0 + 33, cy - 42); g.lineTo(cx0 + 40, cy - 30); g.fill();
    [[cx0 + 12, cy - 34], [cx0 + 50, cy - 28], [cx0 + 31, cy - 25], [cx0 + 20, cy - 10], [cx0 + 58, cy - 10]].forEach(([x, y]) => R(x, y, 2, 3, "#FFD27A", g));
    // trees on the hills
    [270, 292, 318, 448, 466].forEach((x, i) => { const y = HZ - 16 - (i % 2) * 3; g.fillStyle = "#16301F"; g.beginPath(); g.moveTo(x, y - 14); g.lineTo(x - 5, y); g.lineTo(x + 5, y); g.fill(); });
    // ---- ground: sand → grass, road
    for (let x = 0; x < LW; x++) {
      const t = Math.min(1, Math.max(0, (x - 190) / 100));
      R(x, HZ, 1, 32, rgb(mix(hex("#7A4426"), hex("#1E3C27"), t)), g);
      R(x, HZ + 56, 1, LH - HZ - 56, rgb(mix(hex("#5E321B"), hex("#16301E"), t)), g);
    }
    R(0, HZ + 32, LW, 24, "#24242E", g); R(0, HZ + 32, LW, 2, "#3A3A48", g); R(0, HZ + 54, LW, 2, "#3A3A48", g);
    // stars
    const stars = []; for (let i = 0; i < 46; i++) stars.push([Math.random() * LW, Math.random() * 95, Math.random() * 6.28]);
    const clouds = [[40, 40, 0.9], [200, 62, 0.6], [330, 30, 1.2], [420, 74, 0.5]];
    land = { base: b, stars, clouds, truckX: -60 };
  }
  /* pixel flag on a standing pole; dir 1 = flies to the right, -1 = to the left */
  function flagPole(px, dir, cols, eagleDot, t) {
    const base = HZ + 30, top = base - 96, FWd = 40, FHt = 27, band = FHt / 3;
    R(px - 4, base - 3, 9, 3, "#2A2F3A");                    // foot
    R(px, top, 2, base - top, "#B8C0CC");                     // pole
    R(px - 1, top - 3, 4, 3, "#FFD27A");                      // gold finial
    for (let c = 0; c < FWd; c++) {
      const k = c / FWd, dy = Math.round(Math.sin(c * 0.32 - t * 6) * 2.2 * k);
      const sh = 0.82 + 0.18 * Math.cos(c * 0.32 - t * 6);
      const x = dir > 0 ? px + 2 + c : px - 1 - c;
      for (let i = 0; i < 3; i++) R(x, top + 2 + i * band + dy, 1, band + 1, rgb(hex(cols[i]), sh));
      if (eagleDot && c >= FWd / 2 - 2 && c <= FWd / 2 + 1) R(x, top + 2 + band + 2 + dy, 1, band - 4, rgb(hex("#C09300"), sh));
    }
  }
  function cloud(x, y) { [[0, 2, 22, 5], [4, 0, 12, 3], [16, 1, 8, 3]].forEach(([a, b, w, h]) => R(x + a, y + b, w, h, "rgba(255,170,200,.35)")); }
  function drawLand(t, dt) {
    const L = land;
    ctx.drawImage(L.base, 0, 0);
    L.stars.forEach(([x, y, p]) => { const a = 0.35 + 0.35 * Math.sin(t * 1.5 + p); R(x, y, 1, 1, `rgba(255,255,255,${a})`); });
    L.clouds.forEach(c => { c[0] = (c[0] + c[2] * dt * 6) % (LW + 40); cloud(c[0] - 30, c[1]); });
    // road dashes
    const off = (t * 50) % 24;
    for (let x = -24; x < LW; x += 24) R(x + off, HZ + 43, 12, 2, "#E8E2C8");
    // truck: cab + trailer, drives desert → Germany
    L.truckX += dt * 34; if (L.truckX > LW + 80) L.truckX = -90;
    const x = Math.round(L.truckX), y = HZ + 30, bob = Math.round(Math.sin(t * 18) * 0.5);
    R(x - 46, y - 18 + bob, 44, 16, "#D9DEE7"); R(x - 46, y - 8 + bob, 44, 2, "#3D8BFF");
    R(x, y - 16 + bob, 16, 14, "#F2F4F8"); R(x + 9, y - 14 + bob, 6, 5, "#5FA8E8"); R(x - 2, y - 4 + bob, 20, 3, "#2A2F3A");
    [x - 40, x - 28, x + 10].forEach(wx => R(wx, y - 2, 6, 5, "#111"));
    if (Math.floor(t * 4) % 2) R(x - 2, y - 22 + bob, 3, 3, "rgba(200,200,210,.5)");
    // flags on poles: Egypt on the desert side, Germany on the German side
    flagPole(34, 1, ["#CE1126", "#F4F4F4", "#141414"], true, t);
    flagPole(446, -1, ["#141414", "#DD0000", "#FFCE00"], false, t + 1.3);
    // dark veil behind the name for readability
    const v = ctx.createRadialGradient(240, 125, 10, 240, 125, 230);
    v.addColorStop(0, "rgba(5,4,12,.62)"); v.addColorStop(0.6, "rgba(5,4,12,.25)"); v.addColorStop(1, "rgba(5,4,12,0)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, LW, LH);
  }

  /* ======================================================================== loop + switching */
  function apply() {
    lv.dataset.bg = "land";
    cv.width = LW; cv.height = LH; cv.style.imageRendering = "pixelated";
    buildLand();
  }
  let last = 0, acc = 0, t = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (!lv.classList.contains("on")) { last = now; return; }
    const dt = Math.min(0.1, (now - last) / 1000); last = now; acc += dt; t += dt;
    const frame = document.body.classList.contains("lite") ? 1 / 15 : 1 / 30;
    if (acc < frame) return;
    const d = acc; acc = 0;
    drawLand(t, d);
  }
  apply(); requestAnimationFrame(loop);

})();
