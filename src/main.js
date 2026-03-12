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
  <div id="map"></div>
 <section id="murals" class="murals"></section>
 </main>
`;

// status 
const statusElement = document.getElementById('status');


let map = L.map('map').setView([50.8503396, 4.3517103], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);
let muralMarkers = {};

let myIcon = L.divIcon({ className: 'my-div-icon' });


let allMurals = [];

function getMurals() {
  const filterFavo = document.getElementById('filter-favorites');
  if (!filterFavo || !filterFavo.checked) {
    return allMurals;
  }
  else {
    let newMurals = [];

    for (let fm of allMurals) {
      let muralImageId = fm?.image?.id;
      if (!muralImageId) continue;

      muralImageId = String(muralImageId);
      if (favoriteMurals.includes(muralImageId)) {
        newMurals.push(fm);

      }
    }
    return newMurals;
  }

}

function renderMap(murals) {
  //Leaflet toevoegen


  markersLayer.clearLayers();
  muralMarkers = {};
  // alles markeren en tonen
  for (let mural of murals) {
    console.log(mural.geo_point.lon + " - " + mural.geo_point.lat);
    let marker = L.marker([mural.geo_point.lat, mural.geo_point.lon], { icon: myIcon }).addTo(markersLayer);

    marker.bindPopup(mural.naam_fresco_nl);

    const muralId = mural.image?.id;
    if (!muralId) continue;
    muralMarkers[muralId] = marker;

  }

  console.log("de marker keys", Object.keys(muralMarkers));
  //let bounds = markersLayer.getBounds();
  //map.fitBounds(bounds);
}

// favoriete stripmuren in localStorage
let favoriteMurals = JSON.parse(localStorage.getItem('favoriteMurals')) || [];

favoriteMurals = favoriteMurals.filter(id =>
  id &&
  id !== "undefined" &&
  id !== "null");

localStorage.setItem('favoriteMurals', JSON.stringify(favoriteMurals));

// event 'click' om favoriete stripmuren aan te duiden
// hierbij 'click' op stripmuurkaart voor popup op kaart 

document.addEventListener('click', function (event) {

  const btn = event.target.closest('.favorite-mural');

  if (btn) {

    const id = btn.getAttribute('data-id');

    if (!id || id == "undefined" || id == "null") { return; }

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
    else {
      renderMurals(getMurals(), favoriteMurals);
      statusElement.textContent = `Aantal ❤️ Favoriete ❤️ Stripmuren: ${getMurals().length}`
    }

    renderMap(murals);

    return;
  }

  // bij click ook toevoegen: stripmuur op map te zien

  const muralCard = event.target.closest('.mural-body');
  if (!muralCard) return;
  muralMarkers[(muralCard.getAttribute('data-id'))].openPopup();

});






//event 'change' om te weten wanneer checkbox is aangevinkt of is uitgevinkt

const checkboxFilter = document.getElementById("filter-favorites");

checkboxFilter.addEventListener('change', () => {
  renderMurals(getMurals(), favoriteMurals);



  const filterFavo = document.getElementById('filter-favorites');
  if (!filterFavo || !filterFavo.checked) {
    statusElement.textContent = `Totaal Aantal Stripmuren: ${getMurals().length}`
  }
  else {
    statusElement.textContent = `Aantal ❤️ Favoriete ❤️ Stripmuren: ${getMurals().length}`
  }

  renderMap(getMurals());
});

async function loadStripmuren(params) {

  try {
    const murals = await fetchMurals();

    allMurals = murals;

    statusElement.textContent = `Totaal Aantal stripmuren: ${murals.length}`;

    renderMurals(getMurals(), favoriteMurals);




    renderMap(getMurals());

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

