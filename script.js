const sheets = [
  {
    name: "Sales",
    url: "https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pubhtml?gid=0&single=true&widget=true&headers=false"
  },
  {
    name: "Marketing",
    url: "https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pubhtml?gid=123456&single=true&widget=true&headers=false"
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
