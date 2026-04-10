async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get('categoria');

  const container = document.getElementById('contenuto');

  if (!categoria) {
    container.innerHTML = '<p>Categoria non valida</p>';
    return;
  }

  document.getElementById('titolo').textContent = categoria;

  try {
    const res = await fetch('dati.json?cache=' + Date.now());
    const data = await res.json();

    const datiCategoria = data[categoria];

    if (!datiCategoria) {
      container.innerHTML = '<p>Nessun dato per questa categoria</p>';
      return;
    }

    // BOTTONI
    let html = '';

    if (datiCategoria.gironi) {
      html += `<a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>`;
    }

    if (datiCategoria.partite) {
      html += `<a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>`;
    }

    if (datiCategoria.classifica) {
      html += `<a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>`;
    }

    if (datiCategoria.rose) {
      html += `<a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>`;
    }

    if (!html) {
      html = '<p>Nessun contenuto disponibile</p>';
    }

    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = '<p>Errore nel caricamento dati</p>';
  }
}

loadCategoria();
