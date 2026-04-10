document.addEventListener("DOMContentLoaded", async () => {

  const titolo = document.getElementById("titoloCategoria");
  const menu = document.getElementById("menuCategoria");

  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) {
    titolo.textContent = "Categoria non trovata";
    return;
  }

  titolo.textContent = categoria;

  // Carico dati torneo
  let dati = {};
  try {
    const res = await fetch("data/dati.json");
    dati = await res.json();
  } catch {
    menu.innerHTML = "<div class='card'>Errore caricamento dati</div>";
    return;
  }

  const dataCategoria = dati[categoria];

  if (!dataCategoria) {
    menu.innerHTML = "<div class='card'>Nessun dato per questa categoria</div>";
    return;
  }

  // MENU SEZIONI
  const sezioni = [
    { nome: "Gironi", pagina: "gironi.html" },
    { nome: "Partite", pagina: "partita.html" },
    { nome: "Classifica", pagina: "classifica.html" },
    { nome: "Marcatori", pagina: "classifica-marcatori.html" },
    { nome: "Portieri", pagina: "classifica-portieri.html" },
    { nome: "Rose", pagina: "rose.html" }
  ];

  menu.innerHTML = "";

  sezioni.forEach(s => {
    const btn = document.createElement("a");
    btn.className = "btn";
    btn.href = `${s.pagina}?categoria=${encodeURIComponent(categoria)}`;
    btn.textContent = s.nome;

    menu.appendChild(btn);
  });

});
