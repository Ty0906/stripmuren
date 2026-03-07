'use strict';

//import './style.css';

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1';

// HTML h1 Stripmuren Brussel Routeplanner en de sectie stripmuren

const app = document.getElementById('app');
app.innerHTML = `
 <main class="page">
 <h1>Stripmuren Brussel Routeplanner</h1>
 <p id="status">Data wordt geladen...</p>
 <section id="murals" class="murals"></section>
 </main>
`;

// api ophalen
const statusElement = document.getElementById('status');
// murals ophalen voor grid te maken
const muralsContainer = document.getElementById('murals');

async function loadStripmuren(params) {

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API_URL fout ${response.status}`);
    }

    const data = await response.json();
    const murals = data.results; 
    console.log("Stripmuren data: " + murals);

    
    statusElement.textContent = `Aantal stripmuren: ${murals.length}`;

    let html = "";

    for (let mural of murals) {

      //gekozen velden met Truthly en Falsy waarden en nullish coalescing operator ??
      //NL en FR tonen ophalen
        const titelNL = mural.naam_fresco_nl || "Titel onbekend (NL)";
        const titelFR = mural.nom_de_la_fresque || "Titre inconnu (FR)";

        const tekenaarNL = mural.dessinateur || "Tekenaar onbekend";
        const tekenaarFR = mural.dessinateur || "Dessinateur inconnu"

        const adresNL = mural.adres_nl || "Adres onbekend (NL)";
        const adresFR = mural.adresse_fr ||"Adresse inconnu (FR)"

        const gemeenteNL = mural.gemeente ||"Gemeente onbekend (NL)";
        const gemeenteFR = mural.commune || "Commune inconnu (FR)";

        const wijkNL = mural.quartier || "Wijk onbekend (NL)";
        const wijkFR = mural.quartier || "Quartier inconnu (FR)"

        let foto = null;
        if (mural.image) {
          foto = mural.image.url ?? null;
        }

        let fotoHTML;
        if (foto) {
          fotoHTML = `<img src="${foto}" alt="${titelNL}">`;
        }
        else {
          fotoHTML = `<div class="no-image">Geen foto</div>`;
        }

      //muur card toevoegen NL (nog uitbreiden met voorkeurtaal later)

      html += `
        <article class="mural-card">
          <div class="mural-img">${fotoHTML}</div>

          <h2>${titelNL}</h2>

          <p><b>Tekenaar: </b> ${tekenaarNL}</p>
          
          <p><b>Adres: </b> ${adresNL}</p>

          <p><b>Gemeente: </b> ${gemeenteNL}</p>
          
       </article>
      `
    }

    //muur kaarten op mijn pagina
    muralsContainer.innerHTML = html;



  }

  catch (error) {
    console.log('Fout bij ophalen:' + error);

    statusElement.textContent = "Fout opgetreden bij het laden van de data";
  }

}

loadStripmuren();

