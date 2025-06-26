const nav = document.getElementById("sidebar-nav");
const sheets = [
  { name: "Go K-Haas Championship Rankings", id: "section-0" },
  { name: "2025 Races", id: "section-1" },
];

// Create nav buttons
sheets.forEach(({ name, id }) => {
  const button = document.createElement("button");
  button.textContent = name;
  button.onclick = () => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  nav.appendChild(button);
});

// Fetch race data
fetch("https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/gviz/tq?tqx=out:json&sheet=2025%20Races")
  .then((res) => res.text())
  .then((text) => {
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s)[1]);
    const rows = json.table.rows.map((r) => {
      return json.table.cols.reduce((obj, col, i) => {
        obj[col.label] = r.c[i] ? r.c[i].v : "";
        return obj;
      }, {});
    });
    renderRaces(rows);
  });

function renderRaces(rows) {
  const grouped = {};
  rows.forEach((r) => {
    const round = r.Round;
    if (!grouped[round]) grouped[round] = [];
    grouped[round].push(r);
  });

  const container = document.getElementById("race-list");
  container.innerHTML = "";

  Object.keys(grouped).sort().forEach((round) => {
    const racers = grouped[round].sort((a, b) => a.Position - b.Position);
    const dateStr = new Date(racers[0].Date).toLocaleDateString("en-US", { month: "long", day: "numeric" });

    const wrapper = document.createElement("div");
    wrapper.className = "race-block";

    const title = document.createElement("h3");
    title.textContent = `${dateStr} – ${racers[0].Track} (Race ${round})`;
    wrapper.appendChild(title);

    const address = document.createElement("p");
    address.textContent = `📍 ${racers[0].Address}`;
    wrapper.appendChild(address);

    const ul = document.createElement("ul");
    racers.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `#${r.Position} – ${r.Racer} (${r.Points} pts)`;
      ul.appendChild(li);
    });
    wrapper.appendChild(ul);

    container.appendChild(wrapper);
  });
}
