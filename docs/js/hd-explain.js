import { AUTH_NOTE, CENTERS, CHANNELS, COLOR_MEANING, GATES, PLANETS, TONE_MEANING, TYPE_NOTE, channelKey } from "./hd-lore.js?v=11";
import { GATE_TO_CENTER } from "./bodygraph-svg.js?v=11";

const CENTER_RU = {
  Head: "Голова", Ajna: "Аджна", Throat: "Горло", Self: "G-центр", Heart: "Эго",
  Sacral: "Сакрал", Spleen: "Селезёнка", "Solar Plexus": "Солнечное сплетение", Root: "Корень",
};

function p(text) {
  return `<p>${text}</p>`;
}

function toneWord(chart, gate) {
  const t = chart.gateTones?.[String(gate)];
  if (t === "both") return "и в дизайне, и в личности";
  if (t === "d") return "в дизайне (бессознательное)";
  if (t === "p") return "в личности (сознание)";
  return "не активированы планетами этой карты";
}

function strategyBlock(chart) {
  return `${TYPE_NOTE[chart.type] || ""} ${AUTH_NOTE[chart.authority] || ""}`.trim();
}

function explainCenter(chart, name) {
  const lore = CENTERS[name];
  if (!lore) return { title: name, html: p("Нет описания.") };
  const defined = (chart.definedCenters || []).includes(name);
  const body = defined ? lore.defined : lore.open;
  const role = defined
    ? "В этой карте центр определён — тема относительно стабильна и не является главным театром ложного я."
    : "В этой карте центр открыт — сюда чаще всего садится ложное я: усиление чужого поля и попытка «закрыть дыру».";
  return {
    title: lore.ru,
    html:
      p(role) +
      p(body) +
      p(`Для вас: ${strategyBlock(chart)} Если действовать из этого центра против стратегии, обычно приходит либо злость (генератор/МГ), либо горечь (проектор), либо гнев (манифестор), либо разочарование (рефлектор).`),
  };
}

function explainChannel(chart, key) {
  const lore = CHANNELS[key] || {};
  const [a, b] = key.split("-").map(Number);
  const active = (chart.channels || []).some((ch) => channelKey(ch.gates[0], ch.gates[1]) === key);
  const ch = (chart.channels || []).find((c) => channelKey(c.gates[0], c.gates[1]) === key);
  const title = `Канал ${a}–${b}${lore.ru ? " · " + lore.ru : ""}`;
  if (active) {
    return {
      title,
      html:
        p(`В этой карте канал включён${ch?.ru ? ` («${ch.ru}»)` : ""}. Это устойчивый способ, которым энергия ходит между центрами.`) +
        p(`Хорошо: ${lore.gift || "дар канала доступен как привычный навык."}`) +
        p(`Ложное я: ${lore.notSelf || "использовать канал, чтобы управлять другими или избежать стратегии."}`) +
        p(`Стратегия/авторитет: ${strategyBlock(chart)} Канал не отменяет ожидание отклика или волны — он только даёт, КАК вы проводите, когда «да» уже есть.`) +
        p("Если игнорировать авторитет, даже сильный канал начинает работать «на автомате»: вы делаете то, что умеете, а не то, что сейчас ваше."),
    };
  }
  return {
    title,
    html:
      p("В этой карте канал не определён: трубы белые. Тема не является вашей постоянной частотой — вы её пробуете в связях с людьми, у кого вторая половина живая.") +
      p(`Если бы он включился: ${lore.gift || ""}`) +
      p(`Тень той же темы: ${lore.notSelf || ""}`) +
      p("Ложное я часто пытается «достроить» такие каналы — искать партнёров или работу, чтобы наконец почувствовать завершённость. Это нормальный голод открытости, но решения всё равно через стратегию."),
  };
}

function explainGate(chart, n) {
  const gate = Number(n);
  const name = GATES[gate] || "Ворота";
  const center = GATE_TO_CENTER[gate];
  const hanging = (chart.hanging || []).includes(gate);
  const inCh = (chart.channels || []).some((ch) => ch.gates.includes(gate));
  const definedCenter = (chart.definedCenters || []).includes(center);
  let status;
  if (inCh) {
    const ch = chart.channels.find((c) => c.gates.includes(gate));
    status = `Ворота закрывают канал ${ch.gates[0]}–${ch.gates[1]} (${ch.ru}). Это не «висящие» — энергия имеет выход.`;
  } else if (hanging) {
    status = "Ворота висящие: планета стоит здесь, но парных ворот нет. Тема активна и ищет мост — человека, место, момент, где достроят канал. Ложное я начинает охотиться за этим мостом.";
  } else {
    status = "В этой карте ворота не активированы. Вы встречаете тему снаружи и можете быть мудры в ней, если не притворяетесь, что это ваш постоянный навык.";
  }
  const openCenter = !definedCenter;
  return {
    title: `Ворота ${gate} · ${name}`,
    html:
      p(`Центр: ${CENTER_RU[center] || center}. Активация: ${toneWord(chart, gate)}.`) +
      p(status) +
      p(openCenter
        ? `Центр ${CENTER_RU[center]} у вас открыт — даже активные ворота здесь больше про чувствительность, чем про «я всегда такой». Легко взять чужую историю этой темы за свою.`
        : `Центр ${CENTER_RU[center]} определён: тема ворот встроена в стабильную механику центра.`) +
      p(`Стратегия карты: ${strategyBlock(chart)}`),
  };
}

