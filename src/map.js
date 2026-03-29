'use strict';

export let muralMarkers = {};
let markersLayer;

export function initMap(map) {
  markersLayer = L.featureGroup().addTo(map);
}

export function renderMap(map, murals, favoriteMurals, iconNormal, iconFavo) {
  //Leaflet toevoegen
  

  markersLayer.clearLayers();
  muralMarkers = {};
  // alles markeren en tonen
  for (let mural of murals) {
    
    const muralId = mural.image?.id;
    const isFav = muralId && favoriteMurals.includes(String(muralId));

    const myIcon = isFav ? iconFavo : iconNormal;

    let marker = L.marker([mural.geo_point.lat, mural.geo_point.lon], { icon: myIcon }).addTo(markersLayer);

    marker.bindPopup(mural.naam_fresco_nl);

    
    if (muralId) { muralMarkers[muralId] = marker; };

  }

 
  let bounds = markersLayer.getBounds();
  map.fitBounds(bounds);
}