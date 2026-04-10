async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get('categoria');

  const titolo = document.getElementById('titoloCategoria');
  const menu = document.getElementById('menuCategoria');

  if (!categoria) {
    titolo.textContent = 'Categoria non valida';
    return;
  }

  titolo.textContent = categoria;

  try {
    const res = await fetch('data/dati.json?cache=' + Date.now());
    const data = await res.json();

    // 🔥 FIX IMPORTANTE QUI
    const key = Object.keys(data).find(
      k => k.trim().toUpperCase() === categoria.trim().toUpperCase()
    );

    const datiCategoria = data[key];

    if (!datiCategoria) {
      menu.innerHTML = '<p>Nessun dato per questa categoria</p>';
      return;
    }

    let html = '';

    html += `<a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>`;
    html += `<a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>`;
    html += `<a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>`;
    html += `<a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>`;

    menu.innerHTML = html;

  } catch (err) {
    menu.innerHTML = '<p>Errore nel caricamento dati</p>';
  }
}

loadCategoria();
