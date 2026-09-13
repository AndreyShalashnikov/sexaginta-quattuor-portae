import {
  Body,
  DEG2RAD,
  Ecliptic,
  EclipticGeoMoon,
  GeoVector,
  MakeTime,
  RAD2DEG,
} from "../vendor/astronomy-engine.js";

const PLANETS = [
  ["Sun", Body.Sun],
  ["Moon", Body.Moon],
  ["Mercury", Body.Mercury],
  ["Venus", Body.Venus],
  ["Mars", Body.Mars],
  ["Jupiter", Body.Jupiter],
  ["Saturn", Body.Saturn],
  ["Uranus", Body.Uranus],
  ["Neptune", Body.Neptune],
  ["Pluto", Body.Pluto],
];

const MOTORS = new Set(["Sacral", "Heart", "Solar Plexus", "Root"]);

async function fetchJson(name) {
  const urls = [
    new URL(`../data/${name}`, import.meta.url).href,
    new URL(`./data/${name}`, document.baseURI).href,
  ];
  let last = name;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();
      if (!res.ok || text.trimStart().startsWith("<")) {
        last = `${name} (${res.status})`;
        continue;
      }
      return JSON.parse(text);
    } catch (err) {
      last = err.message || name;
    }
  }
  throw new Error(`Не удалось загрузить ${last}`);
}

export async function loadHdTables() {
  const [mandala, centers, channels] = await Promise.all([
    fetchJson("rave-mandala.json"),
    fetchJson("centers.json"),
    fetchJson("channels.json"),
  ]);
  return { mandala, centers, channels: channels.channels };
}

export function degreeToGateLine(degree, mandala) {
  const gateSize = mandala.gateSizeDeg;
  const lineSize = mandala.lineSizeDeg;
  let adjusted = (degree - mandala.hdStartDegree) % 360;
  if (adjusted < 0) adjusted += 360;
  let index = Math.floor(adjusted / gateSize);
  if (index >= 64) index = 63;
  const inGate = adjusted % gateSize;
  let line = Math.floor(inGate / lineSize) + 1;
  if (line > 6) line = 6;
  const inLine = inGate % lineSize;
  const colorSize = lineSize / 6;
  const toneSize = colorSize / 6;
  let color = Math.floor(inLine / colorSize) + 1;
  if (color > 6) color = 6;
  let tone = Math.floor((inLine % colorSize) / toneSize) + 1;
  if (tone > 6) tone = 6;
  return { gate: mandala.gateSequence[index], line, color, tone, degree };
}

function geoEclipticLon(body, date) {
  if (body === Body.Moon) return EclipticGeoMoon(date).lon;
  const vec = GeoVector(body, date, true);
  return Ecliptic(vec).elon;
}

export function trueNodeLongitude(date) {
  const t0 = MakeTime(date);
  const t1 = t0.AddDays(1 / 48);
  const m0 = EclipticGeoMoon(t0);
  const m1 = EclipticGeoMoon(t1);
  const cart = (m) => {
    const lon = m.lon * DEG2RAD;
    const lat = m.lat * DEG2RAD;
    const r = m.dist || 1;
    return {
      x: r * Math.cos(lat) * Math.cos(lon),
      y: r * Math.cos(lat) * Math.sin(lon),
      z: r * Math.sin(lat),
    };
  };
  const a = cart(m0);
  const b = cart(m1);
  const hx = a.y * (b.z - a.z) - a.z * (b.y - a.y);
  const hy = a.z * (b.x - a.x) - a.x * (b.z - a.z);
  let om = Math.atan2(hx, -hy) * RAD2DEG;
  if (om < 0) om += 360;
  return om;
}

function planetSet(date, mandala) {
  const out = {};
  for (const [name, body] of PLANETS) {
    const lon = geoEclipticLon(body, date);
    out[name] = degreeToGateLine(lon, mandala);
  }
  const earthLon = (out.Sun.degree + 180) % 360;
  out.Earth = degreeToGateLine(earthLon, mandala);
  const nn = trueNodeLongitude(date);
  out["N.Node"] = degreeToGateLine(nn, mandala);
  out["S.Node"] = degreeToGateLine((nn + 180) % 360, mandala);
  return out;
}

