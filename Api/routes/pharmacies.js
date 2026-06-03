// mes routes liées aux pharmacies, regroupées dans ce fichier pour plus de clarté
const express = require('express');

// On crée un router Express pour définir nos routes liées aux pharmacies.
const router = express.Router();

// importation de notre "base de données" de pharmacies (fichier JSON)
const pharmacies = require('../data/pharmacies');


// route 1 : GET /api/pharmacies
// retourne la liste des pharmacies, avec des filtres optionnels
router.get('/', (req, res) => {

// je commence par faire une copie du tableau de pharmacies pour pouvoir le filtrer sans toucher à l'original
  let resultats = [...pharmacies];

  if (req.query.garde === 'true') {
    resultats = resultats.filter(p => p.deGarde === true);
  }

  if (req.query.q) {
    const terme = req.query.q.toLowerCase().trim();
    resultats = resultats.filter(p =>
      p.nom.toLowerCase().includes(terme)          ||
      p.quartier.toLowerCase().includes(terme)     ||
      p.arrondissement.toLowerCase().includes(terme)
    );
  }

  if (req.query.arr) {
    resultats = resultats.filter(p =>
      p.arrondissement === req.query.arr
    );
  }

  const resultatsLegers = resultats.map(({ catalogue, ...reste }) => reste);

  res.json({
    total: resultatsLegers.length,
    garde: resultatsLegers.filter(p => p.deGarde).length,
    pharmacies: resultatsLegers
  });
});


// route 2 : GET /api/pharmacies/:id
// retourne les détails d'une pharmacie, y compris son catalogue
router.get('/:id', (req, res) => {

  const id = parseInt(req.params.id, 10);

  const pharmacie = pharmacies.find(p => p.id === id);

  if (!pharmacie) {
    return res.status(404).json({
      erreur: `Pharmacie avec l'id ${id} introuvable`
    });
  }

  res.json(pharmacie);
});

// route 3 : GET /api/pharmacies/:id/catalogue
// retourne le catalogue d'une pharmacie, avec des filtres optionnels
router.get('/:id/catalogue', (req, res) => {

  const id = parseInt(req.params.id, 10);
  const pharmacie = pharmacies.find(p => p.id === id);

  if (!pharmacie) {
    return res.status(404).json({ erreur: 'Pharmacie introuvable' });
  }

  let catalogue = [...pharmacie.catalogue];

  if (req.query.q) {
    const terme = req.query.q.toLowerCase().trim();
    catalogue = catalogue.filter(med =>
      med.nom.toLowerCase().includes(terme) ||
      med.categorie.toLowerCase().includes(terme)
    );
  }

  if (req.query.disponible === 'true') {
    catalogue = catalogue.filter(med => med.disponible);
  }

  res.json({
    pharmacie: pharmacie.nom,
    total: catalogue.length,
    medicaments: catalogue
  });
});

// route 4 : GET /api/pharmacies/medicament/recherche?q=...
// recherche un médicament dans toutes les pharmacies, avec des filtres optionnels
router.get('/medicament/recherche', (req, res) => {

  if (!req.query.q) {
    return res.status(400).json({ erreur: 'Paramètre q requis' });
  }

  const terme = req.query.q.toLowerCase().trim();
  let sources = pharmacies;

  if (req.query.garde === 'true') {
    sources = sources.filter(p => p.deGarde);
  }

  const resultats = sources
    .map(p => {
      const medicamentsTrouves = p.catalogue.filter(med =>
        med.nom.toLowerCase().includes(terme) ||
        med.categorie.toLowerCase().includes(terme)
      );

      if (medicamentsTrouves.length === 0) return null;

      return {
        pharmacieId: p.id,
        pharmacieNom: p.nom,
        quartier: p.quartier,
        telephone: p.telephone,
        deGarde: p.deGarde,
        lat: p.lat,
        lng: p.lng,
        medicaments: medicamentsTrouves
      };
    })

    .filter(Boolean);

  res.json({
    terme,
    total: resultats.length,
    resultats
  });
});


// exportation du router pour pouvoir l'utiliser dans notre application Express principale (app.js)
module.exports = router;
