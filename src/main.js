'use strict';

//import './style.css';

import { fetchMurals } from "./api.js";
import { renderMurals } from "./render.js";

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1';

// HTML h1 Stripmuren Brussel Routeplanner en de sectie stripmuren

const app = document.getElementById('app');
app.innerHTML = `
 <main class="page">
 <div id="language-container">
 <button id="NL" class="language">NL</button>
 <button id="FR" class="language">FR</button>
 </div>
 <h1>Stripmuren Brussel Routeplanner</h1>
 <p id="status">Data wordt geladen...</p>
 <section class="filters">
 <input id="filter-favorites" type="checkbox">
 <label for="filter-favorites">Toon enkel ❤️ Favoriete ❤️ Stripmuren </label>
 <label for="search-murals"> Zoeken </label>
 <input id"search-murals" type="text" size="20">
 </section>
 <section id="murals" class="murals"></section>
 </main>
`;

// status 
const statusElement = document.getElementById('status');

let allMurals = [];

function getMurals() {
  const filterFavo = document.getElementById('filter-favorites');
    if (!filterFavo || !filterFavo.checked) {
      return allMurals;
    } 
    else {
      let newMurals = [];

     for (let fm of allMurals)
        {
          let muralImageId = fm?.image?.id;
          if (!muralImageId) continue;
          
          muralImageId = String(muralImageId);
          if (favoriteMurals.includes(muralImageId))
          {
            newMurals.push(fm);
            
          }
        }
        return newMurals;
      }
    
}

// favoriete stripmuren in localStorage
let favoriteMurals = JSON.parse(localStorage.getItem('favoriteMurals')) || [];

favoriteMurals = favoriteMurals.filter(id => 
  id &&
  id !== "undefined" &&
  id !== "null");

  localStorage.setItem('favoriteMurals', JSON.stringify(favoriteMurals));

// event 'click' om favoriete stripmuren aan te duiden

document.addEventListener('click', function (event) {

   const btn = event.target.closest('.favorite-mural');
   if (!btn) return; 
    
   const id = btn.getAttribute('data-id');
   
   if (!id || id == "undefined" || id == "null") { return;}

   if (favoriteMurals.includes(id)) {
    /*
    let newFav = [];
    for (let f of favoriteMurals) { if (f !== id) { newFav.push(f);} }
    favoriteMurals = newFav;
    */

    favoriteMurals = favoriteMurals.filter(f => f !== id);
  }
  else {
    favoriteMurals.push(id);
  }


  localStorage.setItem('favoriteMurals', JSON.stringify(favoriteMurals));

  btn.innerHTML = favoriteMurals.includes(id) ? "❤️" : "🤍";
   
  console.log("favorieten: " + favoriteMurals);

  const filterFavo = document.getElementById('filter-favorites');
    if (!filterFavo || !filterFavo.checked) {
      statusElement.textContent = `Totaal Aantal Stripmuren: ${getMurals().length}`;
    }
    else {  renderMurals(getMurals(), favoriteMurals);
      statusElement.textContent = `Aantal ❤️ Favoriete ❤️ Stripmuren: ${getMurals().length}`}
     
  });



  //event om te weken wanneer checkbox is aangevinkt of is uitgevinkt

  const checkboxFilter = document.getElementById("filter-favorites");

  checkboxFilter.addEventListener('change', () => {
    renderMurals(getMurals(), favoriteMurals);
    const filterFavo = document.getElementById('filter-favorites');
    if (!filterFavo || !filterFavo.checked) {
      statusElement.textContent = `Totaal Aantal Stripmuren: ${getMurals().length}`}
    else {
      statusElement.textContent = `Aantal ❤️ Favoriete ❤️ Stripmuren: ${getMurals().length}`}
  });

async function loadStripmuren(params) {

  try {
    const murals = await fetchMurals();

    allMurals = murals;
    
    statusElement.textContent = `Totaal Aantal stripmuren: ${murals.length}`;

    renderMurals(getMurals(), favoriteMurals);

    //resultaten in DOM tonen
    console.log(allMurals);
    console.log("favorieten: " + favoriteMurals);
    
  }

  catch (error) {
    console.log('Fout bij ophalen:' + error);

    statusElement.textContent = "Fout opgetreden bij het laden van de data";
  }

}

loadStripmuren();

