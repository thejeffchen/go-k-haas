const sidebarNav = document.getElementById("sidebar-nav");
const rankingList = document.getElementById("ranking-list");
const raceList = document.getElementById("race-list");

const navItems = [
  { name: "🏁 Ranking", id: "ranking" },
  { name: "📄 Past Races", id: "races" },
  { name: "📋 Points System", id: "scoring" }
];

navItems.forEach(({ name, id }) => {
  const link = document.createElement("button");
  link.textContent = name;
  link.onclick = () => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  sidebarNav.appendChild(link);
});

// URLs to public JSON exports
const RANKING_URL = "https://opensheet.elk.sh/1ysbEyCrDhlnleTdzWADT1Lr9ZEVP_ayKBMmaPNVKaeY/Overall%20Ranking";
const RACES_URL = "https://opensheet.elk.sh/1ysbEyCrDhlnleTdzWADT1Lr9ZEVP_ayKBMmaPNVKaeY/Inputs";

function getInitials(name) {
  return name.split(" ").map(w => w[0]?.toUpperCase()).join("").slice(0, 2);
}

function generateColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
}

// === Render Ranking ===
fetch(RANKING_URL)
  .then(res => res.json())
  .then(data => {
    data.forEach((racer, idx) => {
      const card = document.createElement("div");
      card.className = "ranking-card";
      const initials = getInitials(racer["Racer"] || "");
      card.innerHTML = `
        <div class="avatar" style="background-color: ${generateColor(initials)}">${initials}</div>
        <div class="info">
          <strong>#${idx + 1} - ${racer["Racer"]}</strong>
          <p>Class of 2026 • ${racer["sum Points"] || 0} pts</p>
        </div>
      `;
      rankingList.appendChild(card);
    });
  });

// === Render Past Races ===
fetch(RACES_URL)
  .then(res => res.json())
  .then(rows => {
    const grouped = {};
    rows.forEach(row => {
      const round = row["Round"] || "Unknown";
      const track = row["Track"] || "Unknown";
      const key = `${round}||${track}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    Object.entries(grouped).forEach(([key, racers]) => {
      const [round, track] = key.split("||");
      const dateStr = racers[0]["Date"];
      const address = racers[0]["Address"];
      const date = new Date(dateStr);
      const readableDate = isNaN(date) ? "Unknown Date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const container = document.createElement("details");
      container.className = "race-dropdown";

      const summary = document.createElement("summary");
      summary.innerHTML = `<strong>${readableDate} – ${track} (Race ${round})</strong><br/><small>📍 ${address}</small>`;
      container.appendChild(summary);

      const table = document.createElement("table");
      table.className = "race-table";
      table.innerHTML = `
        <thead>
          <tr><th>Position</th><th>Racer</th><th>Points</th><th>Best Lap (s)</th></tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector("tbody");

      racers
        .sort((a, b) => Number(a.Position) - Number(b.Position))
        .forEach(r => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>#${r.Position}</td>
            <td>${r.Racer}</td>
            <td>${r.Points}</td>
            <td>${r["Best Time"]}s</td>
          `;
          tbody.appendChild(row);
        });

      container.appendChild(table);
      raceList.appendChild(container);
    });
  });
