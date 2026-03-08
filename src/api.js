'use strict';

// Stripmuren ophalen via API

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=-1';

export async function fetchMurals(params) {
    

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API_URL fout ${response.status}`);
    }

    const data = await response.json();
    const murals = data.results; 
    return murals;
}

