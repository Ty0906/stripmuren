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
  <label for="filter-favorites">Toon enkel Favoriete Stripmuren ❤️ </label>

  <label for="search-murals"> Zoeken </label>
  <input id="search-murals" type="text" size="20">

  <label for="sort-murals"> Sorteren op: </label>
  <select id="sort-murals">
    <option value="">  </option>
    <option value="titel">Titel</option>
    <option value="tekenaar">Tekenaar</option>
  </select>

  <button id="calc-route" style="display:none;">Bereken route</button>
 </section>
  <div id="map"></div>
 <div id="favorites-layout"> 
  <section id="murals" class="murals"></section>
  <div id="route-map" style="display:none;"></div>
 </div>
 </main>
`;

// status 
const statusElement = document.getElementById('status');

const calcRoute = document.getElementById('calc-route');

const layout = document.getElementById('favorites-layout');

let map = L.map('map').setView([50.8503396, 4.3517103], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let routeMap = L.map('route-map').setView([50.8503396, 4.3517103], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(routeMap);

let markersLayer = L.featureGroup().addTo(map);
let muralMarkers = {};

let myIcon = L.divIcon({ className: "my-div-icon" });


let allMurals = [];


function getMurals() {

  const filterFavo = document.getElementById("filter-favorites");
  const sortOption = document.getElementById("sort-murals");

  let sortResult = [...allMurals];
  let newMurals = [];

  /* if (!filterFavo || !filterFavo.checked) {
    return allMurals;
  }
  else */

    if (filterFavo && filterFavo.checked)  {
    
    for (let fm of allMurals) {
      let muralImageId = fm?.image?.id;
      if (!muralImageId) continue;

      muralImageId = String(muralImageId);
      if (favoriteMurals.includes(muralImageId)) {
        newMurals.push(fm);

      }
    }
    //return newMurals;
  }

  if (filterFavo && filterFavo.checked) {
    sortResult = [...newMurals];
  }
  
  const sortValue = sortOption.value;
  

  if (sortValue == "titel") {
    sortResult.sort((a,b) => (a.naam_fresco_nl || "").localeCompare(b.naam_fresco_nl || "", 'nl', { sensitivity: 'base' })
  );
  }

  if (sortValue == "tekenaar") {
     sortResult.sort((a,b) => (a.dessinateur || "").localeCompare(b.dessinateur || "", 'nl', { sensitivity: 'base' })
    );
  }

  return sortResult;

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
  let bounds = markersLayer.getBounds();
  map.fitBounds(bounds);
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
      layout.classList.remove("favorites-checked");
      calcRoute.style.display = "none";
    }
    else {
      renderMurals(getMurals(), favoriteMurals);
      statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${getMurals().length}`;
      layout.classList.add("favorites-checked");
      calcRoute.style.display = "inline-block";

    }

    renderMap(getMurals());

    return;
  }

  //sortering "change" event

  const sortOption = document.getElementById("sort-murals");

  sortOption.addEventListener("change", () => {

    renderMurals(getMurals(), favoriteMurals);
    renderMap(getMurals());
  })

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
    statusElement.textContent = `Totaal Aantal Stripmuren: ${getMurals().length}`;
    layout.classList.remove("favorites-checked");
    calcRoute.style.display = "none";
    document.getElementById("route-map").style.display = "none";
    if (routingControl) {
    routeMap.removeControl(routingControl);
  }

  }
  else {
    statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${getMurals().length}`;
    layout.classList.add("favorites-checked");
    calcRoute.style.display = "inline-block";
  }

  renderMap(getMurals());
});

// click event om routekaart toe te voegen met route = actieknop 'bereken route'

let routingControl;

calcRoute.addEventListener('click', () => {

  //route-map zichtbaar maken
  document.getElementById('route-map').style.display = "block";

  setTimeout(() => {
  routeMap.invalidateSize(); //Leaflet laten weten dat de kaart zichtbaar is en berekening nodig is voor Bounds
}, 100);

  const points = [];

  for (let id of favoriteMurals) {
    const marker = muralMarkers[id];


    if (marker) {

      const latLng = marker.getLatLng();

      points.push(latLng);
    }



  }

  if (points.length < 2) { alert("Je moet minstens 2 favoriete stripmuren hebben om een route te berekenen!") }
  

  if (routingControl) {
    routeMap.removeControl(routingControl);
  }


  /*
  L.Routing.Formatter.prototype.formatInstruction = function(instr) {
     console.log(instr.type);
    switch(instr.type) {
        case 'Head': return 'Ga';
        case 'Straight': return 'Ga rechtdoor';
        case 'SlightRight': return 'Houd rechts aan';
        case 'Right': return 'Sla rechtsaf';
        case 'SharpRight': return 'Sla scherp rechtsaf';
        case 'TurnAround': return 'Keer om';
        case 'SharpLeft': return 'Sla scherp linksaf';
        case 'Left': return 'Sla linksaf';
        case 'SlightLeft': return 'Houd links aan';
        case 'WaypointReached': return 'Bestemming bereikt';
        case 'Roundabout': return 'Neem de rotonde';
        default: return instr.text; // fallback
    }
};*/


const formatterNL = new L.Routing.Formatter({
    language: 'nl' 
});

formatterNL.formatInstruction = function(instr) {
    let text = '';

    switch(instr.type) {
        case 'Head':
            text = 'Vertrek';
            if (instr.dir) text += ' richting ' + vertaalRichtingNL(instr.dir);
            break;

        case 'Straight':
        case 'Continue':
            text = 'Ga rechtdoor';
            break;

        case 'Right':
            text = 'Sla rechtsaf';
            break;

        case 'Left':
            text = 'Sla linksaf';
            break;

        case 'SlightRight':
            text = 'Houd rechts aan';
            break;

        case 'SlightLeft':
            text = 'Houd links aan';
            break;

        case 'SharpRight':
            text = 'Sla scherp rechtsaf';
            break;

        case 'SharpLeft':
            text = 'Sla scherp linksaf';
            break;

        case 'TurnAround':
            text = 'Keer om';
            break;

        case 'Roundabout':
            text = 'Neem de rotonde';
            break;

        case 'WaypointReached':
            text = 'Tussenpunt bereikt';
            break;

        case 'DestinationReached':
            text = 'Bestemming bereikt';
            break;

        default:
            return instr.text; // fallback
    }

    // 👉 straatnaam toevoegen
    if (instr.road) {
        text += ' op ' + instr.road;
    }

    return text;
};

function vertaalRichtingNL(dir) {
    const map = {
        N: 'noord',
        NE: 'noordoost',
        E: 'oost',
        SE: 'zuidoost',
        S: 'zuid',
        SW: 'zuidwest',
        W: 'west',
        NW: 'noordwest'
    };
    return map[dir] || dir;
}

  routingControl = L.Routing.control({
    waypoints: points,
    router: L.Routing.osrmv1({
        serviceUrl: "https://routing.openstreetmap.de/routed-foot/route/v1",
        profile: "foot"
    }),
    formatter: formatterNL,
    
    routeWhileDragging: false,
    optimizeWaypoints: true,
    reorderWaypoints: true
  }).addTo(routeMap);

    
  routingControl.on("routesfound", function(e) {
  const route = e.routes[0];
  routeMap.fitBounds(L.polyline(route.coordinates).getBounds());

});

})

async function loadStripmuren(params) {

  try {
    const murals = await fetchMurals();

    const muralsWithPhoto = murals.filter(m => m.image && m.image.url); //stripmuren zonder foto zijn niet mooi dus eruit

    allMurals = muralsWithPhoto;

    statusElement.textContent = `Totaal Aantal stripmuren: ${muralsWithPhoto.length}`;

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

