# Stripmuren Brussel Routeplanner



*Persoonlijke noot:*
    *Ik heb voor deze applicatie gekozen omdat ik deze stripmuren al zelf heb bezocht.*
    *Eén van de zaken die ik toen op de bestaande website ook al gemerkt had is dat je wel een kaartje hebt met de locatie van de bestaande stripmuren, maar dat je zelf je route moet gaan "puzzelen".*
*
    *Het was dan ook een leuke uitdaging om hieraan een oplossing te kunnen bieden en de opdracht binnen het vak Advanced Web te kunnen ontwikkelen met een persoonlijke motivatie.*
    *Deze website ga ik heel waarschijnlijk wel nog gebruiken als we terug een uitje Brussel plannen.*



## 1. Projectbeschrijving

Stripmuren Brussel Routeplanner is een interactieve (single-page) webapplicatie die gebruikers toelaat om de beroemde stripmuren in Brussel te ontdekken én een route tussen hun favoriete muren te genereren. 
De applicatie haalt de werkelijke data op via de Open Data Brussels API en combineert een lijstweergave met een interactieve kaart (Leaflet).

Gebruikers kunnen:
    - stripmuren bekijken en uitgebreid verkennen in een overzichtelijke kaart- en lijstweergave 
    - zoeken, sorteren en filteren
    - favoriete stripmuren opslaan
    - hun voorkeur (taal, favorieten) bewaren tussen sessies
    - een wandelroute berekenen langs hun favoriete stripmuren


### Functionaliteiten 




## 2. Gebruikte API's met links

Dataset: bruxelles_parcours_bd

Bron: Opendata.brussels.be

URL: https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1

Dataset:
- naam van de stripmuur (NL/FR)
- Tekenaar 
- adres (NL/FR)
- gemeente (NL/FR)
- foto/afbeelding
- meer info (externe link naar officiële website)
- Geo-locatie (lat / lon)

## 3. Implementatie van technische vereiste

1. DOM-manipulatie:

    Selecteren van elementen: 
        - main.js lijnnr 13-22, 101-102, 105-125 (document.getElementById, querySelector, ClassList)
        - render.js lijnnr 87
    Renderen van HTML kaarten: 
        - file render.js: lijnnr 30-35 + 54-94
    Event listeners:
        - main.js lijnnr 213-214 & 273 & 346 = click events (taal en favorieten en popup kaart en bereken route)
        - main.js lijnr 218 = input event (zoeken)
        - main.js lijnnr 230 & 240  = change event (sorteren en filteren favorieten)


2. Modern JavaScript:

    - const:
        - api.js lijnnr 5 & 10 & 16 & 17
        - language.js lijnnr 6 & 191
        - main.js lijnnr 13-41 & 128 & 187 & 219 & 231 & 242 & 275 & 279 & 302 & 327 & 336 & 348 & 351 & 355 & 399 & 403 & 404 & 416 & 418 & 422
        - map.js lijnnr 19-22 & 39

    - let:
        - main.js lijnnr 50-61
        - render.js lijnnr 5-49 & 87

    - template literals:
        - api.js lijnnr 13
        - main.js lijnnr 41 & 140-141 & 146-147 
        - render.js lijnnr 30-35 & 54-81

    - iteratie over arrays

    - array methodes

    - arrow functions

    - conditional (ternary) operator (moderne if..else)

    - Callback functions

    - async/await/callback

    - Observer API

    - Local Storage


3. Data & API:

    - Fetch API

    - JSON 

4. Opslag en validatie

    - Formulier validatie

    - Local Storage

5. Styling:

    - basis HTML layout
    - CSS basis
    - Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes,..)
    - Responsive design

6. Tooling & structuur:

    - Project is opgezet met Vite

    - Correcte folderstructuur
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

Cartoon Bubble by Samy Menai from "https://thenounproject.com/browse/icons/term/cartoon-bubble/" title="Cartoon Bubble Icons" Noun Project (CC BY 3.0) => zie icon.svg

comic talk by Andy Horvath from "https://thenounproject.com/browse/icons/term/comic-talk/" title="comic talk Icons" Noun Project (CC BY 3.0) => zie lazy.svg


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
11. LazyImage Observer: https://chatgpt.com/share/69c8fe0d-37d0-8387-a20c-07e2a29b984e
    - vooral cursus gevolgd maar vraag gesteld over hoe ik dit kon zien (mijn vermoeden: achtergrond = correct = kleine css aanpassing gedaan)
12. LazyImage Observer: https://chatgpt.com/share/69c91f9e-ed78-8331-be13-73f93145382d
    - nog een fout met de taal, bleek een lazyObserver vergeten te hebben (zelf gevonden nadat ik al taal had aangepast en niet bleek te werken)
13. Onderdrukken warning: https://chatgpt.com/share/69de1bb9-b830-8333-a29d-c38b91e05b49
    - OSRM gebruikt een demo server en geeft daarover telkens een warning in de F12: 
        besproken met docent: vermelden was ok/alert ook - hier toch gezorgd dat dit opgevangen werd
14. LazyImage Observer: https://chatgpt.com/share/69de2bf2-1278-8330-84d1-74766ff8936f 
    - ik kreeg telkens een unchecked runtime.lastError, na onderzoek bleek dat deze werd getriggered bij taalswitch. 
    - hulp gevraagd of hier iets kon aan gedaan worden, bleek dat de observer door de volledige re-render de boosdoener was
    - init observer afgesplitst van werkelijk laden lazyImage 


