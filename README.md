# Stripmuren Brussel

Interactieve webapplicatie bouwen rond de stripmuren in Brussel


## 1. Projectbeschrijving

--

### Functionaliteiten 




## 2. Gebruikte API's met links

Dataset: bruxelles_parcours_bd

Bron: Opendata.brussels.be

URL: https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1

Dataset:
- naam van de stripmuur (NL)
- naam van de stripmuur (FR)
- Tekenaar 
- adres (NL)
- adres (FR)
- gemeente (NL)
- gemeente (FR)
- wijk 
- foto
- meer info (link naar officiële website)

## 3. Implementatie van technische vereiste

1. DOM-manipulatie:
    Genereren van kaarten

2. Modern JavaScript:
    - const/let
    - template literals(truthly/falsy/..)
    - async/await
    - Local Storage
    - externe link naar officiële website op elke stripmuur

3. Data & API:
    - Fetch API
    - JSON 

4. Styling:
   - CSS basis
   - Flexbox layout

---
## 4. Installatiehandleiding

1. Clone repository:
    git clone https://github.com/Ty0906/stripmuren.git
2. Juiste map selecteren:
    cd stripmuren
3. Dependecies:
    npm install
4. Dev server:
    npm run dev

---

## 5. Screenshots van de applicatie

---

## 6. Gebruikte bronnen

Open Data Brussels API

Documentatie uit de Canvas modules Web Advanced en Web Basic

MDN (topic: Array)

Leaflet: Quick Start + Documentation

### AI chatlog

Leaflet: basis opstelling: https://chatgpt.com/share/69b26476-1d48-800e-8cb1-ce34506716d3
    - geen resultaat: hulp gevraagd: lon/lat omgedraaid
    - geen resultaat: hulp gevraagd: icon was 0px = toegevoegd in css
    - gevraagd naar mogelijkheid om markers terug te resetten: LayerGroup toegevoegd
    - tip fitBounds toegevoegd
Leaflet: leaflet popup bij event (gekozen voor click): https://chatgpt.com/share/69b2eb14-8b9c-800e-a1e5-ddcca6ad0cdb
    - navraag hover event voor op map te tonen - gekozen voor toevoegen aan click
    - hulp voor id ophalen tov marker leaflet
Leaflet Routing Machine: https://chatgpt.com/share/69b43350-2b00-800e-ac10-ab6da021aaf3
    - navraag trage response: defer toegevoegd aan scripts
    - routing control toegevoegd om tragere kaart te vermijden
    - kortste route opties: standaard opties optimizeWaypoints: true en recorderWaypoints: true toegevoegd
    - routekaart automatisch laten inzoomen op route: fitBounds toegevoegd
    - tweede kaart aangemaakt maar dit zorgde voor geen Bounds meer 
        (oorzaak kaart nog niet opgebouwd, display none tot aan actie 'bereken route'):       
            invalidateSize met Timeout toegevoegd zodat fitBounds weer goedkwam
    - fitBounds werkende gekregen op Leaflet kaart: featureGroup() ipv layerGroup()  
Leaflet Routing Machine: https://chatgpt.com/share/69bd6b48-da68-800e-a723-a77ff05ac280
    - navraag classes/id's van LRM voor css verbetering: tekst van instructiepaneel was wit op witte achtergrond
    - navraag mogelijkheid vertalen naar NL: 
        na veel opzoekwerk (en verkeerde info van chat over localization) gevonden dat localization.js niet meer wordt gebruikt: (hier gevonden: [src/localization.js](https://github.com/perliedman/leaflet-routing-machine/blob/master/src/localization.js))
        ==> samen met chatgpt dan maar eigen formatter gemaakt met NL vertalingen gebaseerd op localization.js
Sortering toegevoegd: https://chatgpt.com/share/69c2aaa3-83f4-800e-a327-ffd7f6caf57c 
    - array sort op MDM gevonden - deze toegepast en dan laten checken 
    - suggesties voor localCompare gebruik gekregen - opgezocht op MDM en overgenomen van MDM, daarna laten checken
    - kleine verbetersuggesties overgenomen (opties bij localCompare toegevoegd & conditie gewijzigd
    - suggestie: array = [... array] toegepast voor bugs te voorkomen - navraag gedaan waarom dit beter is

