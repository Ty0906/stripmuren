'use strict';

import './style.css';

import { fetchMurals } from "./api.js";
import { renderMurals } from "./render.js";
import { createFormatterNL, createFormatterFR } from './language.js';
import { renderMap, muralMarkers, initMap } from './map.js';

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1';



// HTML elementen
const statusElement = document.getElementById("status");
const langNL = document.getElementById("NL");
const langFR = document.getElementById("FR");

console.log("NL button =", langNL);
console.log("FR button =", langFR);

const searchInputElement = document.getElementById("search-murals");
const sortOption = document.getElementById("sort-murals");
const filterFavo = document.getElementById("filter-favorites");

const calcRoute = document.getElementById('calc-route');
const layout = document.body;





// MAP (LeafletMap/LeafletRouteMap) variabelen

let map = L.map('map').setView([50.8503396, 4.3517103], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

initMap(map);

const iconNormal = L.icon({ 
  iconUrl: "/icon.svg",
  iconSize: [28, 28],
 iconAnchor: [14, 14]
 });

 let iconFavo = L.divIcon({
  className: "fav-marker",
  html: `<span class="iconFavo">❤️</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
 });

// DATA / LOCAL STORAGE (favo & taal)

let allMurals = [];
// favoriete stripmuren in localStorage
let favoriteMurals = JSON.parse(localStorage.getItem('favoriteMurals')) || [];
favoriteMurals = favoriteMurals.filter(id => id && id !== "undefined" && id !== "null");
localStorage.setItem('favoriteMurals', JSON.stringify(favoriteMurals));

let currentLang = localStorage.getItem("preferredLanguage") || "NL";


// OBSERVER



function lazyLoading() {
  // Elementen detecteren die in beeld komen
    const lazyImages = document.querySelectorAll(".lazy-img[data-src]");
 
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) { return; }
          // Element is in beeld
          const img = entry.target;
          
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          
          // Stop met observeren nadat de afbeelding is geladen
          lazyObserver.unobserve(img);
        }
      );
    }, {
      // Opties
      rootMargin: '100px 0px', 
      threshold: 0.1 
    });
    
    // Start met observeren
    lazyImages.forEach(img => lazyObserver.observe(img));
    
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("preferredLanguage", lang);
  document.getElementById("NL").classList.remove("active");
  document.getElementById("FR").classList.remove("active");
  let murals = getMurals();
  if (lang == "NL") {
    document.getElementById("NL").classList.add("active");
    if (!filterFavo || !filterFavo.checked) {
    statusElement.textContent = `Totaal Aantal Stripmuren: ${murals.length}`;
    }
    else {
    statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${murals.length}`;
    }
     
  
    document.querySelector("h1").textContent = "Stripmuren Brussel Routeplanner";
    document.querySelector('label[for="filter-favorites"]').textContent = "Toon enkel Favoriete Stripmuren ❤️";
    document.querySelector('label[for="search-murals"]').textContent = "Zoeken: ";
    document.querySelector('label[for="sort-murals"]').textContent = "Sorteren op: ";
    document.querySelector('#sort-murals option[value="titel"]').textContent = "Titel";
    document.querySelector('#sort-murals option[value="tekenaar"]').textContent = "Tekenaar";

    calcRoute.textContent = "Bereken route";
  }
  else {
    document.getElementById("FR").classList.add("active");
    if (!filterFavo || !filterFavo.checked) {
    statusElement.textContent = `Nombre Total de Fresques: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre de Fresques Favorites ❤️: ${murals.length}`;
     }
    document.querySelector("h1").textContent = "Parcours des fresques de Bruxelles";
    document.querySelector('label[for="filter-favorites"]').textContent = "Afficher seulement les fresques favorites ❤️";
    document.querySelector('label[for="search-murals"]').textContent = "Chercher: ";
    document.querySelector('label[for="sort-murals"]').textContent = "Trier par: ";
    document.querySelector('#sort-murals option[value="titel"]').textContent = "Titre";
    document.querySelector('#sort-murals option[value="tekenaar"]').textContent = "Dessinateur";
    calcRoute.textContent = "Calculer l'itinéraire";
  }
  
  renderMurals(getMurals(), favoriteMurals, currentLang);
  lazyLoading();
}


function getMurals() {

  let searchInput = searchInputElement.value;
  searchInput = searchInput.toLowerCase();

  let sortResult = [...allMurals];
  let newMurals = [];

  if (filterFavo && filterFavo.checked) {

    for (let fm of allMurals) {
      let muralImageId = fm?.image?.id;
      if (!muralImageId) continue;

      muralImageId = String(muralImageId);
      if (favoriteMurals.includes(muralImageId)) {
        newMurals.push(fm);

      }
    }
    sortResult = [...newMurals];
  }

  if (searchInput.length > 0) {
    let searchResult = [];

    for (let mural of sortResult) {
      let json = JSON.stringify(mural).toLowerCase();
      if (json.includes(searchInput)) {
        searchResult.push(mural);
      }
    }

    sortResult = searchResult;
  }

  const sortValue = sortOption.value;


  if (sortValue == "titel") {
    sortResult.sort((a, b) => (a.naam_fresco_nl || "").localeCompare(b.naam_fresco_nl || "", 'nl', { sensitivity: 'base' })
    );
  }

  if (sortValue == "tekenaar") {
    sortResult.sort((a, b) => (a.dessinateur || "").localeCompare(b.dessinateur || "", 'nl', { sensitivity: 'base' })
    );
  }

  return sortResult;

}






