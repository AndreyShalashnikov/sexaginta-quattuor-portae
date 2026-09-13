const PURPLE = "#6b3aa0";
const BLACK = "#1a1a1a";
const RED = "#e31c1c";
const INK = "#2a2a2a";
const MUTE = "#9a9a9a";
const TONE_GREEN = "#8bc34a";
const COLOR_YELLOW = "#f5d547";
export const CX = 560;

const CENTER_FILL = {
  Head: "#f0d03c",
  Ajna: "#c6dc3c",
  Throat: "#3bb8c8",
  Self: "#f0d03c",
  Heart: "#e53935",
  Sacral: "#f07828",
  Spleen: "#c9a66b",
  "Solar Plexus": "#d99070",
  Root: "#c4b08a",
};

export const GATE_TO_CENTER = {
  61: "Head", 63: "Head", 64: "Head",
  4: "Ajna", 11: "Ajna", 17: "Ajna", 24: "Ajna", 43: "Ajna", 47: "Ajna",
  8: "Throat", 12: "Throat", 16: "Throat", 20: "Throat", 23: "Throat",
  31: "Throat", 33: "Throat", 35: "Throat", 45: "Throat", 56: "Throat", 62: "Throat",
  1: "Self", 2: "Self", 7: "Self", 10: "Self", 13: "Self", 15: "Self", 25: "Self", 46: "Self",
  21: "Heart", 26: "Heart", 40: "Heart", 51: "Heart",
  3: "Sacral", 5: "Sacral", 9: "Sacral", 14: "Sacral", 27: "Sacral", 29: "Sacral", 34: "Sacral", 42: "Sacral", 59: "Sacral",
  18: "Spleen", 28: "Spleen", 32: "Spleen", 44: "Spleen", 48: "Spleen", 50: "Spleen", 57: "Spleen",
  6: "Solar Plexus", 22: "Solar Plexus", 30: "Solar Plexus", 36: "Solar Plexus", 37: "Solar Plexus", 49: "Solar Plexus", 55: "Solar Plexus",
  19: "Root", 38: "Root", 39: "Root", 41: "Root", 52: "Root", 53: "Root", 54: "Root", 58: "Root", 60: "Root",
};

const GATE0 = {
  61: [CX, 76], 64: [CX - 22, 112], 63: [CX + 22, 112],
  47: [CX - 30, 144], 24: [CX - 10, 144], 4: [CX + 10, 144], 17: [CX + 30, 144],
  11: [CX - 16, 172], 43: [CX + 16, 172],
  62: [CX - 20, 218], 23: [CX, 214], 56: [CX + 20, 218],
  20: [CX - 34, 236], 16: [CX - 32, 254],
  35: [CX + 34, 232], 12: [CX + 34, 248], 45: [CX + 32, 264],
  31: [CX - 22, 268], 8: [CX, 272], 33: [CX + 22, 268],
  7: [CX, 318], 1: [CX - 14, 338], 13: [CX + 14, 338],
  15: [CX - 40, 352], 25: [CX + 40, 352],
  10: [CX - 26, 376], 46: [CX + 26, 376], 2: [CX, 392],
  21: [CX + 102, 328], 51: [CX + 82, 348], 26: [CX + 112, 348], 40: [CX + 102, 368],
  48: [CX - 170, 388], 57: [CX - 140, 400], 44: [CX - 120, 428], 50: [CX - 100, 440],
  32: [CX - 130, 462], 28: [CX - 160, 452], 18: [CX - 168, 482],
  36: [CX + 170, 388], 22: [CX + 140, 400], 6: [CX + 100, 440], 37: [CX + 120, 428],
  49: [CX + 130, 462], 55: [CX + 160, 452], 30: [CX + 168, 482],
  34: [CX - 36, 472], 5: [CX - 20, 442], 14: [CX, 436], 29: [CX + 20, 442], 59: [CX + 36, 472],
  9: [CX + 26, 500], 3: [CX + 14, 508], 42: [CX, 510], 27: [CX - 18, 504],
  53: [CX - 24, 554], 60: [CX, 554], 52: [CX + 24, 554],
  54: [CX - 24, 576], 38: [CX, 576], 39: [CX + 24, 576],
  58: [CX - 24, 600], 41: [CX, 600], 19: [CX + 24, 600],
};

