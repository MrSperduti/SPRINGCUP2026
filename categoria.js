async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get('categoria');

  const titolo = document.getElementById('titoloCategoria');
  const menu = document.getElementById('menuCategoria');

  titolo.textContent = categoria;

  let html = `
    <a class="btn" href="calendario.html?categoria=${categoria}">📅 Calendario</a>
  <a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>
  <a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>
  <a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>
  <a class="btn" href="classifica-marcatori.html?categoria=${categoria}">⚽ Marcatori</a>
  <a class="btn" href="miglior-giocatore.html?categoria=${categoria}">⭐ Miglior Giocatore</a>
  <a class="btn" href="miglior-portiere.html?categoria=${categoria}">🧤 Miglior Portiere</a>
  `;

  menu.innerHTML = html;
}

loadCategoria();
