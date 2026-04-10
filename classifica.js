document.addEventListener("DOMContentLoaded", async () => {

  const categoria = new URLSearchParams(window.location.search).get('categoria');
  const container = document.getElementById("classificaContainer");

  const res = await fetch('data/dati.json');
  const data = await res.json();

  const key = Object.keys(data).find(
    k => k.trim().toUpperCase() === categoria.trim().toUpperCase()
  );

  const classifica = key ? data[key].classifica : [];

  if (!classifica.length) {
    container.innerHTML = "<p>Nessuna classifica disponibile</p>";
    return;
  }

  let html = "<table><tr><th>Squadra</th><th>Punti</th></tr>";

  classifica.forEach(s => {
    html += `<tr><td>${s.squadra}</td><td>${s.punti}</td></tr>`;
  });

  html += "</table>";

  container.innerHTML = html;
});
