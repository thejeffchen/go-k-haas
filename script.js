const nav = document.getElementById("sidebar-nav");
const sections = [
  { name: "🏁 Ranking", id: "ranking" },
  { name: "📅 Past Races", id: "races" },
  { name: "📋 Points System", id: "scoring" },
];

sections.forEach(({ name, id }) => {
  const button = document.createElement("button");
  button.textContent = name;
  button.onclick = () => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };
  nav.appendChild(button);
});

const RANKINGS_URL = "https://docs.google.com/spreadsheets/d/1ysbEyCrDhlnleTdzWADT1Lr9ZEVP_ayKBMmaPNVKaeY/gviz/tq?tqx=out:json&gid=157995054";
const RACES_URL = "https://docs.google.com/spreadsheets/d/1ysbEyCrDhlnleTdzWADT1Lr9ZEVP_ayKBMmaPNVKaeY/gviz/tq?tqx=out:json&gid=0";

function fetchSheet(url) {
  return fetch(url)
    .then(res => res.text())
    .then(text => JSON.parse(text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s)[1]))
    .then(json => {
      return json.table.rows.map(row => {
        return json.table.cols.reduce((obj, col, i) => {
          obj[col.label] = row.c[i] ? row.c[i].v : "";
          return obj;
        }, {});
      });
    });
}

function renderRankings(data) {
  const container = document.getElementById("ranking-list");
  container.innerHTML = "";

  data.forEach(({ Racer, Points }, index) => {
    const card = document.createElement("div");
    card.className = "ranking-card";

    const img = document.createElement("img");
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(Racer)}&background=random`;

    const text = document.createElement("div");
    text.innerHTML = `<strong>#${index + 1} - ${Racer}</strong><span>Class of 2026 • ${Points} pts</span>`;

    card.appendChild(img);
    card.appendChild(text);
    container.appendChild(card);
  });
}

function renderRaces(data) {
  const grouped = {};
  data.forEach(r => {
    const key = `${r.Track}||${r.Round}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const container = document.getElementById("race-list");
  container.innerHTML = "";

  Object.entries(grouped).forEach(([key, racers]) => {
    const [track, round] = key.split("||");
    const sorted = racers.sort((a, b) => Number(a.Position) - Number(b.Position));
    const dateStr = new Date(sorted[0].Date).toLocaleDateString("en-US", { month: "long", day: "numeric" });

    const block = document.createElement("div");
    block.className = "race-block";
    block.innerHTML = `<h3>${dateStr} - ${track} (Race ${round})</h3><p>📍 ${sorted[0].Address}</p>`;

    const list = document.createElement("ul");
    sorted.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `#${r.Position} - ${r.Racer} (${r.Points} pts)`;
      list.appendChild(li);
    });
    block.appendChild(list);
    container.appendChild(block);
  });
}

Promise.all([fetchSheet(RANKINGS_URL), fetchSheet(RACES_URL)])
  .then(([rankingData, raceData]) => {
    renderRankings(rankingData);
    renderRaces(raceData);
  });
