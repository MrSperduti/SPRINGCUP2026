document.addEventListener("DOMContentLoaded", async () => {

  const categoria = new URLSearchParams(window.location.search).get('categoria');
  const container = document.getElementById("partiteContainer");

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
    html += `<p>${p.squadraA} ${p.golA ?? '-'} - ${p.golB ?? '-'} ${p.squadraB}</p>`;
  });

  container.innerHTML = html;
});