//EVENTS

// Event listener voor TAAL (click)

langNL.addEventListener("click", () => switchLanguage("NL"));
langFR.addEventListener("click", () => switchLanguage("FR"));

// Event listener voor ZOEKEN (input)

searchInputElement.addEventListener("input", () => {
  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();
  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo);

  if (!filterFavo || !filterFavo.checked) {
    if (currentLang == "NL") {
    statusElement.textContent = `Totaal Aantal Stripmuren: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre Total de Fresques: ${murals.length}`;
    }
  }
  else {
     if (currentLang == "NL") {
    statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${murals.length}`;
     }
     else {
      statusElement.textContent = `Nombre de Fresques Favorites ❤️: ${murals.length}`;
     }
  }
});

// Event listener voor SORTEREN (change)

sortOption.addEventListener("change", () => {
  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();
  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo);
})

// Event listener voor FILTER FAVORIETEN (change)

filterFavo.addEventListener('change', () => {

  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();


  if (!filterFavo || !filterFavo.checked) {
    if (currentLang == "NL") {
      statusElement.textContent = `Totaal Aantal Stripmuren: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre Total de Fresques: ${murals.length}`;
    }
    layout.classList.remove("favorites-checked");
    calcRoute.style.display = "none";
    

    if (routingControl) {
      map.removeControl(routingControl);
    }

  }
  else {
    if (currentLang == "NL") {
    statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre de Fresques Favorites ❤️: ${murals.length}`;
    }
    layout.classList.add("favorites-checked");
    calcRoute.style.display = "inline-block";
  }

  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo);
});

// Event listener voor AANPASSEN FAVORIETEN + POPUP KAART


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

    let murals = getMurals();
    if (!filterFavo || !filterFavo.checked) {
      if (currentLang == "NL") {
    statusElement.textContent = `Totaal Aantal Stripmuren: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre Total de Fresques: ${murals.length}`;
    }
      
      layout.classList.remove("favorites-checked");
      calcRoute.style.display = "none";
    }
    else {
      renderMurals(getMurals(), favoriteMurals, currentLang);
      lazyLoading();
      if (currentLang == "NL") {
    statusElement.textContent = `Aantal Favoriete Stripmuren ❤️: ${murals.length}`;
    }
    else {
      statusElement.textContent = `Nombre de Fresques Favorites ❤️: ${murals.length}`;
    }
      
      layout.classList.add("favorites-checked");
      calcRoute.style.display = "inline-block";

    }

    renderMap(map, murals, favoriteMurals, iconNormal, iconFavo);

    return;
  }


  // Popup openen (tonen op kaart) bij klik

  const muralCard = event.target.closest('.mural-body');
  if (!muralCard) return;
  muralMarkers[(muralCard.getAttribute('data-id'))].openPopup();

});


// Eventlistener actieknop 'bereken route' (click)

let routingControl;

calcRoute.addEventListener('click', () => {

  const points = [];

  for (let id of favoriteMurals) {
    const marker = muralMarkers[id];

    if (marker) {

      const latLng = marker.getLatLng();
      points.push(latLng);
    }
  }

  if (points.length < 2) { alert(currentLang == "NL" 
    ? "Je moet minstens 2 favoriete stripmuren hebben om een route te berekenen!"
    : "Vous devez avoir au mons 2 fresques favorites pour calculer un itinéraire!");
   return; }


  if (routingControl) {
    map.removeControl(routingControl);
  }

  let formatterLang = createFormatterNL();
  if (currentLang == "FR") { formatterLang = createFormatterFR(); }
  
  
  routingControl = L.Routing.control({
    waypoints: points,
    router: L.Routing.osrmv1({
      serviceUrl: "https://routing.openstreetmap.de/routed-foot/route/v1",
      profile: "foot"
    }),
    formatter: formatterLang,

    routeWhileDragging: false,
    optimizeWaypoints: true,
    reorderWaypoints: true
  }).addTo(map);


  routingControl.on("routesfound", function (e) {
    const route = e.routes[0];
    map.fitBounds(L.polyline(route.coordinates).getBounds());

  });
});



async function loadMurals(params) {

  try {
    const murals = await fetchMurals();

    const muralsWithPhoto = murals.filter(m => m.image && m.image.url); //stripmuren zonder foto zijn niet mooi dus eruit

    allMurals = muralsWithPhoto;

    if (currentLang == "NL") {
    statusElement.textContent = `Totaal Aantal Stripmuren: ${muralsWithPhoto.length}`;
    }
    else {
      statusElement.textContent = `Nombre Total de Fresques: ${muralsWithPhoto.length}`;
    }
   
    
    renderMurals(getMurals(), favoriteMurals, currentLang);
    lazyLoading();
    renderMap(map, getMurals(), favoriteMurals, iconNormal, iconFavo);

    //resultaten in DOM tonen
    console.log(allMurals);
    console.log("favorieten: " + favoriteMurals);

  }

  catch (error) {
    console.log('Fout bij ophalen:' + error);

    statusElement.textContent = "Fout opgetreden bij het laden van de data";
  }

}



switchLanguage(currentLang);
loadMurals();

