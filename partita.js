async function caricaPartita() {
  const params = new URLSearchParams(location.search);
  const categoria = params.get("categoria");
  const giornataIndex = parseInt(params.get("giornata"), 10);
  const partitaIndex = parseInt(params.get("partita"), 10);

  if (!categoria || isNaN(giornataIndex) || isNaN(partitaIndex)) {
    return;
  }

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const dati = await res.json();

    const partita = dati[categoria]?.calendario?.[giornataIndex]?.partite?.[partitaIndex];

    if (!partita) {
      return;
    }

    const container = document.getElementById("riepilogo");
    if (!container) return;

    container.innerHTML = "";

    const squadre = (partita.squadre || "").split(" vs ");
    const squadraA = squadre[0] || "Squadra A";
    const squadraB = squadre[1] || "Squadra B";

    const titolo = document.createElement("h2");
    titolo.textContent = `${squadraA} ${partita.risultato || "vs"} ${squadraB}`;
    container.appendChild(titolo);

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    function creaColonna(nomeSquadra, marcatori) {
      const col = document.createElement("div");
      col.className = "colonna";

      const title = document.createElement("h3");
      title.textContent = nomeSquadra;
      col.appendChild(title);

      if (!marcatori || marcatori.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "Nessun marcatore";
        col.appendChild(empty);
      } else {
        marcatori.forEach((m) => {
          const div = document.createElement("div");
          div.className = "marcatore-item";
          div.textContent = `${m.nome || ""} (${m.gol ?? 1})`;
          col.appendChild(div);
        });
      }

      return col;
    }

    const marcatori = Array.isArray(partita.marcatori) ? partita.marcatori : [];
    const marcatoriA = marcatori.filter((m) => m.squadra === squadraA);
    const marcatoriB = marcatori.filter((m) => m.squadra === squadraB);

    wrapper.appendChild(creaColonna(squadraA, marcatoriA));
    wrapper.appendChild(creaColonna(squadraB, marcatoriB));
    container.appendChild(wrapper);

    if (partita.giocatore) {
      const div = document.createElement("div");
      div.className = "info-extra";
      div.innerHTML =
        `<strong>Miglior Giocatore:</strong> ${partita.giocatore}` +
        (partita.squadraGiocatore ? ` (${partita.squadraGiocatore})` : "");
      container.appendChild(div);
    }

    if (partita.portiere) {
      const div = document.createElement("div");
      div.className = "info-extra";
      div.innerHTML =
        `<strong>Miglior Portiere:</strong> ${partita.portiere}` +
        (partita.squadraPortiere ? ` (${partita.squadraPortiere})` : "");
      container.appendChild(div);
    }
  } catch (error) {
    console.error("Errore nel caricamento della partita:", error);
  }
}

window.onload = caricaPartita;