export function explainSelection(chart, ui) {
  if (!ui) {
    return {
      title: "Поле карты",
      html:
        p(`Тип: это ваша механика встречи с миром. ${strategyBlock(chart)}`) +
        p("Красный кружок — планета дизайна, чёрный — личности. Треугольники тон/цвет — слои внутри линии. Наведите на «Дизайн» / «Личность».") +
        p("Открытые центры — где вы учитесь и где чаще всего сходит с пути. Цветные трубы — где вы уже «всегда такие», и риск в том, чтобы включать их без авторитета."),
    };
  }
  if (ui.type === "center") return explainCenter(chart, ui.id);
  if (ui.type === "channel") return explainChannel(chart, ui.id);
  if (ui.type === "gate") return explainGate(chart, ui.id);
  if (ui.type === "planet") return explainPlanet(chart, ui);
  if (ui.type === "meta") return explainMeta(chart, ui);
  return { title: "", html: "" };
}

function explainPlanet(chart, ui) {
  const key = ui.id;
  const side = ui.side === "design" ? "design" : "personality";
  const pack = chart[side]?.[key];
  const lore = PLANETS[key] || { ru: key, text: "" };
  const sideRu = side === "design" ? "Дизайн (тело / бессознательное)" : "Личность (ум / сознание)";
  const gateName = pack ? (GATES[pack.gate] || "") : "";
  return {
    title: `${lore.ru} · ${sideRu}`,
    html:
      p(lore.text) +
      (pack
        ? p(`Здесь стоит в воротах ${pack.gate}.${pack.line}${gateName ? " («" + gateName + "»)" : ""}, цвет ${pack.color}, тон ${pack.tone}.`)
        : "") +
      p(side === "design"
        ? "Это не то, «кем вы хотите быть». Тело уже так ходит по миру. Ложное я начинается, когда ум спорит с этим красным."
        : "Это витрина сознания: вы это видите и можете рассказывать. Ложное я — принять чёрное за весь дизайн и игнорировать тело.") +
      p(`Стратегия карты: ${strategyBlock(chart)}`),
  };
}

function explainMeta(chart, ui) {
  const kind = ui.id;
  const side = ui.side === "design" ? "design" : "personality";
  const planet = ui.planet || "Sun";
  const pack = chart[side]?.[planet];
  const n = Number(ui.n) || (kind === "tone" ? pack?.tone : pack?.color);
  if (kind === "tone") {
    return {
      title: `Тон ${n || ""} · ${side === "design" ? "Дизайн" : "Личность"}`,
      html:
        p(TONE_MEANING.about) +
        p(TONE_MEANING[n] || "Число тона 1–6 читается внутри цвета этой активации.") +
        (pack ? p(`У ${PLANETS[planet]?.ru || planet} здесь тон ${pack.tone} (ворота ${pack.gate}.${pack.line}).`) : "") +
        p("Тон не меняет тип и стратегию. Он шепчет, КАК тема входит в тело. Ложное я пытается «выбрать правильный тон» умом."),
    };
  }
  return {
    title: `Цвет ${n || ""} · ${side === "design" ? "Дизайн" : "Личность"}`,
    html:
      p(COLOR_MEANING.about) +
      p(COLOR_MEANING[n] || "Цвет 1–6 — слой внутри линии.") +
      (pack ? p(`У ${PLANETS[planet]?.ru || planet} здесь цвет ${pack.color} (ворота ${pack.gate}.${pack.line}).`) : "") +
      p(side === "design"
        ? "Цвет Солнца/Земли дизайна часто связывают с тем, как тело берёт пищу и среду. Это не диета «навсегда» из блога — ориентир, который проверяют жизнью."
        : "Цвет личности ближе к тому, как ум смотрит: ракурс, а не приказ."),
  };
}

export function transitBanner(natal, overlay, sky) {
  const sun = sky.Sun;
  const earth = sky.Earth;
  const title = `Транзит: Солнце ${sun.gate}.${sun.line} · Земля ${earth.gate}.${earth.line}`;
  const skyList = ["Sun", "Earth", "Moon", "Mercury", "Venus", "Mars"]
    .map((k) => `${PLANETS[k].ru} ${sky[k].gate}.${sky[k].line}`)
    .join(", ");
  const only = overlay.transitOnlyKeys || [];
  const newCenters = overlay.definedCenters.filter((c) => !(natal.definedCenters || []).includes(c));
  const bridges = [];
  for (const key of only) {
    const lore = CHANNELS[key];
    bridges.push(`${key.replace("-", "–")}${lore?.ru ? " («" + lore.ru + "»)" : ""}`);
  }
  const what =
    bridges.length
      ? `Небо достраивает ваши висящие ворота в канал(ы): ${bridges.join(", ")}. Это не новый тип навсегда — временный мост. Стратегия и авторитет рождения остаются; транзит даёт погоду, не паспорт.`
      : "Сейчас небо не закрывает новых каналов в вашей карте. Транзит всё равно давит своими воротами: вы можете сильнее чувствовать эти темы в людях и новостях.";
  const extra = newCenters.length
    ? ` Временно подсвечиваются центры: ${newCenters.join(", ")}.`
    : "";
  return {
    title,
    decode: `Сейчас в небе (фрагмент): ${skyList}.`,
    forChart: what + extra,
  };
}

export function loreToHtml(entry) {
  return `<h2>${entry.title}</h2>${entry.html}`;
}
