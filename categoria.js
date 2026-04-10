async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get('categoria');

  // Verifica che la categoria sia corretta
  if (!categoria) {
    document.getElementById('titoloCategoria').textContent = 'Categoria non valida';
    return;
  }

  const titolo = document.getElementById('titoloCategoria');
  const menu = document.getElementById('menuCategoria');
  
  titolo.textContent = categoria;

  let html = `
    <a class="btn" href="calendario.html?categoria=${encodeURIComponent(categoria)}">📅 Calendario</a>
    <a class="btn" href="classifica.html?categoria=${encodeURIComponent(categoria)}">🏆 Classifica</a>
    <a class="btn" href="gironi.html?categoria=${encodeURIComponent(categoria)}">📊 Gironi</a>
    <a class="btn" href="rose.html?categoria=${encodeURIComponent(categoria)}">👥 Rose</a>
    <a class="btn" href="classifica-marcatori.html?categoria=${encodeURIComponent(categoria)}">⚽ Marcatori</a>
    <a class="btn" href="miglior-giocatore.html?categoria=${encodeURIComponent(categoria)}">⭐ Miglior Giocatore</a>
    <a class="btn" href="miglior-portiere.html?categoria=${encodeURIComponent(categoria)}">🧤 Miglior Portiere</a>
  `;

  menu.innerHTML = html;
}

loadCategoria();
