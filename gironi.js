document.addEventListener("DOMContentLoaded", async () => {

  const categoria = new URLSearchParams(window.location.search).get('categoria');
  const container = document.getElementById("gironiContainer");

  const res = await fetch('data/dati.json');
  const data = await res.json();

  const key = Object.keys(data).find(
    k => k.trim().toUpperCase() === categoria.trim().toUpperCase()
  );

  const gironi = key ? data[key].gironi : {};

  if (!Object.keys(gironi).length) {
    container.innerHTML = "<p>Nessun girone disponibile</p>";
    return;
  }

  let html = "";

  for (let nome in gironi) {
    html += `<h3>${nome}</h3><ul>`;
    gironi[nome].forEach(s => html += `<li>${s}</li>`);
    html += "</ul>";
  }

  container.innerHTML = html;
});
