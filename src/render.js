'use strict';

function createMuralHTML (mural, favoriteMurals) {

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

        const site = mural.link_site_striproute || "N/A";


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

      // favoriet icoontje toevoegen
      const muralId = mural.image?.id;
      const isFavorite = favoriteMurals.includes(muralId);
      let iconType = isFavorite ? "favorite" : "not-favorite";
      
      let iconSymbol ="";
      if (iconType == "favorite") {
        iconSymbol = "❤️";
      }
      else {
        iconSymbol = "🤍";
      }

      //muur card toevoegen NL (nog uitbreiden met voorkeurtaal later)

      return `
        <article class="mural-card">

          

          <div class="mural-img">${fotoHTML}</div>

          
            <div class="mural-preview">
            ${fotoHTML}
            </div>


          <div class="mural-body">
            <h2>${titelNL}</h2>

            <p><b>Tekenaar: </b> ${tekenaarNL}</p>
          
            <p><b>Adres: </b> ${adresNL}</p>

            <p><b>Gemeente: </b> ${gemeenteNL}</p>

            <a href="${site}" class="site" target="_blank"> meer info </a>
          </div>
            <footer class="mural-footer">
                <button type="button" class="favorite-mural" data-id="${muralId}">${iconSymbol}</button>
            </footer>
          
       </article>
      `
}

export function renderMurals(murals, favoriteMurals) {

    // murals ophalen voor grid te maken
    const muralsContainer = document.getElementById('murals');
    //muur kaarten op mijn pagina
    let html = "";
    for (let mural of murals) {
        html += createMuralHTML(mural, favoriteMurals);
    }
    muralsContainer.innerHTML = html;
}