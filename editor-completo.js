
let dati = {};
let categoriaSelezionata = "";

const strutturaIniziale = {
  "Under 17": { gironi: {}, partite: [], finali: [], rose: {} },
  "Under 15": { gironi: {}, partite: [], finali: [], rose: {} },
  "Under 13": { gironi: {}, partite: [], finali: [], rose: {} },
  "2014/15": { gironi: {}, partite: [], finali: [], rose: {} },
  "2016/17": { gironi: {}, partite: [], finali: [], rose: {} },
  "Under 15 femminile": { gironi: {}, partite: [], finali: [], rose: {} },
  "Under 13 femminile": { gironi: {}, partite: [], finali: [], rose: {} }
};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("fileInput").addEventListener("change", e => {
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        dati = JSON.parse(event.target.result);
        if (Object.keys(dati).length === 0) {
          dati = JSON.parse(JSON.stringify(strutturaIniziale));
          alert("✅ File vuoto caricato: struttura base creata!");
        }
        aggiornaCategorie();
        aggiornaVista();
      } catch (error) {
        dati = {};
        alert("⚠️ Errore: il file caricato non è un JSON valido.");
      }
    };
    reader.readAsText(e.target.files[0]);
  });
});

function aggiornaCategorie() {
  const select = document.getElementById("selectCategoria");
  select.innerHTML = "";
  const categorie = Object.keys(dati);
  if (categorie.length === 0) return;
  categorie.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  categoriaSelezionata = categorie[0];
  select.value = categoriaSelezionata;
  select.onchange = () => {
    categoriaSelezionata = select.value;
    aggiornaVista();
  };
}

function aggiornaVista() {
  aggiornaPreview();
  renderGironi();
  renderPartite();
  renderFinali();
  renderRose();
}

function aggiornaPreview() {
  const preview = document.getElementById("previewDati");
  if (categoriaSelezionata && dati[categoriaSelezionata]) {
    preview.textContent = JSON.stringify(dati[categoriaSelezionata], null, 2);
  } else {
    preview.textContent = "⚠️ Nessun dato disponibile.";
  }
}

function creaInput(val = "", ph = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = ph;
  input.value = val;
  return input;
}

function creaNumber(val = 0, ph = "") {
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = ph;
  input.value = val;
  return input;
}

function creaBottone(label, fn) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = fn;
  return btn;
}

function renderGironi() {
  const div = document.getElementById("listaGironi");
  div.innerHTML = "";
  const gironi = dati[categoriaSelezionata]?.gironi || {};
  Object.keys(gironi).forEach(nome => {
    const d = document.createElement("div");
    d.className = "item";
    const inputNome = creaInput(nome, "Nome Girone");
    const inputSquadre = creaInput(gironi[nome].join(", "), "Squadre separate da virgola");
    d.appendChild(inputNome);
    d.appendChild(inputSquadre);
    const azioni = document.createElement("div");
    azioni.className = "actions";
    azioni.appendChild(creaBottone("💾 Salva", () => {
      delete gironi[nome];
      gironi[inputNome.value] = inputSquadre.value.split(",").map(s => s.trim());
      aggiornaVista();
    }));
    azioni.appendChild(creaBottone("🗑️ Cancella", () => {
      delete gironi[nome];
      aggiornaVista();
    }));
    d.appendChild(azioni);
    div.appendChild(d);
  });
}

function aggiungiGirone() {
  if (!dati[categoriaSelezionata].gironi) dati[categoriaSelezionata].gironi = {};
  dati[categoriaSelezionata].gironi["Nuovo Girone"] = [];
  aggiornaVista();
}

function renderPartite() {
  const div = document.getElementById("listaPartite");
  div.innerHTML = "";
  const partite = dati[categoriaSelezionata]?.partite || [];

  partite.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "item";

    const giornata = creaInput(p.giornata || "", "Giornata");
    const girone = creaInput(p.girone || "", "Girone");
    const squadraA = creaInput(p.squadraA || "", "Squadra A");
    const squadraB = creaInput(p.squadraB || "", "Squadra B");
    const campo = creaInput(p.campo || "", "Campo");
    const orario = creaInput(p.orario || "", "Orario");
    const data = creaInput(p.data || "", "Data");
    const golA = creaNumber(p.golA || '', "Gol A");
    const golB = creaNumber(p.golB || '', "Gol B");
    const portiere = creaInput(p.portiere || "", "Miglior Portiere");
    const squadraPortiere = creaInput(p.squadraPortiere || "", "Squadra Portiere");
    const giocatore = creaInput(p.giocatore || "", "Miglior Giocatore");
    const squadraGiocatore = creaInput(p.squadraGiocatore || "", "Squadra Giocatore");

    const marcatoriDiv = document.createElement("div");
    marcatoriDiv.className = "marcatori";
    const marcatori = p.marcatori || [];

    function aggiornaMarcatori() {
      marcatoriDiv.innerHTML = "<h5>Marcatori</h5>";
      marcatori.forEach((m, idx) => {
        const riga = document.createElement("div");
        const nome = creaInput(m.nome, "Nome");
        const gol = creaNumber(m.gol, "Gol");
        const squadra = creaInput(m.squadra, "Squadra");
        nome.oninput = () => m.nome = nome.value;
        gol.oninput = () => m.gol = parseInt(gol.value);
        squadra.oninput = () => m.squadra = squadra.value;
        riga.appendChild(nome);
        riga.appendChild(gol);
        riga.appendChild(squadra);
        const rimuovi = creaBottone("❌", () => {
          marcatori.splice(idx, 1);
          aggiornaMarcatori();
        });
        riga.appendChild(rimuovi);
        marcatoriDiv.appendChild(riga);
      });
      const aggiungi = creaBottone("➕ Aggiungi Marcatore", () => {
        marcatori.push({ nome: "", gol: 1, squadra: "" });
        aggiornaMarcatori();
      });
      marcatoriDiv.appendChild(aggiungi);
    }

    aggiornaMarcatori();

    d.appendChild(giornata);
    d.appendChild(girone);
    d.appendChild(squadraA);
    d.appendChild(squadraB);
    d.appendChild(campo);
    d.appendChild(orario);
    d.appendChild(data);
    d.appendChild(golA);
    d.appendChild(golB);
    d.appendChild(portiere);
    d.appendChild(squadraPortiere);
    d.appendChild(giocatore);
    d.appendChild(squadraGiocatore);
    d.appendChild(marcatoriDiv);

    const azioni = document.createElement("div");
    azioni.className = "actions";
    azioni.appendChild(creaBottone("💾 Salva", () => {
      partite[i] = {
        giornata: giornata.value,
        girone: girone.value,
        squadraA: squadraA.value,
        squadraB: squadraB.value,
        campo: campo.value,
        orario: orario.value,
        data: data.value,
        golA: golA.value !== '' ? parseInt(golA.value) : null,
        golB: golB.value !== '' ? parseInt(golB.value) : null,
        portiere: portiere.value,
        squadraPortiere: squadraPortiere.value,
        giocatore: giocatore.value,
        squadraGiocatore: squadraGiocatore.value,
        marcatori: marcatori
      };
      aggiornaVista();
    }));
    azioni.appendChild(creaBottone("🗑️ Cancella", () => {
      partite.splice(i, 1);
      aggiornaVista();
    }));

    d.appendChild(azioni);
    div.appendChild(d);
  });
}