const ROUTE = {
  "4-63": "line", "8-1": "line", "11-56": "line", "13-33": "line", "15-5": "line",
  "17-62": "line", "2-14": "line", "23-43": "line", "24-61": "line", "25-51": "line",
  "29-46": "line", "3-60": "line", "31-7": "line", "42-53": "line", "47-64": "line", "9-52": "line",
  "21-45": ["right", 0.45], "40-37": ["right", 0.7], "6-59": ["right", 1.0],
  "12-22": ["right", 1.7], "35-36": ["right", 2.2], "30-41": ["right", 2.7],
  "39-55": ["right", 3.15], "19-49": ["right", 3.7],
  "10-20": ["left", 0.55], "10-34": ["left", 0.75], "27-50": ["left", 1.15],
  "10-57": ["left", 1.45], "16-48": ["left", 1.75], "34-57": ["left", 2.05],
  "20-57": ["left", 2.35], "32-54": ["left", 2.65], "18-58": ["left", 3.1],
  "28-38": ["left", 3.45], "20-34": ["left", 3.8], "26-44": "across",
};

export const ALL_CHANNEL_PAIRS = [
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31],
  [9, 52], [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33],
  [16, 48], [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45],
  [23, 43], [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46],
  [30, 41], [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53],
  [47, 64],
];

const PLANET_ORDER = [
  ["Sun", "☉"], ["Earth", "♁"], ["N.Node", "☊"], ["S.Node", "☋"],
  ["Moon", "☽"], ["Mercury", "☿"], ["Venus", "♀"], ["Mars", "♂"],
  ["Jupiter", "♃"], ["Saturn", "♄"], ["Uranus", "♅"], ["Neptune", "♆"], ["Pluto", "♇"],
];

export function channelKey(g1, g2) {
  return g1 < g2 ? `${g1}-${g2}` : `${g2}-${g1}`;
}

export function emptyLayout() {
  return { v: 1, centers: {}, channels: {} };
}

function offCenter(name, layout) {
  const o = layout?.centers?.[name];
  return Array.isArray(o) ? o : [0, 0];
}

function offChannel(key, layout) {
  const o = layout?.channels?.[key];
  return Array.isArray(o) ? o : [0, 0];
}

export function gateXY(n, layout) {
  const base = GATE0[n];
  if (!base) return [0, 0];
  const [dx, dy] = offCenter(GATE_TO_CENTER[n], layout);
  return [base[0] + dx, base[1] + dy];
}

function trackX(y, side, k) {
  const t = Math.max(0, Math.min(1, (y - 170) / 460));
  const inner = 78;
  const outer = 88 + t * 175;
  const dist = inner + (k / 4) * (outer - inner);
  return CX + (side === "left" ? -dist : dist);
}

function splitCubic(p0, c1, c2, p3) {
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const p01 = m(p0, c1);
  const p12 = m(c1, c2);
  const p23 = m(c2, p3);
  const p012 = m(p01, p12);
  const p123 = m(p12, p23);
  const mid = m(p012, p123);
  return {
    d: `M${p0[0]} ${p0[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p3[0]} ${p3[1]}`,
    halves: [
      `M${p0[0]} ${p0[1]} C${p01[0]} ${p01[1]} ${p012[0]} ${p012[1]} ${mid[0]} ${mid[1]}`,
      `M${mid[0]} ${mid[1]} C${p123[0]} ${p123[1]} ${p23[0]} ${p23[1]} ${p3[0]} ${p3[1]}`,
    ],
    mid,
  };
}

export function routePath(g1, g2, layout) {
  const key = channelKey(g1, g2);
  const listed = ALL_CHANNEL_PAIRS.find((p) => channelKey(p[0], p[1]) === key);
  const p0 = gateXY(listed[0], layout);
  const p3 = gateXY(listed[1], layout);
  const spec = ROUTE[key];
  const [bx, by] = offChannel(key, layout);
  let c1;
  let c2;
  if (spec === "across") {
    c1 = [CX + 70 + bx, 412 + by];
    c2 = [CX - 70 + bx, 412 + by];
  } else if (Array.isArray(spec)) {
    const [side, k] = spec;
    c1 = [trackX(p0[1], side, k) + bx, p0[1] + by];
    c2 = [trackX(p3[1], side, k) + bx, p3[1] + by];
  } else {
    c1 = [p0[0] + (p3[0] - p0[0]) / 3 + bx, p0[1] + (p3[1] - p0[1]) / 3 + by];
    c2 = [p0[0] + (2 * (p3[0] - p0[0])) / 3 + bx, p0[1] + (2 * (p3[1] - p0[1])) / 3 + by];
  }
  return splitCubic(p0, c1, c2, p3);
}

