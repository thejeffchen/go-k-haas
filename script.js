const nav = document.getElementById("sidebar-nav");
const isMobile = window.innerWidth <= 768;

const sheets = [
  {
    name: "Go K-Haas Championship Rankings",
    id: "section-0",
    desktopUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQe9flGCmYKhK51q9zW7UTqcsR8EYpcUpCq3ykPEmTz2BkCk4dp6nAXrQAbDdzVPz-GHYHj3hIFy6v5/pubhtml?gid=13107265&single=true&widget=true&headers=false",
    mobileUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQe9flGCmYKhK51q9zW7UTqcsR8EYpcUpCq3ykPEmTz2BkCk4dp6nAXrQAbDdzVPz-GHYHj3hIFy6v5/pubchart?oid=1916474073&format=interactive"
  },
  {
    name: "2025 Races",
    id: "section-1",
    desktopUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQe9flGCmYKhK51q9zW7UTqcsR8EYpcUpCq3ykPEmTz2BkCk4dp6nAXrQAbDdzVPz-GHYHj3hIFy6v5/pubhtml?gid=1722176340&single=true&widget=true&headers=false",
    mobileUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQe9flGCmYKhK51q9zW7UTqcsR8EYpcUpCq3ykPEmTz2BkCk4dp6nAXrQAbDdzVPz-GHYHj3hIFy6v5/pubchart?oid=1409643188&format=interactive"
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
