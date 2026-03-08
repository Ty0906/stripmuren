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
 <section id="murals" class="murals"></section>
 </main>
`;

// status 
const statusElement = document.getElementById('status');

let allMurals = [];
// favoriete stripmuren in localStorage
let favoriteMurals = JSON.parse(localStorage.getItem('favoriteMurals')) || [];



// event 'click' om favoriete stripmuren aan te duiden

document.addEventListener('click', function (event) {

   const btn = event.target.closest('.favorite-mural');
   if (!btn) return; 
    
   const id = btn.getAttribute('data-id');

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
   
} );



async function loadStripmuren(params) {

  try {
    const murals = await fetchMurals();

    allMurals = murals;
    
    statusElement.textContent = `Aantal stripmuren: ${murals.length}`;

    renderMurals(murals, favoriteMurals);

    
  }

  catch (error) {
    console.log('Fout bij ophalen:' + error);

    statusElement.textContent = "Fout opgetreden bij het laden van de data";
  }

}

loadStripmuren();