function fillFor(center, defined) {
  if (!defined.has(center)) return "#fff";
  return CENTER_FILL[center] || "#fff";
}

function toneOf(n, tones) {
  return tones[String(n)] || tones[n] || "off";
}

function strokeFor(tone) {
  if (tone === "d") return RED;
  if (tone === "both") return "url(#chBoth)";
  if (tone === "t") return "#1a9a94";
  return BLACK;
}

function addPt(pts, dx, dy) {
  return pts.map(([x, y]) => [x + dx, y + dy]);
}

function poly(pts) {
  return pts.map((p) => p.join(",")).join(" ");
}

function channelLayer(chart, layout, tones, inChannel, ui) {
  const active = new Set(
    (chart.channels || []).map((ch) => channelKey(ch.gates[0], ch.gates[1])),
  );
  const selected = ui?.type === "channel" ? ui.id : "";
  return ALL_CHANNEL_PAIRS.map(([g1, g2]) => {
    const key = channelKey(g1, g2);
    const r = routePath(g1, g2, layout);
    if (!r) return "";
    const isOn = active.has(key);
    if (isOn) {
      inChannel.add(String(g1));
      inChannel.add(String(g2));
    }
    const sel = selected === key
      ? `<path d="${r.d}" fill="none" stroke="#f0b429" stroke-width="11" stroke-linecap="round" opacity="0.55"/>`
      : "";
    const transitOnly = new Set(chart.transitOnlyKeys || []);
    const skyCh = transitOnly.has(key);
    const live = isOn ? ` class="ch-live${skyCh ? " ch-sky" : ""}"` : "";
    const body = isOn
      ? skyCh
        ? `<path${live} d="${r.d}" fill="none" stroke="#1a9a94" stroke-width="6.2" stroke-linecap="round" stroke-dasharray="7 5"/>`
        : `<path${live} d="${r.halves[0]}" fill="none" stroke="${strokeFor(toneOf(g1, tones))}" stroke-width="6.2" stroke-linecap="round"/>` +
          `<path${live} d="${r.halves[1]}" fill="none" stroke="${strokeFor(toneOf(g2, tones))}" stroke-width="6.2" stroke-linecap="round"/>`
      : `<path d="${r.d}" fill="none" stroke="#c5ced8" stroke-width="7.5" stroke-linecap="round"/>` +
        `<path d="${r.d}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
    return `${sel}${body}
      <path class="channel-hit" data-channel="${key}" d="${r.d}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="14" stroke-linecap="round" pointer-events="stroke"/>`;
  }).join("");
}

function gateSlots(layout, tones, inChannel, ui) {
  const focusGates = new Set();
  if (ui?.type === "channel" && ui.id) {
    const [a, b] = ui.id.split("-");
    focusGates.add(a);
    focusGates.add(b);
  }
  return Object.keys(GATE0)
    .map((n) => {
      const [x, y] = gateXY(n, layout);
      const tone = toneOf(n, tones);
      const plugged = inChannel.has(String(n));
      const focus = focusGates.has(String(n)) || (ui?.type === "gate" && String(ui.id) === String(n));
      let stroke = "#b0b0b0";
      let sw = 1.2;
      if (plugged) {
        stroke = PURPLE;
        sw = 2.2;
      } else if (tone === "t") {
        stroke = "#1a9a94";
        sw = 1.8;
      } else if (tone === "d") {
        stroke = RED;
        sw = 1.6;
      } else if (tone === "p" || tone === "both") {
        stroke = BLACK;
        sw = 1.6;
      }
      if (focus) {
        stroke = "#f0b429";
        sw = 2.6;
      }
      return `<g class="slot" data-gate="${n}" pointer-events="all" style="cursor:pointer">
        <circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="${stroke}" stroke-width="${sw}"/>
        <text class="gn" x="${x}" y="${y + 3.4}">${n}</text>
      </g>`;
    })
    .join("");
}

function circlePts(cx, cy, r, n = 12) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

