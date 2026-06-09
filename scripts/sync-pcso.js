const fs = require("fs");
const path = require("path");

const SOURCE_URL = "https://www.pcso.gov.ph/SearchLottoResult.aspx";
const DATA_PATH = path.join(__dirname, "..", "data", "results.json");

const gameMap = [
  [/^Ultra Lotto 6\/58$/i, "6-58", "9PM"],
  [/^Grand Lotto 6\/55$/i, "6-55", "9PM"],
  [/^Super\s*Lotto 6\/49$/i, "6-49", "9PM"],
  [/^Superlotto 6\/49$/i, "6-49", "9PM"],
  [/^Mega\s*Lotto 6\/45$/i, "6-45", "9PM"],
  [/^Megalotto 6\/45$/i, "6-45", "9PM"],
  [/^Lotto 6\/42$/i, "6-42", "9PM"],
  [/^6D Lotto$/i, "6D", "9PM"],
  [/^4D Lotto$/i, "4D", "9PM"],
  [/^3D Lotto 2PM$/i, "3D-2PM", "2PM"],
  [/^3D Lotto 5PM$/i, "3D-5PM", "5PM"],
  [/^3D Lotto 9PM$/i, "3D-9PM", "9PM"],
  [/^3D Lotto 11AM$/i, "3D-2PM", "2PM"],
  [/^3D Lotto 4PM$/i, "3D-5PM", "5PM"],
  [/^2D Lotto 2PM$/i, "2D-2PM", "2PM"],
  [/^2D Lotto 5PM$/i, "2D-5PM", "5PM"],
  [/^2D Lotto 9PM$/i, "2D-9PM", "9PM"],
  [/^2D Lotto 11AM$/i, "2D-2PM", "2PM"],
  [/^2D Lotto 4PM$/i, "2D-5PM", "5PM"]
];

function normalizeText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapGame(name) {
  for (const [pattern, seriesCode, drawTime] of gameMap) {
    if (pattern.test(name.trim())) return { seriesCode, drawTime };
  }
  return null;
}

function toDate(value) {
  const [month, day, year] = value.split("/").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseMoney(value) {
  return Number(String(value).replace(/,/g, ""));
}

function parseRecords(text) {
  const gamePattern = [
    "Ultra Lotto 6/58",
    "Grand Lotto 6/55",
    "Super Lotto 6/49",
    "Superlotto 6/49",
    "Mega Lotto 6/45",
    "Megalotto 6/45",
    "Lotto 6/42",
    "6D Lotto",
    "4D Lotto",
    "3D Lotto 2PM",
    "3D Lotto 5PM",
    "3D Lotto 9PM",
    "3D Lotto 11AM",
    "3D Lotto 4PM",
    "2D Lotto 2PM",
    "2D Lotto 5PM",
    "2D Lotto 9PM",
    "2D Lotto 11AM",
    "2D Lotto 4PM"
  ].map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

  const rowPattern = new RegExp(
    `(${gamePattern})\\s+([0-9]{1,2}(?:-[0-9]{1,2}){1,5})\\s+([0-9]{1,2}/[0-9]{1,2}/[0-9]{4})\\s+([0-9,]+\\.\\d{2})\\s+([0-9]+)`,
    "gi"
  );

  const records = [];
  let match;
  while ((match = rowPattern.exec(text)) !== null) {
    const [, gameName, combination, drawDate, jackpot, winners] = match;
    const mapped = mapGame(gameName);
    if (!mapped) continue;
    records.push({
      id: `${mapped.seriesCode}-${toDate(drawDate)}-${mapped.drawTime}`,
      seriesCode: mapped.seriesCode,
      drawDate: toDate(drawDate),
      drawTime: mapped.drawTime,
      numbers: combination.split("-").map(Number),
      jackpot: parseMoney(jackpot),
      winners: Number(winners),
      sourceLabel: "PCSO Official Auto Sync",
      sourceUrl: SOURCE_URL,
      status: "official"
    });
  }
  return records;
}

function readExisting() {
  if (!fs.existsSync(DATA_PATH)) {
    return {
      source: "PCSO Search Lotto Draw Result by Date",
      sourceUrl: SOURCE_URL,
      updatedAt: null,
      records: []
    };
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8").replace(/^\uFEFF/, ""));
}

async function main() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "user-agent": "Mozilla/5.0 PH Lotto Hub results sync",
      accept: "text/html,application/xhtml+xml"
    }
  });

  if (!response.ok) {
    throw new Error(`PCSO request failed: ${response.status}`);
  }

  const html = await response.text();
  const fetchedRecords = parseRecords(normalizeText(html));
  if (fetchedRecords.length === 0) {
    throw new Error("No PCSO result rows parsed");
  }

  const existing = readExisting();
  const byId = new Map((existing.records || []).map((record) => [record.id, record]));
  fetchedRecords.forEach((record) => byId.set(record.id, record));

  const records = Array.from(byId.values()).sort((a, b) =>
    `${a.drawDate}-${a.drawTime}-${a.seriesCode}`.localeCompare(`${b.drawDate}-${b.drawTime}-${b.seriesCode}`)
  );

  const existingRecords = (existing.records || []).slice().sort((a, b) =>
    `${a.drawDate}-${a.drawTime}-${a.seriesCode}`.localeCompare(`${b.drawDate}-${b.drawTime}-${b.seriesCode}`)
  );

  if (JSON.stringify(existingRecords) === JSON.stringify(records)) {
    console.log(`No result changes. Parsed ${fetchedRecords.length} PCSO rows.`);
    return;
  }

  const output = {
    source: "PCSO Search Lotto Draw Result by Date",
    sourceUrl: SOURCE_URL,
    updatedAt: new Date().toISOString(),
    records
  };

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Synced ${fetchedRecords.length} PCSO rows. Total stored rows: ${records.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
