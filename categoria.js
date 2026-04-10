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

    const datiCategoria = data[categoria] || data.categorie?.[categoria];

    let html = `
      <a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>
      <a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>
      <a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>
      <a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>
    `;

    if (!datiCategoria) {
      html = `<p class="lead">Nessun dato per questa categoria</p>` + html;
    }

    menu.innerHTML = html;

  } catch (err) {
    menu.innerHTML = '<p class="lead">Errore nel caricamento dati</p>';
  }
}

loadCategoria();
