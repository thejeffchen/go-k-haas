const sheets = [
  {
    name: "Go K-Haas Championship Rankings",
    url: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=13107265#gid=13107265"
  },
  {
    name: "2025 Races",
    url: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=1722176340#gid=1722176340"
  }
];

const tabs = document.getElementById("sheet-tabs");
const frame = document.getElementById("sheet-frame");

function showSheet(index) {
  frame.src = sheets[index].url;
  document.querySelectorAll("nav button").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

sheets.forEach((sheet, i) => {
  const button = document.createElement("button");
  button.textContent = sheet.name;
  button.onclick = () => showSheet(i);
  tabs.appendChild(button);
});

showSheet(0);
