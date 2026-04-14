let dati = {};
let categoriaSelezionata = "";

const strutturaIniziale = {
  "Under21": { nome: "Under 21", gironi: {}, calendario: [], rose: {} },
  "Under19": { nome: "Under 19", gironi: {}, calendario: [], rose: {} },
  "Under17": { nome: "Under 17", gironi: {}, calendario: [], rose: {} },
  "Under15": { nome: "Under 15", gironi: {}, calendario: [], rose: {} },
  "Under13": { nome: "Under 13", gironi: {}, calendario: [], rose: {} },
  "2019/20": { nome: "2019/20", gironi: {}, calendario: [], rose: {} },
  "2017/18": { nome: "2017/18", gironi: {}, calendario: [], rose: {} },
  "2015/16": { nome: "2015/16", gironi: {}, calendario: [], rose: {} },
  "2014/15": { nome: "2014/15", gironi: {}, calendario: [], rose: {} }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);

  document.getElementById("btnEsporta").addEventListener("click", (e) => {
    e.preventDefault();
    esporta();
  });

  document.getElementById("btnAggiungiGirone").addEventListener("click", (e) => {
    e.preventDefault();
    aggiungiGirone();
  });

  document.getElementById("btnAggiungiGiornata").addEventListener("click", (e) => {
    e.preventDefault();
    aggiungiGiornataNormale();
  });

  const btnSemifinale = document.getElementById("btnAggiungiSemifinale");
  if (btnSemifinale) {
    btnSemifinale.addEventListener("click", (e) => {
      e.preventDefault();
      aggiungiSemifinale();
    });
  }

  const btnFinale = document.getElementById("btnAggiungiFinale");
  if (btnFinale) {
    btnFinale.addEventListener("click", (e) => {
      e.preventDefault();
      aggiungiFinale();
    });
  }

  document.getElementById("btnAggiungiGiocatore").addEventListener("click", (e) => {
    e.preventDefault();
    aggiungiGiocatore();
  });

  dati = JSON.parse(JSON.stringify(strutturaIniziale));
  aggiornaCategorie();
  aggiornaVista();
});

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const parsed = JSON.parse(event.target.result);
      dati = parsed && Object.keys(parsed).length ? parsed : JSON.parse(JSON.stringify(strutturaIniziale));
      normalizzaStruttura();
      aggiornaCategorie();
      aggiornaVista();
      alert("✅ File JSON caricato correttamente.");
    } catch (error) {
      alert("⚠️ Errore: il file caricato non è un JSON valido.");
    }
  };
  reader.readAsText(file);
}

function normalizzaStruttura() {
  Object.keys(dati).forEach((cat) => {
    if (!dati[cat] || typeof dati[cat] !== "object") {
      dati[cat] = { nome: cat, gironi: {}, calendario: [], rose: {} };
    }

    dati[cat].nome = dati[cat].nome || cat;
    dati[cat].gironi = dati[cat].gironi || {};
    dati[cat].calendario = Array.isArray(dati[cat].calendario) ? dati[cat].calendario : [];
    dati[cat].rose = dati[cat].rose || {};

    dati[cat].calendario.forEach((giornata) => {
      giornata.giornata = giornata.giornata || "";
      giornata.partite = Array.isArray(giornata.partite) ? giornata.partite : [];

      giornata.partite.forEach((p) => {
        p.squadre = p.squadre || "";
        p.risultato = p.risultato || "";
        p.data = p.data || "";
        p.ora = p.ora || "";
        p.campo = p.campo || "";
        p.marcatori = Array.isArray(p.marcatori) ? p.marcatori : [];
        p.giocatore = p.giocatore || "";
        p.squadraGiocatore = p.squadraGiocatore || "";
        p.portiere = p.portiere || "";
        p.squadraPortiere = p.squadraPortiere || "";
      });
    });
  });
}