function findDesignDate(birthDate, mandala) {
  const pSun = geoEclipticLon(Body.Sun, birthDate);
  const target = (pSun - mandala.solarArcDesignDeg + 360) % 360;
  let lo = new Date(birthDate.getTime() - 100 * 86400000);
  let hi = new Date(birthDate.getTime() - 80 * 86400000);
  for (let i = 0; i < 50; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    const sun = geoEclipticLon(Body.Sun, mid);
    let diff = sun - target;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-5) return mid;
    if (diff > 0) hi = mid;
    else lo = mid;
  }
  return new Date((lo.getTime() + hi.getTime()) / 2);
}

function definedChannels(allGates, channelTable) {
  const set = new Set(allGates);
  return channelTable.filter((ch) => set.has(ch.gates[0]) && set.has(ch.gates[1]));
}

function definedCentersFromChannels(activeChannels) {
  const defined = new Set();
  for (const ch of activeChannels) {
    defined.add(ch.centers[0]);
    defined.add(ch.centers[1]);
  }
  return defined;
}

function motorToThroat(defined, activeChannels) {
  if (!defined.has("Throat")) return false;
  const graph = {};
  for (const name of defined) graph[name] = new Set();
  for (const ch of activeChannels) {
    const [a, b] = ch.centers;
    if (!graph[a] || !graph[b]) continue;
    graph[a].add(b);
    graph[b].add(a);
  }
  const seen = new Set();
  const q = ["Throat"];
  while (q.length) {
    const cur = q.shift();
    if (seen.has(cur)) continue;
    seen.add(cur);
    if (MOTORS.has(cur)) return true;
    for (const n of graph[cur] || []) q.push(n);
  }
  return false;
}

function hdType(defined, motorThroat) {
  if (defined.size === 0) return "Reflector";
  const sacral = defined.has("Sacral");
  if (sacral && motorThroat) return "Manifesting Generator";
  if (sacral) return "Generator";
  if (motorThroat) return "Manifestor";
  return "Projector";
}

function authority(defined, type) {
  if (type === "Reflector") return "Lunar";
  if (defined.has("Solar Plexus")) return "Emotional";
  if (defined.has("Sacral")) return "Sacral";
  if (defined.has("Spleen")) return "Splenic";
  if (defined.has("Heart")) return "Ego";
  if (defined.has("Self")) return "Self-Projected";
  return "Mental/Outer";
}

function strategy(type) {
  switch (type) {
    case "Manifesting Generator":
      return "Respond then inform";
    case "Generator":
      return "To respond";
    case "Manifestor":
      return "To inform";
    case "Projector":
      return "Wait for invitation";
    default:
      return "Wait a lunar cycle";
  }
}

function definitionKind(defined, activeChannels) {
  if (defined.size === 0) return "None";
  const graph = {};
  for (const name of defined) graph[name] = new Set();
  for (const ch of activeChannels) {
    const [a, b] = ch.centers;
    if (!graph[a] || !graph[b]) continue;
    graph[a].add(b);
    graph[b].add(a);
  }
  const leftover = new Set(defined);
  let parts = 0;
  while (leftover.size) {
    parts += 1;
    const start = leftover.values().next().value;
    const q = [start];
    leftover.delete(start);
    while (q.length) {
      const cur = q.shift();
      for (const n of graph[cur] || []) {
        if (leftover.has(n)) {
          leftover.delete(n);
          q.push(n);
        }
      }
    }
  }
  if (parts === 1) return "Single";
  if (parts === 2) return "Split";
  if (parts === 3) return "Triple split";
  return "Quadruple split";
}

