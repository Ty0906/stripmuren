'use strict';

export let muralMarkers = {};
let markersLayer;

export function initMap(map) {
  markersLayer = L.featureGroup().addTo(map);
}

export function renderMap(map, murals, favoriteMurals, iconNormal, iconFavo, currentLang) {
  //Leaflet toevoegen
  

  markersLayer.clearLayers();
  muralMarkers = {};
  // alles markeren en tonen
  for (let mural of murals) {
    
    const muralId = mural.image?.id;
    const isFav = muralId && favoriteMurals.includes(String(muralId));

    const myIcon = isFav ? iconFavo : iconNormal;

    let marker = L.marker([mural.geo_point.lat, mural.geo_point.lon], { icon: myIcon }).addTo(markersLayer);

    const popupTitle = 
      currentLang === "NL"
      ? mural.naam_fresco_nl || "Titel onbekend"
      : mural.nom_de_la_fresque || "Titre inconnu (FR)";
    marker.bindPopup(popupTitle);

    
    if (muralId) { muralMarkers[muralId] = marker; };

  }

  
  if (markersLayer.getLayers().length === 0) {
    return;
  }


  const bounds = markersLayer.getBounds();

  if (bounds.isValid()) {
  map.fitBounds(bounds);
  }
}