function aggiungiPartita() {
  if (!dati[categoriaSelezionata].partite) dati[categoriaSelezionata].partite = [];
  dati[categoriaSelezionata].partite.push({});
  aggiornaVista();
}

function renderFinali() {
  const div = document.getElementById("listaFinali");
  div.innerHTML = "";
  const finali = dati[categoriaSelezionata]?.finali || [];
  finali.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "item";
    const squadraA = creaInput(p.squadraA || "", "Squadra A");
    const squadraB = creaInput(p.squadraB || "", "Squadra B");
    const campo = creaInput(p.campo || "", "Campo");
    const orario = creaInput(p.orario || "", "Orario");
    const data = creaInput(p.data || "", "Data");

    d.appendChild(squadraA);
    d.appendChild(squadraB);
    d.appendChild(campo);
    d.appendChild(orario);
    d.appendChild(data);

    const azioni = document.createElement("div");
    azioni.className = "actions";
    azioni.appendChild(creaBottone("💾 Salva", () => {
      finali[i] = {
        squadraA: squadraA.value,
        squadraB: squadraB.value,
        campo: campo.value,
        orario: orario.value,
        data: data.value
      };
      aggiornaVista();
    }));
    azioni.appendChild(creaBottone("🗑️ Cancella", () => {
      finali.splice(i, 1);
      aggiornaVista();
    }));

    d.appendChild(azioni);
    div.appendChild(d);
  });
}

function aggiungiFinale() {
  if (!dati[categoriaSelezionata].finali) dati[categoriaSelezionata].finali = [];
  dati[categoriaSelezionata].finali.push({});
  aggiornaVista();
}

function renderRose() {
  const div = document.getElementById("listaRose");
  div.innerHTML = "";
  const squadre = dati[categoriaSelezionata]?.rose || {};
  Object.entries(squadre).forEach(([squadra, giocatori]) => {
    const section = document.createElement("div");
    section.className = "girone-section";
    const titolo = document.createElement("h3");
    titolo.textContent = squadra;
    section.appendChild(titolo);
    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Cognome</th><th>Nome</th><th>Data di Nascita</th></tr>";
    giocatori.forEach(g => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${g.cognome}</td><td>${g.nome}</td><td>${g.nascita}</td>`;
      table.appendChild(row);
    });
    section.appendChild(table);
    div.appendChild(section);
  });
}

function aggiungiGiocatore() {
  const contenitore = document.getElementById("listaRose");
  const wrapper = document.createElement("div");
  wrapper.className = "item";
  const squadra = creaInput("", "Nome Squadra");
  const cognome = creaInput("", "Cognome");
  const nome = creaInput("", "Nome");
  const nascita = creaInput("", "Data di Nascita");

  wrapper.appendChild(squadra);
  wrapper.appendChild(cognome);
  wrapper.appendChild(nome);
  wrapper.appendChild(nascita);

  const azioni = document.createElement("div");
  azioni.className = "actions";
  azioni.appendChild(creaBottone("💾 Salva", () => {
    if (!dati[categoriaSelezionata].rose) dati[categoriaSelezionata].rose = {};
    if (!dati[categoriaSelezionata].rose[squadra.value]) {
      dati[categoriaSelezionata].rose[squadra.value] = [];
    }
    dati[categoriaSelezionata].rose[squadra.value].push({
      cognome: cognome.value,
      nome: nome.value,
      nascita: nascita.value
    });
    aggiornaVista();
  }));

  azioni.appendChild(creaBottone("🗑️ Cancella", () => {
    wrapper.remove();
  }));

  wrapper.appendChild(azioni);
  contenitore.appendChild(wrapper);
}

function esporta() {
  const blob = new Blob([JSON.stringify(dati, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dati.json";
  a.click();
  URL.revokeObjectURL(url);
}
