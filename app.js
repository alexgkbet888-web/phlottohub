const drawSeries = [
  { code: "2D-2PM", family: "2D", name: "2D Lotto 2PM", count: 2, min: 1, max: 31, ordered: false, days: "Daily", drawTime: "2PM", prizeLabel: "Prize" },
  { code: "2D-5PM", family: "2D", name: "2D Lotto 5PM", count: 2, min: 1, max: 31, ordered: false, days: "Daily", drawTime: "5PM", prizeLabel: "Prize" },
  { code: "2D-9PM", family: "2D", name: "2D Lotto 9PM", count: 2, min: 1, max: 31, ordered: false, days: "Daily", drawTime: "9PM", prizeLabel: "Prize" },
  { code: "3D-2PM", family: "3D", name: "3D Lotto 2PM", count: 3, min: 0, max: 9, ordered: true, days: "Daily", drawTime: "2PM", prizeLabel: "Prize" },
  { code: "3D-5PM", family: "3D", name: "3D Lotto 5PM", count: 3, min: 0, max: 9, ordered: true, days: "Daily", drawTime: "5PM", prizeLabel: "Prize" },
  { code: "3D-9PM", family: "3D", name: "3D Lotto 9PM", count: 3, min: 0, max: 9, ordered: true, days: "Daily", drawTime: "9PM", prizeLabel: "Prize" },
  { code: "4D", family: "4D", name: "4D Lotto", count: 4, min: 0, max: 9, ordered: true, days: "Mon, Wed, Fri", drawTime: "9PM", prizeLabel: "Prize" },
  { code: "6D", family: "6D", name: "6D Lotto", count: 6, min: 0, max: 9, ordered: true, days: "Tue, Thu, Sat", drawTime: "9PM", prizeLabel: "Prize" },
  { code: "6-42", family: "6/42", name: "Lotto 6/42", count: 6, min: 1, max: 42, ordered: false, days: "Tue, Thu, Sat", drawTime: "9PM", prizeLabel: "Jackpot" },
  { code: "6-45", family: "6/45", name: "Mega Lotto 6/45", count: 6, min: 1, max: 45, ordered: false, days: "Mon, Wed, Fri", drawTime: "9PM", prizeLabel: "Jackpot" },
  { code: "6-49", family: "6/49", name: "Super Lotto 6/49", count: 6, min: 1, max: 49, ordered: false, days: "Tue, Thu, Sun", drawTime: "9PM", prizeLabel: "Jackpot" },
  { code: "6-55", family: "6/55", name: "Grand Lotto 6/55", count: 6, min: 1, max: 55, ordered: false, days: "Mon, Wed, Sat", drawTime: "9PM", prizeLabel: "Jackpot" },
  { code: "6-58", family: "6/58", name: "Ultra Lotto 6/58", count: 6, min: 1, max: 58, ordered: false, days: "Tue, Fri, Sun", drawTime: "9PM", prizeLabel: "Jackpot" }
];

const trendViews = {
  basic: "Basic Trend",
  oddEven: "Odd/Even Trend",
  bigSmall: "Big/Small Trend",
  sum: "Sum Trend",
  span: "Span Trend",
  tail: "Tail Trend",
  zone: "Zone Trend",
  hotCold: "Hot/Cold Omission"
};

const state = {
  seriesCode: "2D-2PM",
  windowSize: 30,
  customFrom: null,
  customTo: null,
  view: "basic",
  showOmission: true,
  showLines: true,
  highlightRepeat: true
};

const routeKeys = new Set(["home", "lottery", "basketball", "football", "sabong", "download"]);
const routeMeta = {
  home: { title: "PH Lotto Hub", action: "Lotto", actionRoute: "lottery" },
  lottery: { title: "Lotto Center", action: "Home", actionRoute: "home" },
  basketball: { title: "Basketball", action: "Lotto", actionRoute: "lottery" },
  football: { title: "Football", action: "Lotto", actionRoute: "lottery" },
  sabong: { title: "Sabong", action: "Lotto", actionRoute: "lottery" },
  download: { title: "App Download", action: "Lotto", actionRoute: "lottery" }
};
const anchorRouteMap = {
  official: "lottery",
  trend: "lottery",
  stats: "lottery",
  videos: "lottery",
  sources: "home"
};

try {
  const params = new URLSearchParams(window.location.search);
  const seriesParam = params.get("series");
  const viewParam = params.get("view");
  if (seriesParam && drawSeries.some((item) => item.code === seriesParam)) state.seriesCode = seriesParam;
  if (viewParam && trendViews[viewParam]) state.view = viewParam;
} catch (error) {
  // Ignore URL parsing failures in old browsers.
}

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2
});

const MANILA_TIME_ZONE = "Asia/Manila";

