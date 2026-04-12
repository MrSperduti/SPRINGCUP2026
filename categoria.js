async function loadCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoriaLabel = params.get("categoria");

  if (!categoriaLabel) {
    document.getElementById("titoloCategoria").textContent = "Categoria non valida";
    return;
  }

  const titolo = document.getElementById("titoloCategoria");
  const menu = document.getElementById("menuCategoria");

  titolo.textContent = categoriaLabel;

  function getCategoriaKey(label) {
    const map = {
      "UNDER 21": "Under 21",
      "UNDER 19": "Under 19",
      "UNDER 17": "Under 17",
      "UNDER 15": "Under 15",
      "UNDER 13": "Under 13",
      "2019/20": "2019/20",
      "2017/18": "2017/18",
      "2015/16": "2015/16",
      "2014/15": "2014/15"
    };

    return map[label] || label;
  }

  const categoriaKey = getCategoriaKey(categoriaLabel);

  let html = `
    <a class="btn" href="calendario.html?categoria=${encodeURIComponent(categoriaKey)}">📅 Calendario</a>
    <a class="btn" href="classifica.html?categoria=${encodeURIComponent(categoriaKey)}">🏆 Classifica</a>
    <a class="btn" href="gironi.html?categoria=${encodeURIComponent(categoriaKey)}">📊 Gironi</a>
    <a class="btn" href="rose.html?categoria=${encodeURIComponent(categoriaKey)}">👥 Rose</a>
    <a class="btn" href="classifica-marcatori.html?categoria=${encodeURIComponent(categoriaKey)}">⚽ Marcatori</a>
    <a class="btn" href="miglior-giocatore.html?categoria=${encodeURIComponent(categoriaKey)}">⭐ Miglior Giocatore</a>
    <a class="btn" href="miglior-portiere.html?categoria=${encodeURIComponent(categoriaKey)}">🧤 Miglior Portiere</a>
  `;

  menu.innerHTML = html;
}

loadCategoria();
