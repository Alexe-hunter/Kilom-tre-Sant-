// point d'entrée backend local de l'application
const API_URL = 'http://localhost:3000/api';



/** recuperation de la liste des pharmacies avec les filtres de recherche
 * @param {Object} options 
 * @param {boolean} options.gardeOnly   
 * @param {string}  options.recherche   
 * @param {string}  options.arrondissement 
 * @returns {Promise<Object>} 
 */

// fonction asynchrone pour récupérer les pharmacies depuis l'API
async function fetchPharmacies(options = {}) {
  try {
    const params = new URLSearchParams();

    if (options.gardeOnly) params.set('garde', 'true');
    if (options.recherche) params.set('q', options.recherche);
    if (options.arrondissement && options.arrondissement !== 'tous') {
      params.set('arr', options.arrondissement);
    }

    const queryString = params.toString();
    const url = `${API_URL}/pharmacies${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('fetchPharmacies :', error);
    return { total: 0, garde: 0, pharmacies: [] };
  }
}


/** recuperation des details d'une pharmacie par son id
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function fetchPharmacieDetail(id) {
  try {
    const response = await fetch(`${API_URL}/pharmacies/${id}`);

    if (!response.ok) {
      throw new Error(`Pharmacie ${id} introuvable`);
    }

    return await response.json();

  } catch (error) {
    console.error('fetchPharmacieDetail :', error);
    return null;
  }
}


/** pour la recupération des médicaments disponibles dans les pharmacies
 * @param {string}  terme
 * @param {boolean} gardeOnly
 * @returns {Promise<Object>} 
 */
async function rechercherMedicament(terme, gardeOnly = false) {
  try {
    const params = new URLSearchParams({ q: terme });
    if (gardeOnly) params.set('garde', 'true');

    const response = await fetch(
      `${API_URL}/pharmacies/medicament/recherche?${params.toString()}`
    );

    if (!response.ok) throw new Error('Erreur recherche médicament');

    return await response.json();

  } catch (error) {
    console.error('rechercherMedicament :', error);
    return { terme, total: 0, resultats: [] };
  }
}
