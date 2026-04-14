'use strict';

function createMuralHTML (mural, favoriteMurals, lang) {

        const isNL = (lang === "NL");
        
        const titelNL = mural.naam_fresco_nl || "Titel onbekend (NL)";
        const titelFR = mural.nom_de_la_fresque || "Titre inconnu (FR)";
        const titel = isNL ? titelNL : titelFR;

        const tekenaarNL = mural.dessinateur || "Tekenaar onbekend";
        const tekenaarFR = mural.dessinateur || "Dessinateur inconnu"
        const tekenaar = isNL? tekenaarNL : tekenaarFR;

        const adresNL = mural.adres_nl || "Adres onbekend (NL)";
        const adresFR = mural.adresse_fr ||"Adresse inconnu (FR)"
        const adres = isNL? adresNL : adresFR;

        const gemeenteNL = mural.gemeente ||"Gemeente onbekend (NL)";
        const gemeenteFR = mural.commune || "Commune inconnu (FR)";
        const gemeente = isNL? gemeenteNL : gemeenteFR;

        const site = mural.link_site_striproute || "N/A";

        

        const foto = mural.image.url;
       
        //const fotoHTML = `<img src="${foto}" alt="${titelNL}">`;
        const fotoHTML = `<img 
            src="/lazy.svg"
            data-src="${foto}"
            alt="${titel}"
            class="lazy-img"
            >`;
        const omschrTekenaar = isNL? "Tekenaar" : "Dessinateur";
        const omschrAdres = isNL? "Adres" : "Adresse";
        const omschrGemeente = isNL? "Gemeente" : "Commune";

        const omschrSite = isNL? "meer info" : "plus d'infos";
  


      // favoriet icoontje toevoegen
      const muralId = mural.image?.id;
      const isFavorite = favoriteMurals.includes(muralId);
      
      
      const iconSymbol = isFavorite ? "❤️" : "🤍";
     

      //muur card toevoegen  
     
      return `
        <article class="mural-card" style="--preview-img: url('${foto}')">

          

          <div class="mural-img">${fotoHTML}</div>

          
            <div class="mural-preview"></div>


          <div id="${muralId}" class="mural-body" data-id="${muralId}">
            <h2>${titel}</h2>

            <p><b>${omschrTekenaar}: </b> ${tekenaar}</p>
          
            <p><b>${omschrAdres}: </b> ${adres}</p>

            <p><b>${omschrGemeente}: </b> ${gemeente}</p>

            <a href="${site}" class="site" target="_blank"> ${omschrSite} </a>
          </div>
            <footer class="mural-footer">
                <button type="button" class="favorite-mural" data-id="${muralId}">${iconSymbol}</button>
            </footer>
          
       </article>
      `
      
}

export function renderMurals(murals, favoriteMurals, lang) {

    const muralsContainer = document.getElementById('murals');
    //muur kaarten op mijn pagina
    let html = "";
    for (let mural of murals) {
        html += createMuralHTML(mural, favoriteMurals, lang);
        
    }
    muralsContainer.innerHTML = html;

   
    
}