const PLACE_NOISE =
  /\b(город|гор\.?|г\.|пос[её]лок|пос\.|пгт|село|деревня|д\.|станица|аул|хутор|область|обл\.|край|район|р-н|республика|респ\.|автономный округ|ао|край)\b/gi;

const RU_LAT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function transliterate(s) {
  return [...s.toLowerCase()].map((ch) => RU_LAT[ch] ?? ch).join("");
}

function hasCyrillic(s) {
  return /[а-яё]/i.test(s);
}

function normalizePlace(raw) {
  let s = String(raw || "").trim().replace(/\s+/g, " ");
  s = s.replace(/ё/g, "е").replace(/Ё/g, "Е");
  const cleaned = s.replace(PLACE_NOISE, " ").replace(/[.,;/]+/g, " ").replace(/\s+/g, " ").trim();
  return { original: String(raw || "").trim(), cleaned, translit: transliterate(cleaned) };
}

function tokenizeHint(s) {
  return normalizePlace(s).cleaned.toLowerCase().split(" ").filter((w) => w.length > 2);
}

function scoreCandidate(hit, query) {
  const tokens = tokenizeHint(query);
  const blob = [hit.name, hit.admin1, hit.admin2, hit.country, hit.country_code]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/ё/g, "е");
  let score = 0;
  if (hit.population) score += Math.min(40, Math.log10(hit.population + 1) * 8);
  if (hasCyrillic(query) && (hit.country_code === "RU" || hit.country === "Россия")) score += 18;
  if (hit.feature_code && /PPL|PPLA/.test(hit.feature_code)) score += 8;
  for (const t of tokens) {
    if (blob.includes(t)) score += 12;
  }
  const qn = normalizePlace(query).cleaned.toLowerCase();
  if ((hit.name || "").toLowerCase().replace(/ё/g, "е") === qn) score += 25;
  return score;
}

function normalizeHits(data) {
  if (!data) return [];
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data)) {
    return data.map((r) => ({
      name: r.name || (r.display_name || "").split(",")[0],
      latitude: Number(r.lat ?? r.latitude),
      longitude: Number(r.lon ?? r.longitude),
      country: r.address?.country || r.country,
      country_code: (r.address?.country_code || r.country_code || "").toUpperCase(),
      admin1: r.address?.state || r.admin1,
      admin2: r.address?.county || r.admin2,
      timezone: r.timezone || null,
      population: r.population || 0,
      feature_code: r.feature_code || r.type,
      display: r.display_name,
    }));
  }
  return [];
}

async function searchOpenMeteo(name, language) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", language);
  url.searchParams.set("format", "json");
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function searchNominatim(q) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "8");
  const res = await fetch(url, {
    headers: { Accept: "application/json", "Accept-Language": "ru" },
  });
  if (!res.ok) return [];
  const rows = await res.json();
  return rows.map((r) => ({
    name: r.name || r.display_name.split(",")[0],
    latitude: Number(r.lat),
    longitude: Number(r.lon),
    country: r.address?.country,
    country_code: (r.address?.country_code || "").toUpperCase(),
    admin1: r.address?.state || r.address?.region,
    admin2: r.address?.county,
    timezone: null,
    population: r.extratags?.population ? Number(r.extratags.population) : 0,
    feature_code: r.type,
    display: r.display_name,
    source: "nominatim",
  }));
}

function labelOf(hit) {
  const bits = [hit.name, hit.admin1, hit.country].filter(Boolean);
  return bits.join(", ");
}

export async function resolvePlace(raw) {
  const { original, cleaned, translit } = normalizePlace(raw);
  if (!cleaned) throw new Error("Пустое место рождения");

  const queries = [];
  const ru = hasCyrillic(original);
  queries.push([cleaned, ru ? "ru" : "en"]);
  const firstWord = cleaned.split(" ").filter((w) => w.length > 3)[0];
  if (firstWord && firstWord.toLowerCase() !== cleaned.toLowerCase()) {
    queries.push([firstWord, ru ? "ru" : "en"]);
  }
  if (cleaned !== original) queries.push([original, ru ? "ru" : "en"]);
  if (ru) {
    queries.push([cleaned + " Россия", "ru"]);
    queries.push([translit, "en"]);
  }

  const seen = new Map();
  const add = (hit) => {
    const key = `${hit.latitude?.toFixed(3)}|${hit.longitude?.toFixed(3)}`;
    if (!seen.has(key)) seen.set(key, hit);
  };

  for (const [q, lang] of queries) {
    try {
      const rows = await searchOpenMeteo(q, lang);
      rows.forEach((r) => add({ ...r, source: "open-meteo", display: labelOf(r) }));
    } catch {
      /* try next */
    }
    if (seen.size >= 3) break;
  }

  if (seen.size === 0) {
    for (const [q] of queries.slice(0, 3)) {
      try {
        (await searchNominatim(q)).forEach(add);
      } catch {
        /* ignore */
      }
    }
  }

  const ranked = [...seen.values()]
    .map((h) => ({ ...h, score: scoreCandidate(h, original) }))
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    throw new Error("Не удалось понять место. Попробуйте город и страну, например: Щёлково, Россия");
  }

  const best = ranked[0];
  if (!best.timezone) {
    best.timezone = await guessTimezone(best.latitude, best.longitude);
  }

  return {
    query: original,
    resolved: {
      name: best.name,
      admin1: best.admin1 || "",
      country: best.country || "",
      countryCode: best.country_code || "",
      latitude: best.latitude,
      longitude: best.longitude,
      timezone: best.timezone,
      elevation: best.elevation,
      population: best.population,
      label: best.display || labelOf(best),
      source: best.source,
    },
    alternatives: ranked.slice(1, 5).map((h) => ({
      label: h.display || labelOf(h),
      latitude: h.latitude,
      longitude: h.longitude,
      timezone: h.timezone,
      score: h.score,
    })),
  };
}

async function guessTimezone(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.timezone) return data.timezone;
  } catch {
    /* fall through */
  }
  return "UTC";
}
