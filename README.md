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

Leaflet en Leaflet Routing Machine sites: Quick Start + Documentation + GitHub

Cartoon Bubble by Samy Menai from "https://thenounproject.com/browse/icons/term/cartoon-bubble/" title="Cartoon Bubble Icons" Noun Project (CC BY 3.0)

### AI chatlog

0. Grid layout hulp gevraagd vooraf (nog geen account toen) zie zondag 8 maart 2026 wijzigingen in Git - maar deze heb ik zelf teruggedraaid omdat mijn eigen idee toch leuker was tov het overnemen van Grid layout (Grid layout hebben we niet gezien in cursus Web Basic, enkel flex) - zie post 9.
1. Leaflet: basis opstelling: https://chatgpt.com/share/69b26476-1d48-800e-8cb1-ce34506716d3
    - geen resultaat: hulp gevraagd: lon/lat omgedraaid
    - geen resultaat: hulp gevraagd: icon was 0px = toegevoegd in css
    - gevraagd naar mogelijkheid om markers terug te resetten: LayerGroup toegevoegd
    - tip fitBounds toegevoegd
2. Leaflet: leaflet popup bij event (gekozen voor click): https://chatgpt.com/share/69b2eb14-8b9c-800e-a1e5-ddcca6ad0cdb
    - navraag hover event voor op map te tonen - gekozen voor toevoegen aan click
    - hulp voor id ophalen tov marker leaflet
3. Leaflet Routing Machine: https://chatgpt.com/share/69b43350-2b00-800e-ac10-ab6da021aaf3
    - navraag trage response: defer toegevoegd aan scripts
    - routing control toegevoegd om tragere kaart te vermijden
    - kortste route opties: standaard opties optimizeWaypoints: true en recorderWaypoints: true toegevoegd
    - routekaart automatisch laten inzoomen op route: fitBounds toegevoegd
    - tweede kaart aangemaakt maar dit zorgde voor geen Bounds meer 
        (oorzaak kaart nog niet opgebouwd, display none tot aan actie 'bereken route'):       
            invalidateSize met Timeout toegevoegd zodat fitBounds weer goedkwam
    - fitBounds werkende gekregen op Leaflet kaart: featureGroup() ipv layerGroup()  
4. Leaflet Routing Machine: https://chatgpt.com/share/69bd6b48-da68-800e-a723-a77ff05ac280
    - navraag classes/id's van LRM voor css verbetering: tekst van instructiepaneel was wit op witte achtergrond
    - navraag mogelijkheid vertalen naar NL: 
        na veel opzoekwerk (en verkeerde info van chat over localization) gevonden dat localization.js niet meer wordt gebruikt: (hier gevonden: [src/localization.js](https://github.com/perliedman/leaflet-routing-machine/blob/master/src/localization.js))
        ==> samen met chatgpt dan maar eigen formatter gemaakt met NL vertalingen gebaseerd op localization.js
5. Sortering toegevoegd: https://chatgpt.com/share/69c2aaa3-83f4-800e-a327-ffd7f6caf57c 
    - array sort op MDN gevonden - deze toegepast en dan laten checken 
    - suggesties voor localCompare gebruik gekregen - opgezocht op MDN en overgenomen van MDN, daarna laten checken
    - kleine verbetersuggesties overgenomen (opties bij localCompare toegevoegd & conditie gewijzigd
    - suggestie: array = [... array] toegepast voor bugs te voorkomen - navraag gedaan waarom dit beter is
6. NL - FR toegevoegd: https://chatgpt.com/share/69c66a54-0510-838b-a98c-90585ce449a9
    - hulp bij foutmelding gevraagd (bleek typo te zijn)
    - suggesties voor codevermindering gevolgd
7. Leaflet Routing Machine: https://chatgpt.com/share/69c69b88-ee2c-8387-bbfe-20a03f34b001
    - navraag waarom sommige instructies nog niet werden vertaald en gecorrigeerd
    - copy/paste van de FR vertalingsinstructies die ik vroeg om ook aan te maken 
    (zie ook uitleg hierboven nr. 4 waarom eigen vertalingen nodig bleken)
8. Hulp checkbox styling css: https://chatgpt.com/share/69c6bcc5-abdc-8333-b9e2-cbb2070064b3
    - lelijke blauwe box vervangen door suggestie van chatGPT
9. CSS hulp: https://chatgpt.com/share/69c7dcde-8d00-8329-8aac-0890ae3dcb78 
    - eerst zelf grid teruggedraaid naar mijn eigen flex (zie post 0)
    - sticky - fixed probs met header en kaart opgelost
10. CSS hulp: https://chatgpt.com/share/69c8f066-d1b0-8328-b479-bd971f0dbd98
    - kleur hartje proberen te evenaren en toepassen in css


