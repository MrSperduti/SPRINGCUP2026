async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get('categoria');

  const titolo = document.getElementById('titoloCategoria');
  const menu = document.getElementById('menuCategoria');

  titolo.textContent = categoria;

  let html = `
    <a class="btn" href="gironi.html?categoria=${categoria}">📊 Gironi</a>
    <a class="btn" href="calendario.html?categoria=${categoria}">📅 Calendario</a>
    <a class="btn" href="partite.html?categoria=${categoria}">⚽ Partite</a>
    <a class="btn" href="classifica.html?categoria=${categoria}">🏆 Classifica</a>
    <a class="btn" href="rose.html?categoria=${categoria}">👥 Rose</a>
  `;

  menu.innerHTML = html;
}

loadCategoria();