function centerGeom(layout) {
  const o = (name) => offCenter(name, layout);
  const [hdx, hdy] = o("Head");
  const [adx, ady] = o("Ajna");
  const [tdx, tdy] = o("Throat");
  const [gdx, gdy] = o("Self");
  const [edx, edy] = o("Heart");
  const [sdx, sdy] = o("Spleen");
  const [pdx, pdy] = o("Solar Plexus");
  const [kdx, kdy] = o("Sacral");
  const [rdx, rdy] = o("Root");
  const head = addPt([[CX, 52], [CX + 48, 122], [CX - 48, 122]], hdx, hdy);
  const hx = (head[0][0] + head[1][0] + head[2][0]) / 3;
  const hy = (head[0][1] + head[1][1] + head[2][1]) / 3;
  const hr = Math.max(...head.map(([x, y]) => Math.hypot(x - hx, y - hy))) + 10;
  return {
    head,
    headBall: { cx: hx, cy: hy, r: hr },
    ajna: addPt([[CX, 186], [CX + 48, 130], [CX - 48, 130]], adx, ady),
    throat: addPt(
      [[CX, 200], [CX + 46, 222], [CX + 46, 258], [CX, 280], [CX - 46, 258], [CX - 46, 222]],
      tdx, tdy,
    ),
    self: addPt([[CX, 298], [CX + 58, 352], [CX, 406], [CX - 58, 352]], gdx, gdy),
    heart: addPt([[CX + 68, 348], [CX + 128, 312], [CX + 128, 384]], edx, edy),
    spleen: addPt([[CX - 70, 430], [CX - 188, 368], [CX - 188, 500]], sdx, sdy),
    sp: addPt([[CX + 70, 430], [CX + 188, 368], [CX + 188, 500]], pdx, pdy),
    sacral: { cx: CX + kdx, cy: 472 + kdy, r: 44 },
    root: { x: CX - 44 + rdx, y: 536 + rdy, w: 88, h: 78 },
  };
}

function convexHull(points) {
  const pts = points
    .map((p) => [p[0], p[1]])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function expandHull(hull, pad) {
  if (hull.length < 3) return hull;
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
  return hull.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return [x + (dx / len) * pad, y + (dy / len) * pad];
  });
}

function smoothPath(pts) {
  if (pts.length < 3) return "";
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    d += ` Q${a[0]} ${a[1]} ${mx} ${my}`;
  }
  return `${d} Z`;
}

function envelope(layout) {
  const g = centerGeom(layout);
  const bodyPts = [
    ...g.ajna, ...g.throat, ...g.self, ...g.heart, ...g.spleen, ...g.sp,
    ...circlePts(g.sacral.cx, g.sacral.cy, g.sacral.r, 10),
    [g.root.x, g.root.y], [g.root.x + g.root.w, g.root.y],
    [g.root.x + g.root.w, g.root.y + g.root.h], [g.root.x, g.root.y + g.root.h],
  ];
  const hull = expandHull(convexHull(bodyPts), 28);
  const { cx, cy, r } = g.headBall;
  const neckTop = cy + r - 4;
  const neckBot = Math.min(...g.ajna.map((p) => p[1])) + 4;
  const neckW = 22;
  return `<g class="envelope" pointer-events="none">
    <path d="${smoothPath(hull)}" fill="#cfd6df"/>
    <rect x="${cx - neckW / 2}" y="${neckTop}" width="${neckW}" height="${Math.max(8, neckBot - neckTop)}" rx="10" fill="#cfd6df"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#d5dbe3"/>
  </g>`;
}

