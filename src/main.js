'use strict';

import './style.css';

import { fetchMurals } from "./api.js";
import { renderMurals } from "./render.js";
import { createFormatter } from './language.js';
import { renderMap, muralMarkers, initMap } from './map.js';



// HTML elementen
const statusElement = document.getElementById("status");
const langNL = document.getElementById("NL");
const langFR = document.getElementById("FR");

const searchInputElement = document.getElementById("search-murals");
const sortOption = document.getElementById("sort-murals");
const filterFavo = document.getElementById("filter-favorites");

const calcRoute = document.getElementById('calc-route');
const layout = document.body;

const toggleMapBtn = document.getElementById("toggle-map");
const header = document.querySelector(".header");


// MAP (LeafletMap/LeafletRouteMap) variabelen

const map = L.map('map').setView([50.8503396, 4.3517103], 13);
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

 const iconFavo = L.divIcon({
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


// OBSERVER init

let lazyObserver;

function initLazyLoading() {
  

  // Elementen detecteren die in beeld komen
    
 
     lazyObserver = new IntersectionObserver((entries) => {
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
}


function lazyLoading() {

   const lazyImages = document.querySelectorAll(".lazy-img[data-src]");
    // Start met observeren
    lazyImages.forEach(img => lazyObserver.observe(img));
    
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("preferredLanguage", lang);
  document.getElementById("NL").classList.remove("active");
  document.getElementById("FR").classList.remove("active");

  searchInputElement.placeholder =
  currentLang === "NL"
    ? "Zoek op titel of tekenaar"
    : "Rechercher par titre ou dessinateur";
  
  if (lang === "NL") {
    document.getElementById("NL").classList.add("active");
     
    document.querySelector("h1").textContent = "Stripmuren Brussel Routeplanner";
    document.querySelector('label[for="filter-favorites"]').textContent = "Toon enkel Favoriete Stripmuren ❤️";
    document.querySelector('label[for="search-murals"]').textContent = "Zoeken: ";
    document.querySelector('label[for="sort-murals"]').textContent = "Sorteren op: ";
    document.querySelector('#sort-murals option[value="titel"]').textContent = "Titel";
    document.querySelector('#sort-murals option[value="tekenaar"]').textContent = "Tekenaar";

    calcRoute.textContent = "Bereken route";
    calcRoute.title = "Bereken route";
  }
  else {
    document.getElementById("FR").classList.add("active");
    
    document.querySelector("h1").textContent = "Parcours des fresques de Bruxelles";
    document.querySelector('label[for="filter-favorites"]').textContent = "Afficher seulement les fresques favorites ❤️";
    document.querySelector('label[for="search-murals"]').textContent = "Chercher: ";
    document.querySelector('label[for="sort-murals"]').textContent = "Trier par: ";
    document.querySelector('#sort-murals option[value="titel"]').textContent = "Titre";
    document.querySelector('#sort-murals option[value="tekenaar"]').textContent = "Dessinateur";
    calcRoute.textContent = "Calculer l'itinéraire";
    calcRoute.title = "Calculer l'itinéraire";
  }
  
  const murals = getMurals();

  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();
  updateStatus(murals);
  updateToggleMapText();
  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang);
  updateRouteButton();
}

function updateStatus(murals) {

  if (!filterFavo || !filterFavo.checked) {
    statusElement.textContent =
      currentLang === "NL"
        ? `Totaal Aantal Stripmuren: ${murals.length}`
        : `Nombre Total de Fresques: ${murals.length}`;
  }
  else {
    statusElement.textContent =
      currentLang === "NL"
        ? `Aantal Favoriete Stripmuren ❤️: ${murals.length}`
        : `Nombre de Fresques Favorites ❤️: ${murals.length}`;
  }
}

function updateRouteButton() {
  
  const visibleMurals = getMurals();
  
  if (!filterFavo.checked) {
    calcRoute.disabled = true;
    calcRoute.title =
      currentLang === "NL"
        ? "Activeer favorieten om een route te berekenen"
        : "Activez les favoris pour calculer un itinéraire";
  } else if (visibleMurals.length < 2) {
    calcRoute.disabled = true;
    calcRoute.title =
      currentLang === "NL"
        ? "Selecteer minstens 2 favorieten"
        : "Sélectionnez au moins 2 favoris";
  } else {
    calcRoute.disabled = false;
    calcRoute.title =
      currentLang === "NL"
        ? "Bereken route"
        : "Calculer l'itinéraire";
  }
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
      const title = (mural.naam_fresco_nl || "").toLowerCase();
      const dessinateur = (mural.dessinateur || "").toLowerCase();
      if (title.includes(searchInput) || dessinateur.includes(searchInput)) {
        searchResult.push(mural);
      }
    }

    sortResult = searchResult;
  }

  const sortValue = sortOption.value;


  if (sortValue === "titel") {
    sortResult.sort((a, b) => (a.naam_fresco_nl || "").localeCompare(b.naam_fresco_nl || "", 'nl', { sensitivity: 'base' })
    );
  }

  if (sortValue === "tekenaar") {
    sortResult.sort((a, b) => (a.dessinateur || "").localeCompare(b.dessinateur || "", 'nl', { sensitivity: 'base' })
    );
  }

  return sortResult;

}


function updateToggleMapText() {
  const isCollapsed = header.classList.contains("map-collapsed");

  if (currentLang === "NL") {
      toggleMapBtn.textContent = isCollapsed
    ? "Kaart tonen ▼"
    : "Kaart verbergen ▲";
  } else {
      toggleMapBtn.textContent = isCollapsed
    ? "Afficher la carte ▼"
    : "Masquer la carte ▲";
  }

}



//EVENTS

// Event listener voor INKLAPBARE KAART (click)

toggleMapBtn.addEventListener("click", () => {
  header.classList.toggle("map-collapsed");

  updateToggleMapText();

  
  if (!header.classList.contains("map-collapsed")) {
    map.invalidateSize();
  }
})

// Event listener voor TAAL (click)

langNL.addEventListener("click", () => switchLanguage("NL"));
langFR.addEventListener("click", () => switchLanguage("FR"));

// Event listener voor ZOEKEN (input)

searchInputElement.addEventListener("input", () => {
  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();
  
  

  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang);

  updateStatus(murals);
  updateRouteButton();
});

