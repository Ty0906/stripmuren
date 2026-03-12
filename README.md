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