function centersLayer(defined, layout, ui) {
  const sel = ui?.type === "center" ? ui.id : "";
  const sw = (name) => (sel === name ? 3.2 : 2);
  const sc = (name) => (sel === name ? PURPLE : INK);
  const { head, ajna, throat, self, heart, spleen, sp, sacral, root } = centerGeom(layout);
  return `
    <polygon data-center="Head" class="c center-hit" stroke="${sc("Head")}" stroke-width="${sw("Head")}" fill="${fillFor("Head", defined)}" points="${poly(head)}"/>
    <polygon data-center="Ajna" class="c center-hit" stroke="${sc("Ajna")}" stroke-width="${sw("Ajna")}" fill="${fillFor("Ajna", defined)}" points="${poly(ajna)}"/>
    <polygon data-center="Throat" class="c center-hit" stroke="${sc("Throat")}" stroke-width="${sw("Throat")}" fill="${fillFor("Throat", defined)}" points="${poly(throat)}"/>
    <polygon data-center="Self" class="c center-hit" stroke="${sc("Self")}" stroke-width="${sw("Self")}" fill="${fillFor("Self", defined)}" points="${poly(self)}"/>
    <polygon data-center="Heart" class="c center-hit" stroke="${sc("Heart")}" stroke-width="${sw("Heart")}" fill="${fillFor("Heart", defined)}" points="${poly(heart)}"/>
    <polygon data-center="Spleen" class="c center-hit" stroke="${sc("Spleen")}" stroke-width="${sw("Spleen")}" fill="${fillFor("Spleen", defined)}" points="${poly(spleen)}"/>
    <polygon data-center="Solar Plexus" class="c center-hit" stroke="${sc("Solar Plexus")}" stroke-width="${sw("Solar Plexus")}" fill="${fillFor("Solar Plexus", defined)}" points="${poly(sp)}"/>
    <circle data-center="Sacral" class="c center-hit" stroke="${sc("Sacral")}" stroke-width="${sw("Sacral")}" fill="${fillFor("Sacral", defined)}" cx="${sacral.cx}" cy="${sacral.cy}" r="${sacral.r}"/>
    <rect data-center="Root" class="c center-hit" stroke="${sc("Root")}" stroke-width="${sw("Root")}" fill="${fillFor("Root", defined)}" x="${root.x}" y="${root.y}" width="${root.w}" height="${root.h}" rx="5"/>
  `;
}

function tri(x, y, fill, n, meta, side, planet) {
  return `<g class="hit-meta" data-meta="${meta}" data-side="${side}" data-planet="${planet}" data-n="${n}" style="cursor:pointer">
    <polygon points="${x},${y - 10} ${x + 12},${y + 10} ${x - 12},${y + 10}" fill="${fill}" stroke="#333" stroke-width="0.7"/>
    <text x="${x}" y="${y + 7}" text-anchor="middle" font-size="10" font-weight="700" fill="#1a1a1a" pointer-events="none">${n}</text>
  </g>`;
}

function arrowR(x, y, color) {
  return `<path d="M${x} ${y - 5} H${x + 22} V${y - 11} L${x + 40} ${y} L${x + 22} ${y + 11} V${y + 5} H${x} Z" fill="${color}"/>`;
}

function arrowL(x, y, color) {
  return `<path d="M${x} ${y - 5} H${x - 22} V${y - 11} L${x - 40} ${y} L${x - 22} ${y + 11} V${y + 5} H${x} Z" fill="${color}"/>`;
}

function planetColumn(side, title, sub, color, data) {
  const left = side === "left";
  const sideName = left ? "design" : "personality";
  const tip = left ? "design" : "personality";
  const titleX = left ? 44 : 1076;
  const anchor = left ? "start" : "end";
  const badgeX = left ? 56 : 1064;
  const textX = left ? 80 : 1040;
  const rows = PLANET_ORDER.map(([key, glyph], i) => {
    const item = data?.[key];
    if (!item) return "";
    const y = 128 + i * 32;
    const extra = (key === "Sun" || key === "Earth") && item.color && item.tone
      ? left
        ? `${arrowR(150, y, color)}${tri(214, y, TONE_GREEN, item.tone, "tone", sideName, key)}${tri(246, y, COLOR_YELLOW, item.color, "color", sideName, key)}`
        : `${arrowL(970, y, color)}${tri(906, y, COLOR_YELLOW, item.color, "color", sideName, key)}${tri(874, y, TONE_GREEN, item.tone, "tone", sideName, key)}`
      : "";
    const labels = i === 0
      ? left
        ? `<text class="hit-meta" data-meta="tone" data-side="${sideName}" data-planet="Sun" x="214" y="${y + 22}" text-anchor="middle" font-size="7" fill="${MUTE}" style="cursor:pointer">ТОН</text>
           <text class="hit-meta" data-meta="color" data-side="${sideName}" data-planet="Sun" x="246" y="${y + 22}" text-anchor="middle" font-size="7" fill="${MUTE}" style="cursor:pointer">ЦВЕТ</text>`
        : `<text class="hit-meta" data-meta="color" data-side="${sideName}" data-planet="Sun" x="906" y="${y + 22}" text-anchor="middle" font-size="7" fill="${MUTE}" style="cursor:pointer">ЦВЕТ</text>
           <text class="hit-meta" data-meta="tone" data-side="${sideName}" data-planet="Sun" x="874" y="${y + 22}" text-anchor="middle" font-size="7" fill="${MUTE}" style="cursor:pointer">ТОН</text>`
      : "";
    return `<g class="hit-planet" data-planet="${key}" data-side="${sideName}" style="cursor:pointer">
      <circle cx="${badgeX}" cy="${y}" r="14" fill="${color}"/>
      <text x="${badgeX}" y="${y + 5}" text-anchor="middle" fill="#fff" font-size="15" pointer-events="none">${glyph}</text>
      <text x="${textX}" y="${y + 5}" text-anchor="${anchor}" fill="${color}" font-size="14" font-weight="600">${item.gate}.${item.line}</text>
    </g>
      ${extra}${labels}`;
  }).join("");
  return `<text class="gothic" data-tip="${tip}" x="${titleX}" y="62" text-anchor="${anchor}" fill="${color}" font-size="22">${title}</text>
    <text x="${titleX}" y="82" text-anchor="${anchor}" fill="${MUTE}" font-size="11">${sub}</text>
    ${rows}`;
}

