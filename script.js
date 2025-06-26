const SHEET_ID = "1ysbEyCrDhlnleTdzWADT1Lr9ZEVP_ayKBMmaPNVKaeY";
const RAW_GID = "0";
const RANKING_GID = "157995054";

// Sidebar Navigation
const nav = document.getElementById("sidebar-nav");
const sections = [
  { id: "ranking", name: "🏁 Ranking" },
  { id: "races", name: "🗓️ Past Races" },
  { id: "points", name: "📋 Points System" },
];
sections.forEach(({ id, name }) => {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.onclick = () => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  nav.appendChild(btn);
});

// Load and Render
async function loadData() {
  const [raw, ranking] = await Promise.all([
    fetchCSV(RAW_GID),
    fetchCSV(RANKING_GID),
  ]);

  renderRankings(ranking);
  renderRaces(raw);
}
loadData();

function fetchCSV(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
  return fetch(url)
    .then(r => r.text())
    .then(parseCSV);
}

function parseCSV(csv) {
  const [headers, ...rows] = csv.trim().split("\n").map(r => r.split(","));
  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
    return obj;
  });
}

function renderRankings(data) {
  const container = document.getElementById("ranking");
  const list = document.createElement("div");
  list.className = "ranking-list";

  data.forEach((row, index) => {
    const name = row["Racer"] || row["Name"];
    const points = row["Points"] || row["Total Points"] || row["sum"] || row["sum Points"];
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="avatar">${initials}</div>
      <div class="info">
        <strong>#${index + 1} - ${name}</strong>
        <span>Class of 2026 • ${points || "0"} pts</span>
      </div>
    `;
    list.appendChild(card);
  });

  container.appendChild(list);
}

function renderRaces(data) {
  const container = document.getElementById("races");
  const grouped = {};

  data.forEach(row => {
    const key = `${row.Track}||${row.Round}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });

  Object.entries(grouped).forEach(([key, rows]) => {
    const [track, round] = key.split("||");
    const sorted = rows.sort((a, b) => parseInt(a.Position) - parseInt(b.Position));

    // Format date safely
    let dateStr = sorted[0].Date;
    if (!isNaN(Date.parse(dateStr))) {
      dateStr = new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric" });
    } else {
      dateStr = "Invalid Date";
    }

    // Get best time
    const bestTime = Math.min(...sorted.map(r => parseFloat(r["Best Time"] || r["BestTime"] || r["Best time"]))).toFixed(3);

    const block = document.createElement("div");
    block.className = "race-block";
    block.innerHTML = `
      <h3>${dateStr} – ${track} (Race ${round})</h3>
      <p>📍 ${sorted[0].Address}</p>
      <p>⏱️ Fastest Lap: ${bestTime}s</p>
      <ul>
        ${sorted.map(r => `<li>#${r.Position} – ${r.Racer} (${r.Points} pts)</li>`).join("")}
      </ul>
    `;
    container.appendChild(block);
  });
}
