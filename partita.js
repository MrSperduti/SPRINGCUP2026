async function caricaPartita() {

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id || !id.includes('-')) return;

  const [categoria, indexStr] = id.split(/-(?=\d+$)/);
  const index = parseInt(indexStr, 10);

  if (!categoria || isNaN(index)) return;

  const res = await fetch('data/dati.json');
  const dati = await res.json();

  const partita = dati[categoria]?.partite?.[index];

  if (!partita) return;

  const container = document.getElementById('riepilogo');
  container.innerHTML = '';

  // 🔥 TITOLO
  const titolo = document.createElement('h2');

  const risultato = (partita.golA != null && partita.golB != null)
    ? `${partita.squadraA} ${partita.golA} - ${partita.golB} ${partita.squadraB}`
    : `${partita.squadraA} vs ${partita.squadraB}`;

  titolo.textContent = risultato;
  container.appendChild(titolo);

  // 🔥 MARCATORI
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  function creaColonna(nomeSquadra, marcatori) {
    const col = document.createElement('div');
    col.className = 'colonna';

    const title = document.createElement('h3');
    title.textContent = nomeSquadra;
    col.appendChild(title);

    if (marcatori.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'Nessun marcatore';
      col.appendChild(empty);
    } else {
      marcatori.forEach(m => {
        const div = document.createElement('div');
        div.textContent = `${m.nome} (${m.gol})`;
        col.appendChild(div);
      });
    }

    return col;
  }

  const marcatori = partita.marcatori || [];

  const marcatoriA = marcatori.filter(m => m.squadra === partita.squadraA);
  const marcatoriB = marcatori.filter(m => m.squadra === partita.squadraB);

  wrapper.appendChild(creaColonna(partita.squadraA, marcatoriA));
  wrapper.appendChild(creaColonna(partita.squadraB, marcatoriB));

  container.appendChild(wrapper);

  // 🔥 MIGLIOR GIOCATORE
  if (partita.giocatore) {
    const div = document.createElement('div');
    div.className = 'info-extra';
    div.innerHTML = `<strong>Miglior Giocatore:</strong> ${partita.giocatore}`;
    container.appendChild(div);
  }

  // 🔥 MIGLIOR PORTIERE
  if (partita.portiere) {
    const div = document.createElement('div');
    div.className = 'info-extra';
    div.innerHTML = `<strong>Miglior Portiere:</strong> ${partita.portiere}`;
    container.appendChild(div);
  }
}

window.onload = caricaPartita;
