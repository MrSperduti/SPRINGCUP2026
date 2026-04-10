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

  // 🔥 BOTTONI SEMPRE VISIBILI
  let html = `
    <a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>
    <a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>
    <a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>
    <a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>
  `;

  menu.innerHTML = html;

  // 🔽 POI proviamo a caricare i dati (ma NON blocchiamo i bottoni)
  try {
    const res = await fetch('data/dati.json?cache=' + Date.now());
    const data = await res.json();

    const key = Object.keys(data).find(
      k => k.trim().toUpperCase() === categoria.trim().toUpperCase()
    );

    if (!key) {
      console.warn("Categoria non trovata nel JSON");
    }

  } catch (err) {
    console.warn("Errore caricamento JSON");
  }
}

loadCategoria();
