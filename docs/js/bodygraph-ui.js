import { emptyLayout, renderBodygraphSvg, renderGraph } from "./bodygraph-svg.js?v=11";
import { COLUMN_TIP } from "./hd-lore.js?v=11";

const LS_KEY = "hd-bodygraph-layout-v1";
const API = "/api/layout";

function localLayoutApi() {
  const h = location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

function clone(layout) {
  return JSON.parse(JSON.stringify(layout || emptyLayout()));
}

function normalize(raw) {
  const base = emptyLayout();
  if (!raw || typeof raw !== "object") return base;
  base.centers = raw.centers && typeof raw.centers === "object" ? raw.centers : {};
  base.channels = raw.channels && typeof raw.channels === "object" ? raw.channels : {};
  return base;
}

export async function loadLayout() {
  if (localLayoutApi()) {
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (res.ok) {
        const txt = await res.text();
        if (txt && txt.trim() && txt.trim() !== "{}") return normalize(JSON.parse(txt));
      }
    } catch {
      /* fall through to localStorage */
    }
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return emptyLayout();
}

export function saveLayout(layout, { beacon = false } = {}) {
  const json = JSON.stringify(layout);
  try {
    localStorage.setItem(LS_KEY, json);
  } catch {
    /* ignore */
  }
  if (!localLayoutApi()) return;
  if (beacon && navigator.sendBeacon) {
    try {
      navigator.sendBeacon(API, new Blob([json], { type: "application/json" }));
      return;
    } catch {
      /* fall through */
    }
  }
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
    keepalive: true,
  }).catch(() => {});
}

function svgPoint(svg, event) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  return pt.matrixTransform(ctm.inverse());
}

export function mountBodygraph(host, chart, initialLayout, { onSelect } = {}) {
  let layout = clone(initialLayout);
  let view = chart;
  let ui = null;
  let drag = null;
  let saveTimer = 0;

  host.innerHTML = renderBodygraphSvg(view, layout, ui);
  const svg = host.querySelector("svg");
  const graph = () => svg.querySelector("#graph");
  let tipEl = document.getElementById("mouse-tip");
  if (!tipEl) {
    tipEl = document.createElement("div");
    tipEl.id = "mouse-tip";
    tipEl.hidden = true;
    document.body.appendChild(tipEl);
  }

  const emit = () => {
    if (onSelect) onSelect(ui, view);
  };

  const paint = () => {
    graph().innerHTML = renderGraph(view, layout, ui);
  };

  const persistSoon = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveLayout(layout), 350);
  };

  const persistNow = () => {
    clearTimeout(saveTimer);
    saveLayout(layout, { beacon: true });
  };

  svg.addEventListener("pointermove", (ev) => {
    const tipNode = ev.target.closest("[data-tip]");
    if (tipNode) {
      const kind = tipNode.getAttribute("data-tip");
      tipEl.hidden = false;
      tipEl.textContent = COLUMN_TIP[kind] || "";
      tipEl.style.left = `${ev.clientX}px`;
      tipEl.style.top = `${ev.clientY}px`;
    } else {
      tipEl.hidden = true;
    }
    if (!drag) return;
    const p = svgPoint(svg, ev);
    const dx = p.x - drag.x;
    const dy = p.y - drag.y;
    if (drag.kind === "center") {
      layout.centers[drag.id] = [drag.start[0] + dx, drag.start[1] + dy];
    } else {
      layout.channels[drag.id] = [drag.start[0] + dx, drag.start[1] + dy];
    }
    paint();
  });

  svg.addEventListener("pointerleave", () => {
    tipEl.hidden = true;
  });

  svg.addEventListener("pointerdown", (ev) => {
    const metaEl = ev.target.closest("[data-meta]");
    const planetEl = ev.target.closest("[data-planet]");
    const gateEl = ev.target.closest("[data-gate]");
    const channelEl = ev.target.closest("[data-channel]");
    const centerEl = ev.target.closest("[data-center]");
    if (metaEl) {
      ev.preventDefault();
      ui = {
        type: "meta",
        id: metaEl.getAttribute("data-meta"),
        side: metaEl.getAttribute("data-side"),
        planet: metaEl.getAttribute("data-planet"),
        n: metaEl.getAttribute("data-n"),
      };
      drag = null;
      paint();
      emit();
      return;
    }
    if (planetEl && !channelEl && !centerEl && !gateEl) {
      ev.preventDefault();
      ui = {
        type: "planet",
        id: planetEl.getAttribute("data-planet"),
        side: planetEl.getAttribute("data-side"),
      };
      drag = null;
      paint();
      emit();
      return;
    }
    if (!gateEl && !channelEl && !centerEl) {
      ui = null;
      paint();
      emit();
      return;
    }
    ev.preventDefault();
    const p = svgPoint(svg, ev);
    if (gateEl) {
      ui = { type: "gate", id: gateEl.getAttribute("data-gate") };
      drag = null;
      paint();
      emit();
      return;
    }
    if (channelEl) {
      const id = channelEl.getAttribute("data-channel");
      ui = { type: "channel", id };
      drag = {
        kind: "channel",
        id,
        x: p.x,
        y: p.y,
        start: (layout.channels[id] || [0, 0]).slice(),
      };
    } else {
      const id = centerEl.getAttribute("data-center");
      ui = { type: "center", id };
      drag = {
        kind: "center",
        id,
        x: p.x,
        y: p.y,
        start: (layout.centers[id] || [0, 0]).slice(),
      };
    }
    svg.setPointerCapture(ev.pointerId);
    paint();
    emit();
  });

  const endDrag = () => {
    if (!drag) return;
    drag = null;
    persistSoon();
  };

  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);

  const onHide = () => persistNow();
  window.addEventListener("pagehide", onHide);
  window.addEventListener("beforeunload", onHide);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistNow();
  });

  return {
    reset() {
      layout = emptyLayout();
      ui = null;
      paint();
      emit();
      persistNow();
    },
    setView(next) {
      view = next;
      paint();
    },
  };
}
