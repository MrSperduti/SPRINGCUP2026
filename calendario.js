document.addEventListener("DOMContentLoaded", async () => {

  const categoria = new URLSearchParams(window.location.search).get('categoria');
  const container = document.getElementById("calendarioContainer");

  const res = await fetch('data/dati.json');
  const data = await res.json();

  const key = Object.keys(data).find(
    k => k.trim().toUpperCase() === categoria.trim().toUpperCase()
  );

  const partite = key ? data[key].partite : [];

  if (!partite.length) {
    container.innerHTML = "<p>Nessuna partita disponibile</p>";
    return;
  }

  let html = "";

  partite.forEach(p => {
  html += `
    <tr>
      <td>${p.squadraA}</td>
      <td>
        <a href="partita.html?categoria=${categoria}&id=${p.id}">
          ${p.golA} - ${p.golB}
        </a>
      </td>
      <td>${p.squadraB}</td>
    </tr>
  `;
});