function hangingGates(allGates, activeChannels) {
  const inChannel = new Set();
  for (const ch of activeChannels) {
    inChannel.add(ch.gates[0]);
    inChannel.add(ch.gates[1]);
  }
  return [...allGates].filter((g) => !inChannel.has(g)).sort((a, b) => a - b);
}

function gateTones(personality, design) {
  const p = new Set(Object.values(personality).map((x) => x.gate));
  const d = new Set(Object.values(design).map((x) => x.gate));
  const tones = {};
  for (const g of new Set([...p, ...d])) {
    tones[String(g)] = p.has(g) && d.has(g) ? "both" : p.has(g) ? "p" : "d";
  }
  return tones;
}

function channelKeyPair(g1, g2) {
  return g1 < g2 ? `${g1}-${g2}` : `${g2}-${g1}`;
}

export function currentSky(mandala, when = new Date()) {
  return planetSet(when, mandala);
}

export function withTransit(natal, tables, sky) {
  const skyGates = Object.values(sky).map((x) => x.gate);
  const allGates = [...new Set([...natal.allGates, ...skyGates])].sort((a, b) => a - b);
  const active = definedChannels(allGates, tables.channels);
  const natalKeys = new Set(
    natal.channels.map((ch) => channelKeyPair(ch.gates[0], ch.gates[1])),
  );
  const overlayKeys = active.map((ch) => channelKeyPair(ch.gates[0], ch.gates[1]));
  const transitOnlyKeys = overlayKeys.filter((k) => !natalKeys.has(k));
  const defined = definedCentersFromChannels(active);
  const tones = { ...natal.gateTones };
  for (const g of skyGates) {
    if (!tones[String(g)]) tones[String(g)] = "t";
  }
  return {
    ...natal,
    channels: active,
    definedCenters: [...defined],
    openCenters: Object.keys(tables.centers).filter((c) => !defined.has(c)),
    hanging: hangingGates(allGates, active),
    allGates,
    gateTones: tones,
    natalChannelKeys: [...natalKeys],
    transitOnlyKeys,
    sky,
    overlay: true,
  };
}

export function calculateChart(birthUtcDate, tables) {
  const { mandala, centers, channels } = tables;
  const personality = planetSet(birthUtcDate, mandala);
  const designDate = findDesignDate(birthUtcDate, mandala);
  const design = planetSet(designDate, mandala);
  const allGates = [
    ...new Set([
      ...Object.values(personality).map((x) => x.gate),
      ...Object.values(design).map((x) => x.gate),
    ]),
  ].sort((a, b) => a - b);
  const active = definedChannels(allGates, channels);
  const defined = definedCentersFromChannels(active);
  const motorThroat = motorToThroat(defined, active);
  const type = hdType(defined, motorThroat);
  const profile = `${personality.Sun.line}/${design.Sun.line}`;
  const allCenterNames = Object.keys(centers);
  return {
    type,
    profile,
    authority: authority(defined, type),
    strategy: strategy(type),
    definition: definitionKind(defined, active),
    definedCenters: [...defined],
    openCenters: allCenterNames.filter((c) => !defined.has(c)),
    channels: active,
    hanging: hangingGates(allGates, active),
    personality,
    design,
    designDate: designDate.toISOString(),
    allGates,
    gateTones: gateTones(personality, design),
    incarnation: {
      pSun: personality.Sun.gate,
      pEarth: personality.Earth.gate,
      dSun: design.Sun.gate,
      dEarth: design.Earth.gate,
    },
  };
}

export function wallTimeToUtc(year, month, day, hour, minute, timeZone) {
  let utc = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 8; i++) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(new Date(utc));
    const val = (type) => {
      const p = parts.find((x) => x.type === type);
      return p ? Number(p.value) : 0;
    };
    let hh = val("hour");
    if (hh === 24) hh = 0;
    const shown = Date.UTC(val("year"), val("month") - 1, val("day"), hh, val("minute"));
    const target = Date.UTC(year, month - 1, day, hour, minute);
    const delta = target - shown;
    if (delta === 0) break;
    utc += delta;
  }
  return new Date(utc);
}
