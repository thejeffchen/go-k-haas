const nav = document.getElementById("sidebar-nav");
const isMobile = window.innerWidth <= 768;

const sheets = [
  {
    name: "Go K-Haas Championship Rankings",
    id: "section-0",
    desktopUrl: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=13107265#gid=13107265",
    mobileUrl: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=13107265#gid=13107265"
  },
  {
    name: "2025 Races",
    id: "section-1",
    desktopUrl: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=1722176340#gid=1722176340",
    mobileUrl: "https://docs.google.com/spreadsheets/d/1usgOG9yH74E98bKitpW1Yc3P3x6j0iqYvaNsLfEeWs4/edit?gid=1722176340#gid=1722176340"
  }
];

// Create nav buttons
sheets.forEach(({ name, id }) => {
  const button = document.createElement("button");
  button.textContent = name;
  button.onclick = () => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };
  nav.appendChild(button);
});

// Inject only one iframe per section (mobile OR desktop)
window.addEventListener("DOMContentLoaded", () => {
  sheets.forEach(({ id, mobileUrl, desktopUrl }) => {
    const section = document.getElementById(id);
    const iframe = document.createElement("iframe");
    iframe.src = isMobile ? mobileUrl : desktopUrl;
    iframe.loading = "lazy";
    iframe.title = id;
    section.appendChild(iframe);
  });
});
