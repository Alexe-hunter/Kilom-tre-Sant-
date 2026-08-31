// Détermination de l'URL de l'API (configurable depuis l'hébergement)
// Priorité:
// 1. window.__API_BASE__ (peut être défini par l'hébergeur via un petit script)
// 2. meta[name="api-base"] content
// 3. même origine + '/api' (pratique si front et back sont sur le même domaine)
// 4. fallback vers localhost pour le développement
const API_URL = (function () {
  try {
    if (typeof window !== 'undefined' && window.__API_BASE__) return String(window.__API_BASE__).replace(/\/+$/, '');
    const meta = (typeof document !== 'undefined') && document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return String(meta.content).replace(/\/+$/, '');
    if (typeof location !== 'undefined' && location.origin) return `${location.origin}/api`;
  } catch (e) {
    // ignore
  }
  return 'http://localhost:3000/api';
})();



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
    console.warn('API non accessible, utilisation des données locales:', error);
    // Fallback vers les données locales
    return window.getLocalPharmacies ? window.getLocalPharmacies(options) : { total: 0, garde: 0, pharmacies: [] };
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
    console.warn('API non accessible, utilisation des données locales:', error);
    // Fallback vers les données locales
    return window.getLocalPharmacieDetail ? window.getLocalPharmacieDetail(id) : null;
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
    console.warn('API non accessible, utilisation des données locales:', error);
    // Fallback vers les données locales
    return window.rechercherMedicamentLocal ? window.rechercherMedicamentLocal(terme, gardeOnly) : { terme, total: 0, resultats: [] };
  }
}