export function renderGraph(chart, layout = emptyLayout(), ui = null) {
  const defined = new Set(chart.definedCenters);
  const tones = chart.gateTones || {};
  const inChannel = new Set();
  const channels = channelLayer(chart, layout, tones, inChannel, ui);
  const hint = ui?.type === "channel"
    ? `<text x="${CX}" y="802" text-anchor="middle" font-size="13" fill="#5a5a5a">Канал ${ui.id.replace("-", " – ")} → слоты ${ui.id.replace("-", " и ")}</text>`
    : ui?.type === "center"
      ? `<text x="${CX}" y="802" text-anchor="middle" font-size="13" fill="#5a5a5a">Центр: ${ui.id}</text>`
      : ui?.type === "gate"
        ? `<text x="${CX}" y="802" text-anchor="middle" font-size="13" fill="#5a5a5a">Ворота ${ui.id}</text>`
      : `<text x="${CX}" y="802" text-anchor="middle" font-size="12" fill="#8a8a8a">Кружок — слот ворот. Нажмите центр, трубу или слот — рассказ слева.</text>`;
  return `${envelope(layout)}${centersLayer(defined, layout, ui)}${channels}${gateSlots(layout, tones, inChannel, ui)}${hint}`;
}

export function renderBodygraphSvg(chart, layout = emptyLayout(), ui = null) {
  return `<svg viewBox="0 0 1120 820" width="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Бодиграф">
    <defs>
      <pattern id="chBoth" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="${BLACK}"/>
        <rect width="4" height="8" fill="${RED}"/>
      </pattern>
    </defs>
    <style>
      .c { fill-rule: nonzero; }
      .gn { font-family: Segoe UI, sans-serif; font-size: 9.5px; font-weight: 700; text-anchor: middle; fill:#1a1a1a; pointer-events: none; }
      .gothic { font-family: "Old English Text MT", "Blackadder ITC", "Constantia", "Times New Roman", serif; font-size: 22px; cursor: help; }
      .hit-planet, .hit-meta { cursor: pointer; }
      .center-hit, .channel-hit { cursor: grab; }
      .center-hit:active, .channel-hit:active { cursor: grabbing; }
      .ch-live { animation: chPulse 2.4s ease-in-out infinite; }
      @keyframes chPulse {
        0%, 100% { stroke-opacity: 1; }
        50% { stroke-opacity: 0.58; }
      }
    </style>
    <rect width="1120" height="820" fill="#f7f7f5"/>
    <line x1="44" y1="26" x2="1076" y2="26" stroke="#e2e2e2" stroke-width="1"/>
    ${planetColumn("left", "ДИЗАЙН", "Тело / Бессознательное", RED, chart.design)}
    ${planetColumn("right", "ЛИЧНОСТЬ", "Ум / Сознательное", BLACK, chart.personality)}
    <g id="graph">${renderGraph(chart, layout, ui)}</g>
  </svg>`;
}
