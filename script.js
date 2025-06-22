const sheets = [
  {
    name: "Go K-Haas Championship Rankings",
    id: "section-0"
  },
  {
    name: "2025 Races",
    id: "section-1"
  }
];

const nav = document.getElementById("sidebar-nav");

sheets.forEach(({ name, id }) => {
  const button = document.createElement("button");
  button.textContent = name;
  button.onclick = () => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };
  nav.appendChild(button);
});
