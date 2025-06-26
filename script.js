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

// Helpers
function getInitials(name) {
  return name.split(" ").map(w => w[0].toUpperCase()).join("").slice(0, 2);
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
    // Group by round + track
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
      const readableDate = isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const container = document.createElement("div");
      container.className = "race-card";
      container.innerHTML = `
        <strong>${readableDate} – ${track} (Race ${round})</strong>
        <p>📍 ${address}</p>
        <ul class="race-placements"></ul>
      `;

      const ul = container.querySelector(".race-placements");
      racers
        .sort((a, b) => Number(a.Position) - Number(b.Position))
        .forEach(r => {
          const li = document.createElement("li");
          li.textContent = `#${r.Position} – ${r.Racer} (${r.Points} pts, ${r["Best Time"]}s best lap)`;
          ul.appendChild(li);
        });

      raceList.appendChild(container);
    });
  });

// === Color generator from initials ===
function generateColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
}