// Event listener voor SORTEREN (change)

sortOption.addEventListener("change", () => {
  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();
  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang);
  updateStatus(murals);
  updateRouteButton();
})

// Event listener voor FILTER FAVORIETEN (change)

filterFavo.addEventListener('change', () => {

  const murals = getMurals();
  renderMurals(murals, favoriteMurals, currentLang);
  lazyLoading();


  if (!filterFavo || !filterFavo.checked) {

    
    layout.classList.remove("favorites-checked");

    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }

  }
  else {
    
    layout.classList.add("favorites-checked");
  } 

  updateStatus(murals);
  updateRouteButton();

  renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang);
});

// Event listener voor AANPASSEN FAVORIETEN + POPUP KAART (click)


document.addEventListener('click', function (event) {

  const btn = event.target.closest('.favorite-mural');

  if (btn) {

    const id = btn.getAttribute('data-id');

    if (!id || id === "undefined" || id === "null") { return; }

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

    const murals = getMurals();
    renderMurals(murals, favoriteMurals, currentLang);
    lazyLoading();
    updateStatus(murals);
    
    renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang);

    if (!filterFavo || !filterFavo.checked) {

      layout.classList.remove("favorites-checked");

    }
    else {
      layout.classList.add("favorites-checked");

    }
    
    updateRouteButton();

    return;
  }


  // Popup openen (tonen op kaart) bij klik

  const muralCard = event.target.closest('.mural-body');
  if (!muralCard) return;
  muralMarkers[(muralCard.getAttribute('data-id'))].openPopup();

});


// Warning negeren "pas op je gebruikt een demo server"

const originalWarn = console.warn;
console.warn = function (...args) {
  if (args[0] && args[0].includes('OSRM')) return;
  originalWarn.apply(console, args);
};

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

  if (points.length < 2) { alert(currentLang === "NL" 
    ? "Je moet minstens 2 favoriete stripmuren hebben om een route te berekenen!"
    : "Vous devez avoir au mons 2 fresques favorites pour calculer un itinéraire!");
   return; }


  if (routingControl) {
    map.removeControl(routingControl);
  }

  const formatterLang = createFormatter(currentLang);
   
  
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

  routingControl.on("routingerror", function (err) {
  console.error("Routing error:", err);

  alert(currentLang === "NL"
    ? "De route kon niet worden berekend. De server is mogelijk tijdelijk niet beschikbaar."
    : "L'itinéraire n'a pas pu être calculé. Le serveur est peut-être temporairement indisponible.");

  });

  routingControl.on("routesfound", function (e) {
    if (!e.routes || e.routes.length === 0) return;

    const route = e.routes[0];
    
    if (!route.coordinates || route.coordinates.length === 0) return;

    const polyline = L.polyline(route.coordinates);
    const bounds = polyline.getBounds();

    if (bounds.isValid()) { map.fitBounds(bounds);} 

  });
});



async function loadMurals() {

  try {
    const murals = await fetchMurals();

    const muralsWithPhoto = murals.filter(m => m.image && m.image.url); //stripmuren zonder foto zijn niet mooi dus eruit

    allMurals = muralsWithPhoto;

    const muralsFiltered = getMurals();

    renderMurals(muralsFiltered, favoriteMurals, currentLang);
    lazyLoading();
    renderMap(map, muralsFiltered, favoriteMurals, iconNormal, iconFavo, currentLang);
    updateStatus(muralsFiltered);
    updateRouteButton();

    //resultaten in DOM tonen
    console.log(allMurals);
    console.log("favorieten: " + favoriteMurals);

  }

  catch (error) {
    console.log('Fout bij ophalen:' + error);

    statusElement.textContent = "Fout opgetreden bij het laden van de data";
  }

}


initLazyLoading();
switchLanguage(currentLang);
updateRouteButton();
loadMurals();