function dateInManila(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

const currentDate = dateInManila();
let syncedUpdatedAt = null;
let lastTrackedRoute = null;

function trackEvent(name, params = {}) {
  if (typeof window.phTrack === "function") {
    window.phTrack(name, params);
  }
}

function trackRouteView(route) {
  const key = `${route}:${window.location.pathname}${window.location.hash || ""}`;
  if (lastTrackedRoute === key) return;
  lastTrackedRoute = key;
  if (typeof window.phPageView === "function") {
    window.phPageView(route, {
      series_code: state.seriesCode,
      trend_view: state.view
    });
  }
}

const officialRows = [
  ["6-58", "2026-06-07", "9PM", [53, 1, 4, 45, 51, 22], 75000000, 0],
  ["6-49", "2026-06-07", "9PM", [41, 31, 44, 25, 42, 33], 25000000, 0],
  ["3D-2PM", "2026-06-07", "2PM", [9, 9, 9], 4500, 599],
  ["3D-5PM", "2026-06-07", "5PM", [4, 8, 8], 4500, 164],
  ["3D-9PM", "2026-06-07", "9PM", [7, 9, 3], 4500, 215],
  ["2D-2PM", "2026-06-07", "2PM", [17, 5], 4000, 290],
  ["2D-5PM", "2026-06-07", "5PM", [9, 29], 4000, 312],
  ["2D-9PM", "2026-06-07", "9PM", [3, 30], 4000, 532],
  ["6-55", "2026-06-06", "9PM", [32, 36, 29, 19, 8, 30], 45000000, 0],
  ["6-42", "2026-06-06", "9PM", [33, 38, 34, 28, 36, 7], 17763940.65, 0],
  ["6D", "2026-06-06", "9PM", [9, 8, 1, 3, 9, 2], 485321.72, 0],
  ["3D-2PM", "2026-06-06", "2PM", [4, 0, 3], 4500, 143],
  ["3D-5PM", "2026-06-06", "5PM", [9, 6, 0], 4500, 155],
  ["3D-9PM", "2026-06-06", "9PM", [8, 6, 5], 4500, 320],
  ["2D-2PM", "2026-06-06", "2PM", [13, 10], 4000, 123],
  ["2D-5PM", "2026-06-06", "5PM", [18, 29], 4000, 122],
  ["2D-9PM", "2026-06-06", "9PM", [13, 24], 4000, 348],
  ["6-58", "2026-06-05", "9PM", [20, 45, 13, 31, 7, 27], 75000000, 0],
  ["6-45", "2026-06-05", "9PM", [1, 38, 18, 42, 4, 44], 43744766.73, 0],
  ["4D", "2026-06-05", "9PM", [2, 7, 9, 5], 22581, 44],
  ["3D-2PM", "2026-06-05", "2PM", [8, 7, 2], 4500, 84],
  ["3D-5PM", "2026-06-05", "5PM", [8, 4, 4], 4500, 82],
  ["3D-9PM", "2026-06-05", "9PM", [9, 0, 7], 4500, 379],
  ["2D-2PM", "2026-06-05", "2PM", [14, 28], 4000, 213],
  ["2D-5PM", "2026-06-05", "5PM", [14, 28], 4000, 59],
  ["2D-9PM", "2026-06-05", "9PM", [6, 29], 4000, 922]
];

const swertres2024Rows = [
  ["2024-05-10", "2-8-9", "7-7-3", null],
  ["2024-05-09", "2-3-7", "0-8-6", "7-4-1"],
  ["2024-05-08", "3-2-0", "2-2-9", "8-7-3"],
  ["2024-05-07", "8-4-6", "0-3-4", "4-2-5"],
  ["2024-05-06", "1-5-6", "3-6-0", "0-1-3"],
  ["2024-05-05", "9-6-7", "2-1-6", "0-5-4"],
  ["2024-05-04", "6-9-0", "1-5-2", "6-1-7"],
  ["2024-05-03", "0-2-1", "3-3-1", "6-0-6"],
  ["2024-05-02", "6-0-1", "6-6-0", "4-8-2"],
  ["2024-05-01", "9-8-4", "2-6-5", "0-7-5"],
  ["2024-04-30", "4-1-8", "7-6-4", "3-2-3"],
  ["2024-04-29", "8-5-4", "7-5-4", "7-1-1"],
  ["2024-04-28", "4-6-3", "2-3-6", "8-5-7"],
  ["2024-04-27", "2-3-6", "6-3-8", "6-0-7"],
  ["2024-04-26", "3-2-0", "2-3-6", "9-3-9"],
  ["2024-04-25", "0-6-8", "2-8-1", "8-5-1"],
  ["2024-04-24", "9-8-3", "9-3-2", "7-4-9"],
  ["2024-04-23", "4-0-4", "2-0-8", "8-4-4"],
  ["2024-04-22", "6-3-3", "0-8-5", "2-2-4"],
  ["2024-04-21", "1-2-2", "8-7-3", "6-1-6"],
  ["2024-04-20", "5-9-7", "1-4-2", "0-2-7"],
  ["2024-04-19", "8-8-2", "7-4-1", "1-1-5"],
  ["2024-04-18", "5-9-8", "7-7-7", "5-2-8"],
  ["2024-04-17", "0-8-2", "5-7-4", "2-5-0"],
  ["2024-04-16", "3-8-1", "1-2-7", "4-4-0"],
  ["2024-04-15", "3-2-4", "9-3-7", "4-0-3"],
  ["2024-04-14", "4-1-2", "6-6-0", "9-4-0"],
  ["2024-04-13", "6-3-3", "8-6-5", "4-8-1"],
  ["2024-04-12", "6-9-0", "9-4-8", "7-5-6"],
  ["2024-04-11", "6-5-9", "0-1-6", "4-2-1"],
  ["2024-04-10", "6-9-9", "6-0-7", "5-9-2"],
  ["2024-04-09", "8-0-6", "5-0-2", "2-9-6"],
  ["2024-04-08", "5-5-8", "1-7-3", "7-5-6"],
  ["2024-04-07", "7-2-4", "0-4-5", "1-4-3"],
  ["2024-04-06", "4-9-6", "4-8-0", "3-4-1"],
  ["2024-04-05", "0-9-8", "9-3-1", "6-0-4"],
  ["2024-04-04", "3-8-6", "5-5-8", "1-8-0"],
  ["2024-04-03", "1-8-6", "4-8-5", "4-5-4"],
  ["2024-04-02", "3-4-3", "2-1-3", "4-2-5"],
  ["2024-04-01", "8-0-3", "5-5-5", "1-3-8"],
  ["2024-03-27", "3-0-7", "5-8-6", "3-0-2"],
  ["2024-03-26", "6-0-2", "1-5-7", "5-0-5"],
  ["2024-03-25", "8-4-7", "1-2-6", "8-7-2"],
  ["2024-03-24", "5-2-6", "0-9-2", "7-4-0"],
  ["2024-03-23", "4-5-1", "0-1-3", "6-8-1"],
  ["2024-03-22", "4-3-8", "3-0-8", "7-9-6"],
  ["2024-03-21", "3-8-5", "9-1-9", "0-5-7"],
  ["2024-03-20", "6-9-8", "8-0-7", "4-2-7"],
  ["2024-03-19", "6-8-5", "0-5-1", "2-7-1"],
  ["2024-03-18", "3-9-7", "4-1-1", "3-7-9"],
  ["2024-03-17", "3-3-2", "0-4-4", "0-4-2"],
  ["2024-03-16", "5-9-8", "9-1-5", "4-3-9"],
  ["2024-03-15", "1-1-6", "4-9-2", "2-9-5"],
  ["2024-03-14", "7-3-4", "0-6-4", "4-2-2"],
  ["2024-03-13", "2-5-1", "4-9-6", "9-0-9"],
  ["2024-03-12", "6-6-6", "4-3-8", "2-8-9"],
  ["2024-03-11", "1-2-6", "9-6-3", "8-8-2"],
  ["2024-03-10", "8-8-8", "4-6-7", "2-2-1"],
  ["2024-03-09", "9-1-4", "1-2-8", "5-6-4"],
  ["2024-03-08", "0-9-2", "7-7-6", "0-0-3"],
  ["2024-03-07", "4-8-9", "7-3-7", "3-6-5"],
  ["2024-03-06", "8-3-2", "8-2-1", "4-1-1"],
  ["2024-03-05", "9-0-2", "8-6-6", "6-7-1"],
  ["2024-03-04", "8-3-4", "8-3-9", "4-0-5"],
  ["2024-03-03", "0-8-2", "5-9-3", "9-6-8"],
  ["2024-03-02", "2-3-3", "2-1-4", "5-8-8"],
  ["2024-03-01", "2-8-3", "4-4-5", "8-7-0"],
  ["2024-02-29", "3-8-2", "8-8-4", "4-8-7"],
  ["2024-02-28", "7-3-5", "2-2-7", "8-6-5"],
  ["2024-02-27", "0-9-7", "2-9-1", "3-6-0"],
  ["2024-02-26", "0-1-9", "6-2-5", "8-9-4"],
  ["2024-02-25", "7-7-7", "6-8-3", "6-0-9"],
  ["2024-02-24", "2-6-7", "0-4-5", "3-4-3"],
  ["2024-02-23", "9-1-2", "1-1-9", "3-5-7"],
  ["2024-02-22", "3-2-2", "6-2-7", "9-7-3"],
  ["2024-02-21", "3-2-2", "7-1-3", "9-4-9"],
  ["2024-02-20", "7-2-9", "8-2-9", "5-1-5"],
  ["2024-02-19", "3-8-9", "4-9-4", "2-5-6"],
  ["2024-02-18", "5-8-2", "1-0-3", "2-4-5"],
  ["2024-02-17", "4-9-6", "6-1-8", "1-7-8"],
  ["2024-02-16", "5-5-5", "4-6-8", "8-7-0"],
  ["2024-02-15", "7-1-7", "2-9-9", "1-9-2"],
  ["2024-02-14", "3-6-1", "0-7-7", "2-3-0"],
  ["2024-02-13", "4-1-4", "5-9-5", "2-9-1"],
  ["2024-02-12", "3-7-1", "6-1-9", "4-5-1"],
  ["2024-02-11", "3-7-7", "5-7-8", "9-7-3"],
  ["2024-02-10", "5-7-2", "4-5-1", "4-3-9"],
  ["2024-02-09", "4-9-9", "2-0-4", "8-0-5"],
  ["2024-02-08", "3-0-1", "3-8-9", "6-0-2"],
  ["2024-02-07", "0-2-0", "1-0-3", "7-5-3"],
  ["2024-02-06", "3-5-6", "4-8-8", "6-7-5"],
  ["2024-02-05", "1-9-6", "2-8-5", "2-7-5"],
  ["2024-02-04", "0-7-0", "2-3-0", "0-4-8"],
  ["2024-02-03", "8-5-1", "3-7-2", "0-1-3"],
  ["2024-02-02", "5-1-9", "4-3-6", "9-8-4"],
  ["2024-02-01", "9-0-4", "2-9-7", "4-8-7"],
  ["2024-01-31", "0-3-2", "6-4-0", "0-8-2"],
  ["2024-01-30", "9-5-2", "8-5-7", "6-7-1"],
  ["2024-01-29", "8-1-0", "4-0-6", "2-2-4"],
  ["2024-01-28", "9-5-4", "6-9-8", "4-5-8"],
  ["2024-01-27", "3-2-6", "7-6-6", "2-5-7"],
  ["2024-01-26", "3-3-2", "9-6-0", "4-0-2"],
  ["2024-01-25", "8-5-2", "5-0-0", "0-6-7"],
  ["2024-01-24", "4-5-7", "2-2-6", "0-2-5"],
  ["2024-01-23", "6-1-3", "6-6-0", "4-4-1"],
  ["2024-01-22", "6-1-5", "4-2-3", "5-5-6"],
  ["2024-01-21", "2-2-7", "7-2-3", "1-7-3"],
  ["2024-01-20", "8-2-6", "5-0-6", "3-7-4"],
  ["2024-01-19", "5-4-5", "5-0-5", "4-7-4"],
  ["2024-01-18", "8-4-0", "5-1-7", "9-1-5"],
  ["2024-01-17", "5-7-1", "7-7-0", "1-2-9"],
  ["2024-01-16", "3-1-7", "4-0-8", "5-8-4"],
  ["2024-01-15", "8-4-9", "9-7-7", "1-3-8"],
  ["2024-01-14", "5-5-0", "8-6-9", "3-1-0"],
  ["2024-01-13", "9-4-7", "1-3-2", "0-2-4"],
  ["2024-01-12", "4-4-7", "4-3-7", "2-4-1"],
  ["2024-01-11", "0-7-3", "5-2-1", "9-9-1"],
  ["2024-01-10", "1-9-8", "0-4-0", "8-1-0"],
  ["2024-01-09", "9-5-7", "3-0-5", "4-1-5"],
  ["2024-01-08", "0-2-4", "7-3-4", "5-3-5"],
  ["2024-01-07", "5-3-3", "7-2-1", "9-1-5"],
  ["2024-01-06", "4-1-3", "9-5-1", "9-9-7"],
  ["2024-01-05", "6-0-4", "5-7-6", "1-2-3"],
  ["2024-01-04", "8-6-6", "8-2-1", "1-4-3"],
  ["2024-01-03", "2-1-4", "5-9-3", "0-3-0"],
  ["2024-01-02", "5-5-2", "4-8-2", "5-4-7"]
];

function parseHistoricalDigits(value) {
  return value ? value.split("-").map(Number) : null;
}

const historical3DBackfillRows = swertres2024Rows.flatMap(([drawDate, twoPm, fivePm, ninePm]) => [
  ["3D-2PM", drawDate, "2PM", parseHistoricalDigits(twoPm)],
  ["3D-5PM", drawDate, "5PM", parseHistoricalDigits(fivePm)],
  ["3D-9PM", drawDate, "9PM", parseHistoricalDigits(ninePm)]
]).filter((row) => row[3]).map(([seriesCode, drawDate, drawTime, numbers]) => [
  seriesCode,
  drawDate,
  drawTime,
  numbers,
  4500,
  null,
  "LottoPCSO 2024 Swertres Historical Backfill",
  "backfill"
]);

const allDrawRows = officialRows.concat(historical3DBackfillRows);

let drawResults = allDrawRows.map(([seriesCode, drawDate, drawTime, rawNumbers, jackpot, winners, sourceLabel = "PCSO Official Public Result Page", status = "official"]) => {
  const item = drawSeries.find((entry) => entry.code === seriesCode);
  const numbers = item.ordered ? rawNumbers : rawNumbers.slice().sort((a, b) => a - b);
  return {
    id: `${seriesCode}-${drawDate}-${drawTime}`,
    seriesCode,
    drawDate,
    drawTime,
    numbers,
    jackpot,
    winners,
    status,
    sourceLabel
  };
});

async function loadSyncedResults() {
  try {
    const response = await fetch(`data/results.json?v=${Date.now()}`);
    if (!response.ok) return;
    const payload = await response.json();
    if (!Array.isArray(payload.records)) return;
    syncedUpdatedAt = payload.updatedAt || null;

    const byId = new Map(drawResults.map((row) => [row.id, row]));
    payload.records.forEach((record) => {
      const item = drawSeries.find((entry) => entry.code === record.seriesCode);
      if (!item || !record.drawDate || !record.drawTime || !Array.isArray(record.numbers)) return;
      const numbers = item.ordered ? record.numbers.map(Number) : record.numbers.map(Number).sort((a, b) => a - b);
      const row = {
        id: `${record.seriesCode}-${record.drawDate}-${record.drawTime}`,
        seriesCode: record.seriesCode,
        drawDate: record.drawDate,
        drawTime: record.drawTime,
        numbers,
        jackpot: Number(record.jackpot || 0),
        winners: Number.isFinite(Number(record.winners)) ? Number(record.winners) : null,
        status: record.status || "official",
        sourceLabel: cleanSourceLabel(record.sourceLabel)
      };
      byId.set(row.id, row);
    });

    drawResults = Array.from(byId.values()).sort((a, b) => `${a.drawDate}-${a.drawTime}-${a.seriesCode}`.localeCompare(`${b.drawDate}-${b.drawTime}-${b.seriesCode}`));
  } catch (error) {
    // Static fallback data remains available when the sync file is missing or blocked.
  }
}

const videoItems = [
  {
    title: "PCSO Official Draw Videos",
    label: "Official YouTube channel",
    url: "https://www.youtube.com/channel/UCpOm2kv1upnIFoOT7rSp6hg/videos",
    summary: "Production pages can match draw videos by draw date and session."
  },
  {
    title: "YouTube RSS Sync",
    label: "No-key backup feed",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCpOm2kv1upnIFoOT7rSp6hg",
    summary: "RSS can monitor recent uploads; YouTube Data API can add thumbnails and richer metadata."
  }
];

const sportsScoreSections = {
  basketballScores: [
    {
      league: "NBA",
      title: "NBA Scores",
      url: "https://www.nba.com/scores",
      summary: "Official NBA scores, schedules, game centers and recaps.",
      status: "Official source"
    },
    {
      league: "FIBA",
      title: "FIBA Events and Results",
      url: "https://www.fiba.basketball/en/events",
      summary: "Official international basketball events, fixtures and results.",
      status: "Official source"
    },
    {
      league: "PBA",
      title: "Philippines Basketball Feed",
      url: "",
      summary: "Use a licensed local sports data provider before showing live PBA scores.",
      status: "Licensed feed required"
    }
  ],
  footballScores: [
    {
      league: "FIFA",
      title: "FIFA Match Centre",
      url: "https://www.fifa.com/en/match-centre",
      summary: "Official international football match centre and results.",
      status: "Official source"
    },
    {
      league: "UEFA",
      title: "UEFA Fixtures and Results",
      url: "https://www.uefa.com/uefachampionsleague/fixtures-results/",
      summary: "Official UEFA fixtures, results and competition data.",
      status: "Official source"
    },
    {
      league: "Premier League",
      title: "Premier League Fixtures",
      url: "https://www.premierleague.com/fixtures",
      summary: "Official Premier League fixtures, match centre and results.",
      status: "Official source"
    }
  ],
  sabongScores: [
    {
      league: "Authorized Sabong Feed",
      title: "Licensed Event Results",
      url: "",
      summary: "Show only legal, authorized event results. No odds, betting links or unverified match data.",
      status: "Source required"
    }
  ]
};

const lottoBrandMap = {
  "2D": { title: "2D", subtitle: "LOTTO", tag: "2D Lotto" },
  "3D": { title: "3D", subtitle: "LOTTO", tag: "3D Lotto" },
  "4D": { title: "4D", subtitle: "LOTTO", tag: "4D Lotto" },
  "6D": { title: "6D", subtitle: "LOTTO", tag: "6D Lotto" },
  "6/42": { title: "6/42", subtitle: "LOTTO", tag: "Lotto 6/42" },
  "6/45": { title: "6/45", subtitle: "MEGALOTTO", tag: "Mega Lotto 6/45" },
  "6/49": { title: "6/49", subtitle: "SUPER LOTTO", tag: "Super Lotto 6/49" },
  "6/55": { title: "6/55", subtitle: "GRAND LOTTO", tag: "Grand Lotto 6/55" },
  "6/58": { title: "6/58", subtitle: "ULTRA LOTTO", tag: "Ultra Lotto 6/58" }
};

function series() {
  return drawSeries.find((item) => item.code === state.seriesCode);
}

function pad(value, currentSeries = series()) {
  return currentSeries.max <= 9 ? String(value) : String(value).padStart(2, "0");
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatSyncTime(value) {
  if (!value) return "Awaiting auto sync";
  return new Date(value).toLocaleString("en-PH", {
    timeZone: MANILA_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function cleanSourceLabel(value) {
  if (!value) return "PCSO Official Auto Sync";
  if (/PCSO|\u5b98\u65b9|\u540c\u6b65|\u81ea\u52a8/.test(value)) return "PCSO Official Auto Sync";
  if (/LottoPCSO|Swertres|\u5386\u53f2|\u56de\u586b/.test(value)) return "LottoPCSO 2024 Swertres Historical Backfill";
  return value;
}

function rowsForSeries(seriesCode = state.seriesCode) {
  return drawResults
    .filter((row) => row.seriesCode === seriesCode)
    .sort((a, b) => `${a.drawDate}-${a.drawTime}`.localeCompare(`${b.drawDate}-${b.drawTime}`));
}

function windowRows() {
  const rows = rowsForSeries();
  if (state.customFrom && state.customTo) {
    return rows.filter((row) => row.drawDate >= state.customFrom && row.drawDate <= state.customTo);
  }
  return rows.slice(-state.windowSize);
}

function familyGroups() {
  const groups = [];
  drawSeries.forEach((item) => {
    if (!groups.some((group) => group.family === item.family)) {
      groups.push({ family: item.family, label: item.family.includes("/") ? item.family : `${item.family} Lotto` });
    }
  });
  return groups;
}

function familySlug(family) {
  return family.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function familyLogo(family, compact = false) {
  const brand = lottoBrandMap[family];
  return `
    <span class="lotto-badge lotto-${familySlug(family)} ${compact ? "is-compact" : ""}">
      <em>${brand.subtitle}</em>
      <b>${brand.title}</b>
      <small>${brand.tag}</small>
    </span>
  `;
}

function siblingSeries() {
  return drawSeries.filter((item) => item.family === series().family);
}

function numbersForSeries(currentSeries) {
  return Array.from({ length: currentSeries.max - currentSeries.min + 1 }, (_, index) => currentSeries.min + index);
}

function trendGroups(currentSeries) {
  if (currentSeries.family === "2D") {
    return [{ key: "all", label: "Number Trend", type: "all" }];
  }

  if (currentSeries.ordered) {
    return Array.from({ length: currentSeries.count }, (_, index) => ({
      key: `p${index}`,
      label: `Position ${index + 1}`,
      type: "position",
      position: index
    }));
  }

  return [{ key: "all", label: "Number Trend", type: "all" }];
}

function buildMatrix(rows, currentSeries) {
  const nums = numbersForSeries(currentSeries);
  const groups = trendGroups(currentSeries);
  const omissions = new Map(groups.map((group) => [group.key, new Map(nums.map((num) => [num, 0]))]));
  const stats = new Map(groups.map((group) => [group.key, new Map(nums.map((num) => [num, {
    frequency: 0,
    maxOmission: 0,
    totalOmission: 0,
    hitCount: 0,
    currentOmission: rows.length
  }]))]));

  const matrixRows = rows.map((row, rowIndex) => {
    const previous = rows[rowIndex - 1]?.numbers || [];
    const cellsByGroup = {};

    groups.forEach((group) => {
      cellsByGroup[group.key] = nums.map((num) => {
        const isHit = group.type === "position" ? row.numbers[group.position] === num : row.numbers.includes(num);
        const groupOmissions = omissions.get(group.key);
        const stat = stats.get(group.key).get(num);
        const omissionBefore = groupOmissions.get(num);
        const cell = { number: num, hit: isHit, repeat: isHit && previous.includes(num), omission: omissionBefore };

        if (isHit) {
          stat.frequency += 1;
          stat.maxOmission = Math.max(stat.maxOmission, omissionBefore);
          stat.totalOmission += omissionBefore;
          stat.hitCount += 1;
          stat.currentOmission = 0;
          groupOmissions.set(num, 1);
        } else {
          stat.currentOmission += 1;
          groupOmissions.set(num, omissionBefore + 1);
        }
        return cell;
      });
    });

    return { ...row, cellsByGroup };
  });

  groups.forEach((group) => {
    nums.forEach((num) => {
      const omission = omissions.get(group.key).get(num);
      const stat = stats.get(group.key).get(num);
      stat.maxOmission = Math.max(stat.maxOmission, omission);
      stat.averageOmission = stat.hitCount ? stat.totalOmission / stat.hitCount : rows.length;
      stat.currentOmission = omission - 1;
    });
  });

  return { nums, groups, matrixRows, stats };
}

function buildRangeLabels(min, max, count) {
  const step = Math.max(1, Math.ceil((max - min + 1) / count));
  const labels = [];
  for (let start = min; start <= max; start += step) {
    const end = Math.min(max, start + step - 1);
    labels.push(start === end ? String(start) : `${start}-${end}`);
  }
  return labels;
}

function rangeLabel(value, min, max, count) {
  const labels = buildRangeLabels(min, max, count);
  const step = Math.max(1, Math.ceil((max - min + 1) / count));
  return labels[Math.min(labels.length - 1, Math.floor((value - min) / step))];
}

function derivedDefinitions(currentSeries) {
  const middle = Math.floor((currentSeries.min + currentSeries.max) / 2);
  return {
    oddEven: {
      label: "Odd/Even Distribution",
      columns: ["All Even", "Even Lean", "Balanced", "Odd Lean", "All Odd"],
      value: (row) => {
        const odd = row.numbers.filter((num) => num % 2 === 1).length;
        if (odd === 0) return "All Even";
        if (odd < row.numbers.length / 2) return "Even Lean";
        if (odd === row.numbers.length / 2) return "Balanced";
        if (odd === row.numbers.length) return "All Odd";
        return "Odd Lean";
      },
      summary: (row) => `${row.numbers.filter((num) => num % 2 === 1).length} odd / ${row.numbers.filter((num) => num % 2 === 0).length} even`
    },
    bigSmall: {
      label: `Big/Small Split (cutoff ${middle})`,
      columns: ["All Small", "Small Lean", "Balanced", "Big Lean", "All Big"],
      value: (row) => {
        const big = row.numbers.filter((num) => num > middle).length;
        if (big === 0) return "All Small";
        if (big < row.numbers.length / 2) return "Small Lean";
        if (big === row.numbers.length / 2) return "Balanced";
        if (big === row.numbers.length) return "All Big";
        return "Big Lean";
      },
      summary: (row) => `${row.numbers.filter((num) => num > middle).length} big / ${row.numbers.filter((num) => num <= middle).length} small`
    },
    sum: {
      label: "Sum Trend",
      columns: buildRangeLabels(currentSeries.count * currentSeries.min, currentSeries.count * currentSeries.max, 10),
      value: (row) => rangeLabel(row.numbers.reduce((sum, num) => sum + num, 0), currentSeries.count * currentSeries.min, currentSeries.count * currentSeries.max, 10),
      summary: (row) => `Sum ${row.numbers.reduce((sum, num) => sum + num, 0)}`
    },
    span: {
      label: "Span Trend",
      columns: buildRangeLabels(0, currentSeries.max - currentSeries.min, 8),
      value: (row) => rangeLabel(Math.max(...row.numbers) - Math.min(...row.numbers), 0, currentSeries.max - currentSeries.min, 8),
      summary: (row) => `Span ${Math.max(...row.numbers) - Math.min(...row.numbers)}`
    },
    tail: {
      label: "Tail Trend",
      columns: Array.from({ length: 10 }, (_, index) => String(index)),
      value: (row) => String(row.numbers.at(-1) % 10),
      summary: (row) => `Tail ${row.numbers.at(-1) % 10}`
    },
    zone: {
      label: "Zone Trend",
      columns: ["Zone 1", "Zone 2", "Zone 3", "Zone 4"],
      value: (row) => {
        const avg = row.numbers.reduce((sum, num) => sum + num, 0) / row.numbers.length;
        const step = (currentSeries.max - currentSeries.min + 1) / 4;
        return ["Zone 1", "Zone 2", "Zone 3", "Zone 4"][Math.min(3, Math.floor((avg - currentSeries.min) / step))];
      },
      summary: (row) => {
        const zones = [0, 0, 0, 0];
        const step = (currentSeries.max - currentSeries.min + 1) / 4;
        row.numbers.forEach((num) => zones[Math.min(3, Math.floor((num - currentSeries.min) / step))] += 1);
        return zones.join("-");
      }
    },
    hotCold: {
      label: "Hot/Cold Omission",
      columns: ["Hot", "Warm", "Cold"],
      value: (row, index, rows) => {
        const previous = rows.slice(Math.max(0, index - 10), index);
        const frequency = new Map();
        previous.flatMap((item) => item.numbers).forEach((num) => frequency.set(num, (frequency.get(num) || 0) + 1));
        const score = row.numbers.reduce((sum, num) => sum + (frequency.get(num) || 0), 0);
        if (score >= row.numbers.length) return "Hot";
        if (score > 0) return "Warm";
        return "Cold";
      },
      summary: (row) => `Numbers ${row.numbers.map((num) => pad(num, currentSeries)).join("-")}`
    }
  };
}

function renderSeriesNav() {
  document.querySelector("#gameNav").innerHTML = familyGroups().map((group) => {
    const firstCode = drawSeries.find((item) => item.family === group.family).code;
    return `
      <button class="game-button ${series().family === group.family ? "is-active" : ""}" data-series="${firstCode}">
        ${familyLogo(group.family)}
        <span>${group.label}</span>
      </button>
    `;
  }).join("");

  const siblings = siblingSeries();
  document.querySelector("#drawTimeSwitcher").innerHTML = siblings.length > 1
    ? siblings.map((item) => `<button class="time-button ${item.code === state.seriesCode ? "is-active" : ""}" data-series="${item.code}">${item.drawTime}</button>`).join("")
    : `<span>${series().drawTime}</span>`;
}

function renderHeader() {
  const currentSeries = series();
  const rows = rowsForSeries();
  const latest = rows.at(-1);
  const rangeRows = windowRows();
  document.querySelector("#crumbGame").textContent = currentSeries.name;
  document.querySelector("#chartHeading").textContent = `${currentSeries.name} ${trendViews[state.view]}`;
  document.querySelector("#latestPill").textContent = latest ? `Latest official ${formatDate(latest.drawDate)} / ${latest.drawTime}` : "Awaiting official publication";
  document.querySelector("#drawMeta").textContent = state.customFrom && state.customTo
    ? `${state.customFrom} to ${state.customTo}, ${rangeRows.length} draws`
    : `${rows.length} stored draws`;
  document.querySelector("#historyLabel").textContent = `${currentSeries.days} / ${currentSeries.drawTime}`;
  document.querySelector("#fromIssue").value = rangeRows[0]?.drawDate || "";
  document.querySelector("#toIssue").value = rangeRows.at(-1)?.drawDate || "";
}

function renderTrendTabs() {
  document.querySelectorAll(".trend-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.view);
  });
}

function renderMatrix() {
  if (state.view === "basic") renderBasicMatrix();
  else renderDerivedMatrix();
  renderMobileChart();
}

function renderBasicMatrix() {
  const currentSeries = series();
  const rows = windowRows();
  const matrix = buildMatrix(rows, currentSeries);
  const table = document.querySelector("#matrixTable");
  const groupHeader = matrix.groups.map((group) => `<th class="group-head" colspan="${matrix.nums.length}">${group.label}</th>`).join("");
  const numberHeader = matrix.groups.map(() => matrix.nums.map((num) => `<th class="num-head">${pad(num, currentSeries)}</th>`).join("")).join("");

  const bodyRows = matrix.matrixRows.map((row) => {
    const cells = matrix.groups.map((group, groupIndex) => row.cellsByGroup[group.key].map((cell) => {
      const value = cell.hit ? pad(cell.number, currentSeries) : (state.showOmission ? cell.omission : "");
      const classes = ["matrix-cell", cell.hit ? "hit" : "", cell.repeat && state.highlightRepeat ? "repeat" : "", `position-${groupIndex + 1}`].filter(Boolean).join(" ");
      return `<td class="${classes}" data-hit="${cell.hit}" data-group="${group.key}" data-number="${pad(cell.number, currentSeries)}">${value}</td>`;
    }).join("")).join("");

    return `
      <tr class="data-row">
        <td class="issue-cell">${row.drawDate}</td>
        <td class="date-cell">${row.drawTime}</td>
        <td class="draw-cell"><span class="draw-numbers">${row.numbers.map((num) => `<i class="draw-ball">${pad(num, currentSeries)}</i>`).join("")}</span></td>
        ${cells}
      </tr>
    `;
  }).join("");

  const summaryRows = [
    ["Hits", (stat) => stat.frequency],
    ["Average Omission", (stat) => Math.round(stat.averageOmission)],
    ["Max Omission", (stat) => stat.maxOmission],
    ["Current Omission", (stat) => stat.currentOmission]
  ].map(([label, getter]) => {
    const cells = matrix.groups.map((group) => matrix.nums.map((num) => `<td>${getter(matrix.stats.get(group.key).get(num))}</td>`).join("")).join("");
    return `<tr class="summary-row"><td class="issue-cell">${label}</td><td class="date-cell"></td><td class="draw-cell"></td>${cells}</tr>`;
  }).join("");

  table.innerHTML = `
    <thead>
      <tr>
        <th class="issue-cell" rowspan="2">Date</th>
        <th class="date-cell" rowspan="2">Session</th>
        <th class="draw-cell" rowspan="2">Draw Numbers</th>
        ${groupHeader}
      </tr>
      <tr>${numberHeader}</tr>
    </thead>
    <tbody>
      ${bodyRows}
      <tr><th class="summary-head issue-cell" colspan="3">Statistics</th>${matrix.groups.map((group) => `<th class="group-head" colspan="${matrix.nums.length}">${group.label}</th>`).join("")}</tr>
      ${summaryRows}
    </tbody>
  `;
  requestAnimationFrame(drawPositionLines);
}

function renderDerivedMatrix() {
  const currentSeries = series();
  const rows = windowRows();
  const definition = derivedDefinitions(currentSeries)[state.view];
  const columns = definition.columns;
  const omissions = new Map(columns.map((column) => [column, 0]));
  const hitCounts = new Map(columns.map((column) => [column, 0]));
  const maxOmissions = new Map(columns.map((column) => [column, 0]));

  const bodyRows = rows.map((row, index) => {
    const hitValue = definition.value(row, index, rows);
    const cells = columns.map((column) => {
      const hit = column === hitValue;
      const omission = omissions.get(column);
      if (hit) {
        hitCounts.set(column, hitCounts.get(column) + 1);
        maxOmissions.set(column, Math.max(maxOmissions.get(column), omission));
        omissions.set(column, 1);
      } else {
        omissions.set(column, omission + 1);
      }
      return `<td class="matrix-cell derived-cell ${hit ? "hit derived-hit" : ""}" data-hit="${hit}" data-group="derived" data-number="${column}">${hit ? column : (state.showOmission ? omission : "")}</td>`;
    }).join("");

    return `
      <tr class="data-row">
        <td class="issue-cell">${row.drawDate}</td>
        <td class="date-cell">${row.drawTime}</td>
        <td class="draw-cell"><span class="draw-numbers">${row.numbers.map((num) => `<i class="draw-ball">${pad(num, currentSeries)}</i>`).join("")}</span></td>
        <td class="derived-summary">${definition.summary(row)}</td>
        ${cells}
      </tr>
    `;
  }).join("");

  const summaryRows = [
    ["Hits", hitCounts],
    ["Max Omission", maxOmissions],
    ["Current Omission", new Map(columns.map((column) => [column, omissions.get(column) - 1]))]
  ].map(([label, map]) => `
    <tr class="summary-row">
      <td class="issue-cell">${label}</td>
      <td class="date-cell"></td>
      <td class="draw-cell"></td>
      <td class="derived-summary"></td>
      ${columns.map((column) => `<td class="derived-cell">${map.get(column)}</td>`).join("")}
    </tr>
  `).join("");

  document.querySelector("#matrixTable").innerHTML = `
    <thead>
      <tr>
        <th class="issue-cell">Date</th>
        <th class="date-cell">Session</th>
        <th class="draw-cell">Draw Numbers</th>
        <th class="derived-summary">${definition.label}</th>
        ${columns.map((column) => `<th class="num-head derived-head">${column}</th>`).join("")}
      </tr>
    </thead>
    <tbody>${bodyRows}${summaryRows}</tbody>
  `;
  requestAnimationFrame(drawPositionLines);
}

function drawPositionLines() {
  const svg = document.querySelector("#positionLines");
  const stage = document.querySelector("#trendStage");
  const rows = Array.from(document.querySelectorAll(".matrix-table .data-row"));
  svg.innerHTML = "";
  svg.setAttribute("width", stage.scrollWidth);
  svg.setAttribute("height", stage.scrollHeight);
  svg.setAttribute("viewBox", `0 0 ${stage.scrollWidth} ${stage.scrollHeight}`);
  if (!state.showLines) return;

  const stageRect = stage.getBoundingClientRect();
  const groups = state.view === "basic" ? trendGroups(series()).map((group) => group.key) : ["derived"];
  groups.forEach((groupKey, index) => {
    const points = [];
    rows.forEach((row) => {
      const hits = Array.from(row.querySelectorAll(`.matrix-cell.hit[data-group="${groupKey}"]`));
      if (hits.length === 0) return;
      const cell = hits[0];
      const rect = cell.getBoundingClientRect();
      points.push(`${rect.left - stageRect.left + rect.width / 2 + stage.scrollLeft},${rect.top - stageRect.top + rect.height / 2 + stage.scrollTop}`);
    });
    if (points.length < 2) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points.join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", index % 2 === 0 ? "rgba(215, 138, 29, 0.78)" : "rgba(18, 129, 111, 0.62)");
    line.setAttribute("stroke-width", "1.8");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    svg.appendChild(line);
  });
}

function renderMobileChart() {
  const currentSeries = series();
  const rows = windowRows().slice().reverse();
  const definition = state.view === "basic" ? null : derivedDefinitions(currentSeries)[state.view];
  document.querySelector("#mobileChartList").innerHTML = rows.map((row, reverseIndex) => {
    const originalIndex = rows.length - reverseIndex - 1;
    const summary = definition ? definition.summary(row) : `${trendGroups(currentSeries).map((group) => group.label).join(" / ")}: ${row.numbers.map((num) => pad(num, currentSeries)).join("-")}`;
    const hitLabel = definition ? definition.value(row, originalIndex, windowRows()) : "";
    return `
      <article class="mobile-chart-card">
        <header><strong>${formatDate(row.drawDate)}</strong><span>${row.drawTime}</span></header>
        <div class="history-numbers">${row.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")}</div>
        <p>${summary}</p>
        ${hitLabel ? `<em>${trendViews[state.view]}: ${hitLabel}</em>` : ""}
      </article>
    `;
  }).join("");
}

function mobileTrendColumns(currentSeries) {
  const nums = numbersForSeries(currentSeries);
  return trendGroups(currentSeries).flatMap((group) => nums.map((num) => ({
    id: `${group.key}-${num}`,
    group,
    number: num,
    label: group.type === "position" ? `P${group.position + 1}-${pad(num, currentSeries)}` : pad(num, currentSeries)
  })));
}

function renderMobileBasicTrendBoard(currentSeries, rows) {
  const { matrixRows } = buildMatrix(rows, currentSeries);
  const columns = mobileTrendColumns(currentSeries);
  const header = columns.map((column) => `<span>${column.label}</span>`).join("");
  const body = matrixRows.map((row) => {
    const left = `
      <div class="mobile-board-left-row">
        <strong>${formatDate(row.drawDate)}</strong>
        <small>${row.drawTime}</small>
        <span>${row.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")}</span>
      </div>
    `;
    const cells = columns.map((column) => {
      const cell = row.cellsByGroup[column.group.key].find((item) => item.number === column.number);
      return `<span class="${cell.hit ? "is-hit" : ""} ${cell.repeat ? "is-repeat" : ""}">${cell.hit ? pad(cell.number, currentSeries) : cell.omission}</span>`;
    }).join("");
    return `${left}<div class="mobile-board-number-row">${cells}</div>`;
  }).join("");

  return `
    <div class="mobile-board-left-head">Draw</div>
    <div class="mobile-board-number-head">${header}</div>
    ${body}
  `;
}

function renderMobileDerivedTrendBoard(currentSeries, rows) {
  const definition = derivedDefinitions(currentSeries)[state.view];
  return rows.slice().reverse().map((row, index) => {
    const originalIndex = rows.length - index - 1;
    const value = definition.value(row, originalIndex, rows);
    return `
      <article class="mobile-derived-row">
        <div>
          <strong>${formatDate(row.drawDate)}</strong>
          <small>${row.drawTime}</small>
        </div>
        <span>${row.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")}</span>
        <em>${value}</em>
      </article>
    `;
  }).join("");
}

function renderMobileTrendApp() {
  const currentSeries = series();
  const rows = windowRows();
  const latest = rowsForSeries().at(-1);
  const mobileName = document.querySelector("#mobileGameName");
  if (!mobileName) return;

  mobileName.textContent = currentSeries.name;
  document.querySelector("#mobileGameMeta").textContent = `${currentSeries.days} / ${currentSeries.drawTime}`;
  document.querySelector("#mobileLatestBalls").innerHTML = latest
    ? latest.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")
    : `<small>Awaiting official result</small>`;

  const siblings = siblingSeries();
  document.querySelector("#mobileSessionStrip").innerHTML = siblings.length > 1
    ? siblings.map((item) => `<button data-mobile-series="${item.code}" class="${item.code === state.seriesCode ? "is-active" : ""}">${item.drawTime}</button>`).join("")
    : `<span>${currentSeries.drawTime}</span>`;

  document.querySelector("#mobileModeStrip").innerHTML = Object.entries(trendViews).map(([key, label]) => (
    `<button data-mobile-view="${key}" class="${state.view === key ? "is-active" : ""}">${label.replace(" Trend", "")}</button>`
  )).join("");

  document.querySelectorAll("[data-mobile-window]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.mobileWindow) === state.windowSize);
  });

  document.querySelector("#mobileTrendTitle").textContent = trendViews[state.view];
  document.querySelector("#mobileTrendMeta").textContent = `${rows.length} official rows`;
  document.querySelector("#mobileTrendBoard").className = state.view === "basic" ? "mobile-trend-canvas is-matrix" : "mobile-trend-canvas is-derived";
  document.querySelector("#mobileTrendBoard").innerHTML = state.view === "basic"
    ? renderMobileBasicTrendBoard(currentSeries, rows)
    : renderMobileDerivedTrendBoard(currentSeries, rows);

  const stats = basicStats();
  const hot = stats.slice().sort((a, b) => b.frequency - a.frequency).slice(0, 3);
  const overdue = stats.slice().sort((a, b) => b.omission - a.omission).slice(0, 3);
  document.querySelector("#mobileStatStrip").innerHTML = `
    <span><strong>Hot</strong>${hot.map((item) => `<i>${pad(item.number, currentSeries)}</i>`).join("")}</span>
    <span><strong>Overdue</strong>${overdue.map((item) => `<i>${pad(item.number, currentSeries)}</i>`).join("")}</span>
    <span><strong>Records</strong><em>${rowsForSeries().length}</em></span>
  `;
}

function latestOfficialRows() {
  return drawSeries.map((item) => rowsForSeries(item.code).at(-1)).filter(Boolean);
}

function latestOfficialDate() {
  return latestOfficialRows().reduce((latest, row) => row.drawDate > latest ? row.drawDate : latest, "");
}

function routeFromHash() {
  const key = (window.location.hash || "#home").replace("#", "");
  if (routeKeys.has(key)) return key;
  return anchorRouteMap[key] || "home";
}

function setRoute(route, options = {}) {
  const nextRoute = routeKeys.has(route) ? route : "home";
  const { push = true, scroll = true } = options;
  document.body.dataset.route = nextRoute;
  renderMobileChrome(nextRoute);
  document.querySelectorAll(".page-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.page === nextRoute);
  });
  document.querySelectorAll("[data-route]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.route === nextRoute);
  });
  if (push && window.location.hash !== `#${nextRoute}`) {
    history.pushState(null, "", `#${nextRoute}`);
  }
  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  requestAnimationFrame(drawPositionLines);
  trackRouteView(nextRoute);
}

function renderMobileChrome(route) {
  const meta = routeMeta[route] || routeMeta.home;
  const title = document.querySelector("#mobileHeaderTitle");
  const action = document.querySelector("#mobileHeaderAction");
  if (title) title.textContent = meta.title;
  if (action) {
    action.textContent = meta.action;
    action.dataset.route = meta.actionRoute;
  }
}

function syncRouteFromHash() {
  const rawKey = (window.location.hash || "#home").replace("#", "");
  const route = routeFromHash();
  setRoute(route, { push: false, scroll: routeKeys.has(rawKey) });
  if (rawKey && !routeKeys.has(rawKey)) {
    requestAnimationFrame(() => document.getElementById(rawKey)?.scrollIntoView({ block: "start" }));
  }
}

function renderPortal() {
  const latestDate = latestOfficialDate();
  const latestOfficial = latestOfficialRows().filter((row) => row.drawDate === latestDate);
  document.querySelector("#topToday").textContent = `Today: ${formatDate(currentDate)}`;
  document.querySelector("#mobileToday").textContent = formatDate(currentDate);
  document.querySelector("#siteStatus").innerHTML = `
    <strong>Latest official stored:</strong>${latestDate ? formatDate(latestDate) : "Awaiting sync"}
    <span>${formatDate(currentDate)} unpublished results are not displayed.</span>
  `;
  document.querySelector("#trustRail").innerHTML = `
    <span><b>${drawSeries.length}</b> PCSO game sessions</span>
    <span><b>${drawResults.length}</b> draw records</span>
    <span><b>${formatSyncTime(syncedUpdatedAt)}</b> latest sync</span>
  `;
  const homeKpis = document.querySelector("#homeKpis");
  if (homeKpis) {
    const officialCount = drawResults.filter((row) => row.status === "official").length;
    const jackpotGames = latestOfficialRows().filter((row) => {
      const item = drawSeries.find((entry) => entry.code === row.seriesCode);
      return item?.prizeLabel === "Jackpot";
    }).length;
    homeKpis.innerHTML = [
      { label: "Latest official date", value: latestDate ? formatDate(latestDate) : "Awaiting sync", note: "No unpublished result is guessed" },
      { label: "Game sessions", value: drawSeries.length, note: "2D to Ultra Lotto 6/58" },
      { label: "Stored records", value: drawResults.length, note: `${officialCount} official synced rows` },
      { label: "Jackpot boards", value: jackpotGames, note: "Latest official jackpot games" }
    ].map((item) => `
      <article class="home-kpi">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
        <small>${item.note}</small>
      </article>
    `).join("");
  }
  document.querySelector("#todayCards").innerHTML = [
    { time: "2PM", games: "2D / 3D", status: "Awaiting PCSO publication" },
    { time: "5PM", games: "2D / 3D", status: "Awaiting PCSO publication" },
    { time: "9PM", games: "2D / 3D / Major lotto", status: "Evening draw window" }
  ].map((item) => `
    <article class="today-card">
      <strong>${item.time}</strong>
      <span>${item.games}</span>
      <em>${item.status}</em>
    </article>
  `).join("");
  document.querySelector("#officialResults").innerHTML = latestOfficial.map((row) => {
    const item = drawSeries.find((entry) => entry.code === row.seriesCode);
    return `
      <article class="official-row" data-series="${item.code}">
        <div class="official-row-head">
          ${familyLogo(item.family, true)}
          <strong>${item.name}</strong>
        </div>
        <span>${row.numbers.map((num) => `<i class="mini-ball">${pad(num, item)}</i>`).join("")}</span>
        <small>${formatDate(row.drawDate)} / ${row.drawTime}</small>
      </article>
    `;
  }).join("");

  const mobileLatest = document.querySelector("#mobileHomeLatest");
  const priority = ["2D-2PM", "2D-5PM", "2D-9PM", "3D-2PM", "3D-5PM", "3D-9PM", "4D", "6D", "6-42", "6-45", "6-49", "6-55", "6-58"];
  const orderedLatest = latestOfficial.slice().sort((a, b) => priority.indexOf(a.seriesCode) - priority.indexOf(b.seriesCode));
  if (mobileLatest) {
    mobileLatest.innerHTML = orderedLatest.slice(0, 6).map((row) => {
      const item = drawSeries.find((entry) => entry.code === row.seriesCode);
      return `
        <button class="mobile-result-card" data-series="${item.code}" data-route="lottery">
          <div>
            ${familyLogo(item.family, true)}
            <span>${item.name}</span>
          </div>
          <strong>${row.numbers.map((num) => pad(num, item)).join("-")}</strong>
          <small>${formatDate(row.drawDate)} / ${row.drawTime}</small>
        </button>
      `;
    }).join("");
  }
  const homeLatestBoard = document.querySelector("#homeLatestBoard");
  if (homeLatestBoard) {
    homeLatestBoard.innerHTML = orderedLatest.slice(0, 8).map((row) => {
      const item = drawSeries.find((entry) => entry.code === row.seriesCode);
      return `
        <button class="home-result-card" data-series="${item.code}" data-route="lottery">
          <div class="home-result-head">
            ${familyLogo(item.family, true)}
            <span><strong>${item.name}</strong><small>${formatDate(row.drawDate)} / ${row.drawTime}</small></span>
          </div>
          <div class="home-result-numbers">${row.numbers.map((num) => `<i class="mini-ball">${pad(num, item)}</i>`).join("")}</div>
          <em>${item.prizeLabel}: ${peso.format(row.jackpot)}</em>
        </button>
      `;
    }).join("");
  }
}

function renderOperatingBlocks() {
  const popular = [
    ["2D-2PM", "2D 2PM Basic Trend"],
    ["2D-5PM", "2D 5PM Hot/Cold Omission"],
    ["3D-9PM", "3D 9PM Odd/Even Trend"],
    ["6-42", "6/42 Number Trend"],
    ["6-49", "6/49 Sum Trend"],
    ["6-58", "6/58 Jackpot Watch"]
  ];
  document.querySelector("#popularCharts").innerHTML = popular.map(([code, label]) => `<button data-series="${code}" class="link-card">${label}</button>`).join("");

  const jackpotRows = latestOfficialRows()
    .map((row) => ({ row, item: drawSeries.find((entry) => entry.code === row.seriesCode) }))
    .filter(({ item }) => item.prizeLabel === "Jackpot")
    .sort((a, b) => b.row.jackpot - a.row.jackpot)
    .slice(0, 5);

  document.querySelector("#jackpotWatch").innerHTML = jackpotRows.map(({ row, item }) => `
    <div class="jackpot-row">
      <strong>${item.name}</strong>
      <span>${peso.format(row.jackpot)}</span>
      <small>${formatDate(row.drawDate)}</small>
    </div>
  `).join("");
}

function renderLatestResult() {
  const currentSeries = series();
  const latest = rowsForSeries().at(-1);
  document.querySelector("#latestResult").innerHTML = latest ? `
    <div class="latest-line"><strong>${currentSeries.name}</strong><span>${formatDate(latest.drawDate)}</span><span>${latest.drawTime}</span></div>
    <div class="latest-line">${latest.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")}</div>
    <div>${currentSeries.prizeLabel === "Jackpot" ? "Jackpot" : "Prize"}: <strong>${peso.format(latest.jackpot)}</strong></div>
    <div>Winners: <strong>${latest.winners ?? "-"}</strong></div>
    <div>Source: <strong>${latest.sourceLabel}</strong></div>
  ` : `<p class="text-block">Awaiting PCSO official publication.</p>`;
}

function basicStats() {
  const currentSeries = series();
  const rows = windowRows();
  return numbersForSeries(currentSeries).map((num) => {
    let frequency = 0;
    let omission = rows.length;
    rows.forEach((row, index) => {
      if (row.numbers.includes(num)) {
        frequency += 1;
        omission = rows.length - index - 1;
      }
    });
    return { number: num, frequency, omission };
  });
}

function statChip(number, label, currentSeries) {
  return `<span class="stat-chip"><strong>${pad(number, currentSeries)}</strong><span>${label}</span></span>`;
}

function renderSideStats() {
  const currentSeries = series();
  const stats = basicStats();
  const hot = stats.slice().sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  const cold = stats.slice().sort((a, b) => a.frequency - b.frequency).slice(0, 5);
  const overdue = stats.slice().sort((a, b) => b.omission - a.omission).slice(0, 10);
  document.querySelector("#hotColdPanel").innerHTML = `
    <h3>Hot Numbers</h3>
    <div class="stat-list">${hot.map((item) => statChip(item.number, `${item.frequency} hits`, currentSeries)).join("")}</div>
    <h3 style="margin-top:12px">Cold Numbers</h3>
    <div class="stat-list">${cold.map((item) => statChip(item.number, `${item.frequency} hits`, currentSeries)).join("")}</div>
  `;
  document.querySelector("#overduePanel").innerHTML = `<div class="stat-list">${overdue.map((item) => statChip(item.number, `${item.omission} draws`, currentSeries)).join("")}</div>`;
}

function renderHistory() {
  const currentSeries = series();
  const rows = rowsForSeries().slice().reverse();
  document.querySelector("#historyTable").innerHTML = `
    <thead><tr><th>Date</th><th>Session</th><th>Draw Numbers</th><th>${currentSeries.prizeLabel === "Jackpot" ? "Jackpot" : "Prize"}</th><th>Winners</th><th>Source</th></tr></thead>
    <tbody>
      ${rows.map((row) => `
        <tr>
          <td>${formatDate(row.drawDate)}</td>
          <td>${row.drawTime}</td>
          <td><span class="history-numbers">${row.numbers.map((num) => `<i class="mini-ball">${pad(num, currentSeries)}</i>`).join("")}</span></td>
          <td>${peso.format(row.jackpot)}</td>
          <td>${row.winners ?? "-"}</td>
          <td>${row.sourceLabel}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
}

function renderVideos() {
  document.querySelector("#videoList").innerHTML = videoItems.map((video) => `
    <article class="video-card">
      <div class="video-thumb">PCSO VIDEO</div>
      <div>
        <h3>${video.title}</h3>
        <p>${video.label}</p>
        <p>${video.summary}</p>
        <a href="${video.url}" target="_blank" rel="noreferrer">Open official source</a>
      </div>
    </article>
  `).join("");
}

function renderSportsScores() {
  Object.entries(sportsScoreSections).forEach(([targetId, items]) => {
    const target = document.querySelector(`#${targetId}`);
    if (!target) return;
    target.innerHTML = items.map((item) => `
        <article class="score-row source-card ${item.url ? "is-source-live" : "is-pending"}">
          <header>
            <strong>${item.league}</strong>
            <span>${item.status}</span>
          </header>
          <div class="match-line">
            <span>${item.title}</span>
            <b>${item.status}</b>
          </div>
          <footer>
            <span>${item.summary}</span>
            ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">Open source</a>` : `<em>Awaiting authorized provider</em>`}
          </footer>
        </article>
      `).join("");
  });
}

function renderAll() {
  renderSeriesNav();
  renderPortal();
  renderHeader();
  renderTrendTabs();
  renderMatrix();
  renderMobileTrendApp();
  renderLatestResult();
  renderSideStats();
  renderHistory();
  renderVideos();
  renderSportsScores();
  renderOperatingBlocks();
}

function selectSeries(code, options = {}) {
  state.seriesCode = code;
  state.customFrom = null;
  state.customTo = null;
  const selected = drawSeries.find((item) => item.code === code);
  trackEvent("lotto_series_select", {
    series_code: code,
    series_name: selected?.name || code,
    family: selected?.family || ""
  });
  renderAll();
  if (options.openLottery !== false) {
    setRoute("lottery", { push: true, scroll: false });
  }
  if (options.scrollToChart) {
    requestAnimationFrame(() => document.querySelector("#chartHeading")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((item) => {
    item.addEventListener("click", (event) => {
      const route = item.dataset.route;
      if (!routeKeys.has(route)) return;
      event.preventDefault();
      if (item.dataset.series) {
        selectSeries(item.dataset.series, { scrollToChart: true });
        return;
      }
      setRoute(route);
    });
  });
  document.querySelector(".site-search")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = event.currentTarget.querySelector("input")?.value.trim() || "";
    trackEvent("site_search", { search_term: query });
    setRoute("lottery");
  });
  document.querySelectorAll("[data-scroll-target]").forEach((item) => {
    item.addEventListener("click", () => {
      const target = document.getElementById(item.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelector("#gameNav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-series]");
    if (button) selectSeries(button.dataset.series, { scrollToChart: true });
  });
  document.querySelector("#drawTimeSwitcher").addEventListener("click", (event) => {
    const button = event.target.closest("[data-series]");
    if (button) selectSeries(button.dataset.series, { openLottery: false });
  });
  document.querySelector("#officialResults").addEventListener("click", (event) => {
    const card = event.target.closest("[data-series]");
    if (!card) return;
    selectSeries(card.dataset.series, { scrollToChart: true });
  });
  document.querySelector("#mobileHomeLatest")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-series]");
    if (!card) return;
    selectSeries(card.dataset.series, { scrollToChart: true });
  });
  document.querySelector("#homeLatestBoard")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-series]");
    if (!card) return;
    selectSeries(card.dataset.series, { scrollToChart: true });
  });
  document.querySelector("#popularCharts").addEventListener("click", (event) => {
    const button = event.target.closest("[data-series]");
    if (!button) return;
    selectSeries(button.dataset.series, { scrollToChart: true });
  });
  document.querySelector("#mobileSessionStrip")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mobile-series]");
    if (!button) return;
    selectSeries(button.dataset.mobileSeries, { openLottery: false });
  });
  document.querySelector("#mobileModeStrip")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mobile-view]");
    if (!button) return;
    state.view = button.dataset.mobileView;
    trackEvent("trend_view_change", {
      source: "mobile",
      trend_view: state.view,
      series_code: state.seriesCode
    });
    renderAll();
  });
  document.querySelectorAll("[data-mobile-window]").forEach((button) => {
    button.addEventListener("click", () => {
      state.windowSize = Number(button.dataset.mobileWindow);
      state.customFrom = null;
      state.customTo = null;
      trackEvent("trend_window_change", {
        source: "mobile",
        window_size: state.windowSize,
        series_code: state.seriesCode
      });
      renderAll();
    });
  });
  document.querySelectorAll(".range-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".range-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.windowSize = Number(button.dataset.window);
      state.customFrom = null;
      state.customTo = null;
      trackEvent("trend_window_change", {
        source: "desktop",
        window_size: state.windowSize,
        series_code: state.seriesCode
      });
      renderAll();
    });
  });
  document.querySelector("#queryButton").addEventListener("click", () => {
    const from = document.querySelector("#fromIssue").value.trim();
    const to = document.querySelector("#toIssue").value.trim();
    const matched = rowsForSeries().filter((row) => row.drawDate >= from && row.drawDate <= to);
    if (matched.length > 0) {
      state.customFrom = from;
      state.customTo = to;
      document.querySelectorAll(".range-button").forEach((item) => item.classList.remove("is-active"));
      trackEvent("trend_custom_range_query", {
        series_code: state.seriesCode,
        from_date: from,
        to_date: to
      });
      renderAll();
    }
  });
  document.querySelectorAll(".trend-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      trackEvent("trend_view_change", {
        source: "desktop",
        trend_view: state.view,
        series_code: state.seriesCode
      });
      renderHeader();
      renderTrendTabs();
      renderMatrix();
    });
  });
  document.querySelector("#showOmission").addEventListener("change", (event) => {
    state.showOmission = event.target.checked;
    trackEvent("chart_option_toggle", { option: "omission", enabled: state.showOmission });
    renderMatrix();
  });
  document.querySelector("#showLines").addEventListener("change", (event) => {
    state.showLines = event.target.checked;
    trackEvent("chart_option_toggle", { option: "lines", enabled: state.showLines });
    drawPositionLines();
  });
  document.querySelector("#highlightRepeat").addEventListener("change", (event) => {
    state.highlightRepeat = event.target.checked;
    trackEvent("chart_option_toggle", { option: "repeat", enabled: state.highlightRepeat });
    renderMatrix();
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.hostname === window.location.hostname) return;
    trackEvent("outbound_link_click", {
      link_url: url.href,
      link_text: link.textContent.trim().slice(0, 80)
    });
  });
  document.querySelector("#chartScroll").addEventListener("scroll", drawPositionLines);
  window.addEventListener("resize", drawPositionLines);
}

bindEvents();
renderAll();
syncRouteFromHash();
window.addEventListener("hashchange", syncRouteFromHash);

loadSyncedResults().then(() => {
  renderAll();
  syncRouteFromHash();
});