function aggiornaCategorie() {
  const select = document.getElementById("selectCategoria");
  select.innerHTML = "";

  const categorie = Object.keys(dati);
  if (!categorie.length) {
    categoriaSelezionata = "";
    return;
  }

  categorie.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  if (!categoriaSelezionata || !dati[categoriaSelezionata]) {
    categoriaSelezionata = categorie[0];
  }

  select.value = categoriaSelezionata;
  select.onchange = () => {
    categoriaSelezionata = select.value;
    aggiornaVista();
  };
}

function aggiornaVista() {
  aggiornaPreview();
  renderGironi();
  renderCalendario();
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

function creaNumber(val = "", ph = "") {
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = ph;
  input.value = val;
  return input;
}

function creaBottone(label, fn, secondary = false) {
  const btn = document.createElement("a");
  btn.href = "#";
  btn.className = secondary ? "btn secondary" : "btn";
  btn.textContent = label;
  btn.onclick = (e) => {
    e.preventDefault();
    fn();
  };
  return btn;
}

function renderGironi() {
  const div = document.getElementById("listaGironi");
  div.innerHTML = "";

  const gironi = dati[categoriaSelezionata]?.gironi || {};

  Object.keys(gironi).forEach((nome) => {
    const card = document.createElement("div");
    card.className = "list-card";

    const inputNome = creaInput(nome, "Nome Girone");
    const inputSquadre = creaInput(gironi[nome].join(", "), "Squadre separate da virgola");

    card.appendChild(inputNome);
    card.appendChild(inputSquadre);

    const actions = document.createElement("div");
    actions.appendChild(creaBottone("💾 Salva", () => {
      const nuovoNome = inputNome.value.trim() || "Nuovo Girone";
      const squadre = inputSquadre.value.split(",").map((s) => s.trim()).filter(Boolean);

      delete gironi[nome];
      gironi[nuovoNome] = squadre;
      aggiornaVista();
    }));
    actions.appendChild(creaBottone("🗑️ Cancella", () => {
      delete gironi[nome];
      aggiornaVista();
    }, true));

    card.appendChild(actions);
    div.appendChild(card);
  });
}

function aggiungiGirone() {
  if (!dati[categoriaSelezionata].gironi) dati[categoriaSelezionata].gironi = {};

  let base = "NUOVO GIRONE";
  let nome = base;
  let i = 1;

  while (dati[categoriaSelezionata].gironi[nome]) {
    nome = `${base} ${i++}`;
  }

  dati[categoriaSelezionata].gironi[nome] = [];
  aggiornaVista();
}

function renderCalendario() {
  const div = document.getElementById("listaCalendario");
  div.innerHTML = "";

  const calendario = dati[categoriaSelezionata]?.calendario || [];

  calendario.forEach((giornataObj, giornataIndex) => {
    const section = document.createElement("div");
    section.className = "list-card";

    const titoloGiornata = creaInput(giornataObj.giornata || "", "Nome giornata / fase");
    section.appendChild(titoloGiornata);

    const topActions = document.createElement("div");
    topActions.appendChild(creaBottone("💾 Salva fase", () => {
      giornataObj.giornata = titoloGiornata.value.trim();
      aggiornaVista();
    }));
    topActions.appendChild(creaBottone("➕ Aggiungi partita", () => {
      giornataObj.partite.push(creaPartitaVuota());
      aggiornaVista();
    }));
    topActions.appendChild(creaBottone("🗑️ Cancella fase", () => {
      calendario.splice(giornataIndex, 1);
      aggiornaVista();
    }, true));
    section.appendChild(topActions);

    (giornataObj.partite || []).forEach((p, partitaIndex) => {
      const partitaCard = document.createElement("div");
      partitaCard.className = "list-card";

      const squadre = creaInput(p.squadre || "", "Squadre es. ACADEMY vs ARDEA C5");
      const risultato = creaInput(p.risultato || "", "Risultato es. 2 - 1 oppure Dettagli");
      const data = creaInput(p.data || "", "Data");
      const ora = creaInput(p.ora || "", "Ora");
      const campo = creaInput(p.campo || "", "Campo");
      const giocatore = creaInput(p.giocatore || "", "Miglior Giocatore");
      const squadraGiocatore = creaInput(p.squadraGiocatore || "", "Squadra Giocatore");
      const portiere = creaInput(p.portiere || "", "Miglior Portiere");
      const squadraPortiere = creaInput(p.squadraPortiere || "", "Squadra Portiere");

      partitaCard.appendChild(squadre);
      partitaCard.appendChild(risultato);
      partitaCard.appendChild(data);
      partitaCard.appendChild(ora);
      partitaCard.appendChild(campo);
      partitaCard.appendChild(giocatore);
      partitaCard.appendChild(squadraGiocatore);
      partitaCard.appendChild(portiere);
      partitaCard.appendChild(squadraPortiere);

      const marcatoriDiv = document.createElement("div");
      marcatoriDiv.className = "list-card";
      const marcatori = p.marcatori || [];

      function renderMarcatori() {
        marcatoriDiv.innerHTML = "<h3>Marcatori</h3>";

        marcatori.forEach((m, idx) => {
          const row = document.createElement("div");
          row.className = "list-card";

          const nome = creaInput(m.nome || "", "Nome");
          const gol = creaNumber(m.gol ?? 1, "Gol");
          const squadra = creaInput(m.squadra || "", "Squadra");

          nome.oninput = () => { m.nome = nome.value; };
          gol.oninput = () => { m.gol = parseInt(gol.value, 10) || 0; };
          squadra.oninput = () => { m.squadra = squadra.value; };

          row.appendChild(nome);
          row.appendChild(gol);
          row.appendChild(squadra);
          row.appendChild(creaBottone("🗑️ Rimuovi Marcatore", () => {
            marcatori.splice(idx, 1);
            renderMarcatori();
          }, true));

          marcatoriDiv.appendChild(row);
        });

        marcatoriDiv.appendChild(creaBottone("➕ Aggiungi Marcatore", () => {
          marcatori.push({ nome: "", gol: 1, squadra: "" });
          renderMarcatori();
        }));
      }

      renderMarcatori();
      partitaCard.appendChild(marcatoriDiv);

      const actions = document.createElement("div");
      actions.appendChild(creaBottone("💾 Salva partita", () => {
        giornataObj.partite[partitaIndex] = {
          squadre: squadre.value.trim(),
          risultato: risultato.value.trim(),
          data: data.value.trim(),
          ora: ora.value.trim(),
          campo: campo.value.trim(),
          marcatori: marcatori,
          giocatore: giocatore.value.trim(),
          squadraGiocatore: squadraGiocatore.value.trim(),
          portiere: portiere.value.trim(),
          squadraPortiere: squadraPortiere.value.trim()
        };
        aggiornaVista();
      }));
      actions.appendChild(creaBottone("🗑️ Cancella partita", () => {
        giornataObj.partite.splice(partitaIndex, 1);
        aggiornaVista();
      }, true));

      partitaCard.appendChild(actions);
      section.appendChild(partitaCard);
    });

    div.appendChild(section);
  });
}

function creaPartitaVuota() {
  return {
    squadre: "",
    risultato: "",
    data: "",
    ora: "",
    campo: "",
    marcatori: [],
    giocatore: "",
    squadraGiocatore: "",
    portiere: "",
    squadraPortiere: ""
  };
}

function aggiungiGiornataNormale() {
  if (!dati[categoriaSelezionata].calendario) dati[categoriaSelezionata].calendario = [];

  const prossimoNumero = contaGiornateNumeriche(dati[categoriaSelezionata].calendario) + 1;

  dati[categoriaSelezionata].calendario.push({
    giornata: String(prossimoNumero),
    partite: []
  });

  aggiornaVista();
}

function contaGiornateNumeriche(calendario) {
  let max = 0;

  calendario.forEach((g) => {
    const n = parseInt(g.giornata, 10);
    if (!isNaN(n) && n > max) max = n;
  });

  return max;
}

function aggiungiSemifinale() {
  if (!dati[categoriaSelezionata].calendario) dati[categoriaSelezionata].calendario = [];

  const esisteA = dati[categoriaSelezionata].calendario.some((g) => g.giornata === "SEMIFINALE A");
  const esisteB = dati[categoriaSelezionata].calendario.some((g) => g.giornata === "SEMIFINALE B");

  let nome = "SEMIFINALE A";
  if (esisteA && !esisteB) nome = "SEMIFINALE B";
  if (esisteA && esisteB) nome = `SEMIFINALE ${dati[categoriaSelezionata].calendario.filter(g => g.giornata.startsWith("SEMIFINALE")).length + 1}`;

  dati[categoriaSelezionata].calendario.push({
    giornata: nome,
    partite: [creaPartitaVuota()]
  });

  aggiornaVista();
}

function aggiungiFinale() {
  if (!dati[categoriaSelezionata].calendario) dati[categoriaSelezionata].calendario = [];

  const opzioni = [
    "FINALE 3°/4° POSTO",
    "FINALE"
  ];

  const nome = prompt(
    "Inserisci nome finale/fase finale",
    opzioni.find((x) => !dati[categoriaSelezionata].calendario.some((g) => g.giornata === x)) || "FINALE"
  );

  if (!nome) return;

  dati[categoriaSelezionata].calendario.push({
    giornata: nome.trim(),
    partite: [creaPartitaVuota()]
  });

  aggiornaVista();
}

function renderRose() {
  const div = document.getElementById("listaRose");
  div.innerHTML = "";

  const rose = dati[categoriaSelezionata]?.rose || {};

  Object.keys(rose).sort((a, b) => a.localeCompare(b)).forEach((squadra) => {
    const section = document.createElement("div");
    section.className = "list-card";

    const titolo = document.createElement("h3");
    titolo.textContent = squadra;
    section.appendChild(titolo);

    const giocatori = rose[squadra] || [];

    giocatori.forEach((g, idx) => {
      const row = document.createElement("div");
      row.className = "list-card";

      const cognome = creaInput(g.cognome || "", "Cognome");
      const nome = creaInput(g.nome || "", "Nome");
      const nascita = creaInput(g.nascita || "", "Data di nascita");

      row.appendChild(cognome);
      row.appendChild(nome);
      row.appendChild(nascita);

      const actions = document.createElement("div");
      actions.appendChild(creaBottone("💾 Salva", () => {
        rose[squadra][idx] = {
          cognome: cognome.value.trim(),
          nome: nome.value.trim(),
          nascita: nascita.value.trim()
        };
        aggiornaVista();
      }));
      actions.appendChild(creaBottone("🗑️ Cancella", () => {
        rose[squadra].splice(idx, 1);
        if (!rose[squadra].length) delete rose[squadra];
        aggiornaVista();
      }, true));

      row.appendChild(actions);
      section.appendChild(row);
    });

    div.appendChild(section);
  });
}

function aggiungiGiocatore() {
  const squadra = prompt("Nome squadra");
  if (!squadra) return;

  if (!dati[categoriaSelezionata].rose) dati[categoriaSelezionata].rose = {};
  if (!dati[categoriaSelezionata].rose[squadra]) {
    dati[categoriaSelezionata].rose[squadra] = [];
  }

  dati[categoriaSelezionata].rose[squadra].push({
    cognome: "",
    nome: "",
    nascita: ""
  });

  aggiornaVista();
}

function esporta() {
  const blob = new Blob([JSON.stringify(dati, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dati.json";
  a.click();
  URL.revokeObjectURL(url);
}
