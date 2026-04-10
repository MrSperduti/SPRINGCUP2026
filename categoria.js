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

    // 🔥 FIX: compatibile con tutte le strutture
    const datiCategoria = data[categoria] || data.categorie?.[categoria];

    // I bottoni devono SEMPRE comparire
    let html = `
      <a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>
      <a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>
      <a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>
      <a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>
    `;

    // Se non ci sono dati → avviso sopra
    if (!datiCategoria) {
      html = `<p>Nessun dato per questa categoria</p>` + html;
    }

    menu.innerHTML = html;

  } catch (err) {
    menu.innerHTML = '<p>Errore nel caricamento dati</p>';
  }
}

loadCategoria();
