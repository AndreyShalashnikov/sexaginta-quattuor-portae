import { loadHdTables, calculateChart, currentSky, withTransit, wallTimeToUtc } from "./js/hd-engine.js";
import { resolvePlace } from "./js/geo-parser.js";
import { loadLayout, mountBodygraph } from "./js/bodygraph-ui.js?v=11";
import { explainSelection, loreToHtml, transitBanner } from "./js/hd-explain.js?v=11";

const TYPE_RU = {
  "Manifesting Generator": "Манифестирующий генератор",
  Generator: "Генератор",
  Manifestor: "Манифестор",
  Projector: "Проектор",
  Reflector: "Рефлектор",
};
const AUTH_RU = {
  Sacral: "Сакральный",
  Emotional: "Эмоциональный",
  Splenic: "Селезёночный",
  Ego: "Эго",
  "Self-Projected": "Проекция себя",
  "Mental/Outer": "Внешний",
  Lunar: "Лунный",
};
const STRAT_RU = {
  "Respond then inform": "Откликнуться, затем информировать",
  "To respond": "Откликаться",
  "To inform": "Информировать",
  "Wait for invitation": "Ждать приглашения",
  "Wait a lunar cycle": "Ждать лунный цикл",
};
const DEF_RU = {
  Single: "Единое определение",
  Split: "Раздвоенное определение",
  "Triple split": "Тройной сплит",
  "Quadruple split": "Четверной сплит",
  None: "Нет определения",
};
const CENTER_RU = {
  Head: "Голова",
  Ajna: "Аджна",
  Throat: "Горло",
  Self: "G-центр",
  Heart: "Эго",
  Sacral: "Сакрал",
  Spleen: "Селезёнка",
  "Solar Plexus": "Солнечное сплетение",
  Root: "Корень",
};

const form = document.getElementById("form");
const statusEl = document.getElementById("status");
const geoEl = document.getElementById("geo");
const resultEl = document.getElementById("result");
const btn = document.getElementById("generate");

let tablesPromise = null;
function getTables() {
  if (!tablesPromise) {
    tablesPromise = loadHdTables().catch((err) => {
      tablesPromise = null;
      throw err;
    });
  }
  return tablesPromise;
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  btn.disabled = true;
  statusEl.textContent = "Ищу место на карте…";
  resultEl.hidden = true;
  try {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value || "12:00";
    const place = document.getElementById("place").value;
    if (!date) throw new Error("Укажите дату рождения");

    const geo = await resolvePlace(place);
    geoEl.hidden = false;
    geoEl.innerHTML = `<strong>Понял место:</strong> ${escapeHtml(geo.resolved.label)}<br>
      ${geo.resolved.latitude.toFixed(4)}° с.ш., ${geo.resolved.longitude.toFixed(4)}° в.д. · пояс ${escapeHtml(geo.resolved.timezone)}`;

    statusEl.textContent = "Считаю эфемериды и ворота…";
    const tables = await getTables();
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const utc = wallTimeToUtc(y, m, d, hh, mm, geo.resolved.timezone);
    const chart = calculateChart(utc, tables);
    const sky = currentSky(tables.mandala, new Date());
    const overlay = withTransit(chart, tables, sky);
    const layout = await loadLayout();
    renderResult(chart, overlay, sky, geo, date, time, utc, layout);
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = err.message || String(err);
  } finally {
    btn.disabled = false;
  }
});

function renderResult(chart, overlay, sky, geo, date, time, utc, layout) {
  const type = TYPE_RU[chart.type] || chart.type;
  const auth = AUTH_RU[chart.authority] || chart.authority;
  const strat = STRAT_RU[chart.strategy] || chart.strategy;
  const def = DEF_RU[chart.definition] || chart.definition;
  const defined = chart.definedCenters.map((c) => CENTER_RU[c] || c).join(", ");
  const open = chart.openCenters.map((c) => CENTER_RU[c] || c).join(", ");
  const ch = chart.channels
    .map((c) => `${c.gates[0]}–${c.gates[1]} ${c.ru}`)
    .join("<br>");
  const inc = `${chart.incarnation.pSun}/${chart.incarnation.pEarth} | ${chart.incarnation.dSun}/${chart.incarnation.dEarth}`;

  const banner = transitBanner(chart, overlay, sky);
  resultEl.hidden = false;
  resultEl.innerHTML = `
    <div class="pills">
      <span class="pill">${escapeHtml(type)}</span>
      <span class="pill">Профиль ${escapeHtml(chart.profile)}</span>
      <span class="pill">${escapeHtml(auth)} авторитет</span>
      <span class="pill">${escapeHtml(def)}</span>
    </div>
    <p class="meta">Местное время ${escapeHtml(date)} ${escapeHtml(time)} (${escapeHtml(geo.resolved.timezone)}) → UTC ${utc.toISOString().slice(0, 16).replace("T", " ")}</p>
    <p class="hint">Кружок — слот ворот. Клик по центру, трубе, слоту, планете, тону или цвету — рассказ слева. Наведите на «Дизайн» / «Личность». Раскладка сохраняется в этом браузере.</p>
    <div class="wrap">
      <aside class="lore" id="lore-panel"></aside>
      <div>
        <div class="transit-box">
          <h3>${escapeHtml(banner.title)}</h3>
          <p>${escapeHtml(banner.decode)}</p>
          <p>${escapeHtml(banner.forChart)}</p>
        </div>
        <div class="mode-switch" role="group">
          <label><input type="radio" name="bg-mode" value="natal" checked> Натальная карта</label>
          <label><input type="radio" name="bg-mode" value="transit"> С учётом текущего неба</label>
        </div>
        <div id="bg-host"></div>
        <p><button type="button" class="linkish" id="reset-layout">Сбросить раскладку</button></p>
      </div>
      <aside>
        <h2>Стратегия</h2>
        <ul><li>${escapeHtml(strat)}</li></ul>
        <h2>Каналы</h2>
        <p>${ch || "Нет определённых каналов"}</p>
        <h2>Определены</h2>
        <p>${escapeHtml(defined || "—")}</p>
        <h2>Открыты</h2>
        <p>${escapeHtml(open)}</p>
        <h2>Висящие ворота</h2>
        <p>${chart.hanging.join(", ") || "—"}</p>
        <h2>Крест (ворота Солнца/Земли)</h2>
        <p>${inc}</p>
      </aside>
    </div>
    <p class="legend">
      <span class="sw" style="background:#fff"></span>открытый центр
      <span class="sw" style="background:#f0d03c"></span>голова / G
      <span class="sw" style="background:#c6dc3c"></span>аджна
      <span class="sw" style="background:#3bb8c8"></span>горло
      <span class="sw" style="background:#f07828"></span>сакрал
      <span class="sw" style="background:#e53935"></span>эго
      <span class="sw" style="background:#c9a66b"></span>селезёнка / корень
      <span class="sw" style="background:#d99070"></span>солнечное сплетение
      &nbsp; бирюзовая пунктир — канал только от текущего неба
    </p>
  `;
  const loreEl = document.getElementById("lore-panel");
  const paintLore = (ui, viewChart) => {
    loreEl.innerHTML = loreToHtml(explainSelection(viewChart || chart, ui));
  };
  const host = document.getElementById("bg-host");
  const mounted = mountBodygraph(host, chart, layout, { onSelect: paintLore });
  paintLore(null);
  document.querySelectorAll('input[name="bg-mode"]').forEach((el) => {
    el.addEventListener("change", () => {
      mounted.setView(el.value === "transit" ? overlay : chart);
    });
  });
  document.getElementById("reset-layout").addEventListener("click", () => mounted.reset());
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
