const CENTER_XY = {
  Head: [280, 72],
  Ajna: [280, 160],
  Throat: [280, 245],
  Self: [280, 360],
  Heart: [370, 360],
  Spleen: [115, 368],
  "Solar Plexus": [440, 368],
  Sacral: [280, 483],
  Root: [280, 603],
};

const ALL_GATES = {
  head: [
    { n: "61", x: 280, y: 62 },
    { n: "64", x: 236, y: 98 },
    { n: "63", x: 324, y: 98 },
  ],
  ajna: [
    { n: "47", x: 236, y: 148 },
    { n: "24", x: 256, y: 136 },
    { n: "4", x: 304, y: 136 },
    { n: "17", x: 324, y: 148 },
    { n: "11", x: 248, y: 176 },
    { n: "43", x: 308, y: 176 },
  ],
  throat: [
    { n: "62", x: 256, y: 208 },
    { n: "23", x: 280, y: 208 },
    { n: "56", x: 304, y: 208 },
    { n: "35", x: 328, y: 236 },
    { n: "12", x: 328, y: 256 },
    { n: "45", x: 304, y: 290 },
    { n: "33", x: 280, y: 290 },
    { n: "8", x: 256, y: 290 },
    { n: "31", x: 232, y: 256 },
    { n: "20", x: 232, y: 236 },
    { n: "16", x: 220, y: 248 },
  ],
  g: [
    { n: "7", x: 280, y: 322 },
    { n: "1", x: 242, y: 342 },
    { n: "13", x: 318, y: 342 },
    { n: "15", x: 228, y: 364 },
    { n: "25", x: 332, y: 364 },
    { n: "10", x: 242, y: 386 },
    { n: "46", x: 318, y: 386 },
    { n: "2", x: 280, y: 408 },
  ],
  heart: [
    { n: "21", x: 386, y: 336 },
    { n: "40", x: 360, y: 364 },
    { n: "26", x: 412, y: 364 },
    { n: "51", x: 386, y: 394 },
  ],
  spleen: [
    { n: "48", x: 132, y: 336 },
    { n: "57", x: 78, y: 352 },
    { n: "44", x: 78, y: 384 },
    { n: "50", x: 108, y: 428 },
    { n: "32", x: 148, y: 404 },
    { n: "28", x: 148, y: 380 },
    { n: "18", x: 118, y: 412 },
  ],
  solar: [
    { n: "6", x: 428, y: 336 },
    { n: "37", x: 482, y: 352 },
    { n: "22", x: 482, y: 384 },
    { n: "36", x: 452, y: 428 },
    { n: "30", x: 412, y: 404 },
    { n: "55", x: 412, y: 380 },
    { n: "49", x: 440, y: 444 },
  ],
  sacral: [
    { n: "5", x: 256, y: 442 },
    { n: "14", x: 280, y: 442 },
    { n: "29", x: 304, y: 442 },
    { n: "59", x: 332, y: 476 },
    { n: "9", x: 332, y: 500 },
    { n: "3", x: 304, y: 532 },
    { n: "42", x: 280, y: 532 },
    { n: "27", x: 256, y: 532 },
    { n: "34", x: 230, y: 484 },
  ],
  root: [
    { n: "58", x: 256, y: 562 },
    { n: "38", x: 280, y: 562 },
    { n: "54", x: 304, y: 562 },
    { n: "53", x: 332, y: 596 },
    { n: "60", x: 332, y: 620 },
    { n: "52", x: 304, y: 652 },
    { n: "19", x: 280, y: 652 },
    { n: "39", x: 256, y: 652 },
    { n: "41", x: 230, y: 604 },
  ],
};

function fillFor(center, defined) {
  if (!defined.has(center)) return "#fff";
  if (center === "Sacral" || center === "Heart") return "#c4452b";
  if (center === "Self" || center === "Ajna" || center === "Head") return "#e8c34a";
  return "#8b5e34";
}

function gateClass(n, tones) {
  return tones[n] || "off";
}

export function renderBodygraphSvg(chart) {
  const defined = new Set(chart.definedCenters);
  const tones = chart.gateTones || {};
  const labels = Object.values(ALL_GATES)
    .flat()
    .map(
      (g) =>
        `<text class="${gateClass(g.n, tones)}" x="${g.x}" y="${g.y}">${g.n}</text>`,
    )
    .join("");

  const channelLines = (chart.channels || [])
    .map((ch) => {
      const a = CENTER_XY[ch.centers[0]];
      const b = CENTER_XY[ch.centers[1]];
      if (!a || !b) return "";
      return `<line class="ch" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    })
    .join("");

  return `<svg viewBox="0 0 560 700" width="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Sexaginta Quattuor Portae">
    <style>
      .c { stroke:#4a3728; stroke-width:2.4; }
      .g { font-family: Segoe UI, sans-serif; font-size: 13px; font-weight: 700; text-anchor: middle; }
      .off { fill:#b7aa9c; font-weight: 600; }
      .p { fill:#111; }
      .d { fill:#c4452b; }
      .both { fill:#1c4b8c; }
      .ch { stroke:#2b2118; stroke-width:8; stroke-linecap:round; }
    </style>
    ${channelLines}
    <polygon class="c" fill="${fillFor("Head", defined)}" points="280,36 338,108 222,108"/>
    <polygon class="c" fill="${fillFor("Ajna", defined)}" points="280,196 338,124 222,124"/>
    <rect class="c" fill="${fillFor("Throat", defined)}" x="246" y="214" width="68" height="62"/>
    <polygon class="c" fill="${fillFor("Self", defined)}" points="280,304 336,360 280,416 224,360"/>
    <polygon class="c" fill="${fillFor("Heart", defined)}" points="398,360 350,322 350,398"/>
    <polygon class="c" fill="${fillFor("Spleen", defined)}" points="150,368 86,318 86,418"/>
    <polygon class="c" fill="${fillFor("Solar Plexus", defined)}" points="410,368 474,318 474,418"/>
    <rect class="c" fill="${fillFor("Sacral", defined)}" x="242" y="448" width="76" height="70"/>
    <rect class="c" fill="${fillFor("Root", defined)}" x="242" y="568" width="76" height="70"/>
    <g class="g">${labels}</g>
  </svg>`;
}
