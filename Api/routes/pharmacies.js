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
      p.nom.toLowerCase().includes(terme) ||
      p.quartier.toLowerCase().includes(terme) ||
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


// Importation du middleware d'authentification
const { authMiddleware } = require('../middleware/auth');

// route 5 : POST /api/pharmacies (Ajouter une pharmacie) - Super Admin seulement
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ erreur: "Seul l'administrateur peut ajouter des pharmacies." });
  }

  const { nom, quartier, arrondissement, adresse, telephone, horaires, deGarde, lat, lng } = req.body;

  if (!nom || !quartier || !arrondissement || !lat || !lng) {
    return res.status(400).json({ erreur: "Les champs nom, quartier, arrondissement, latitude et longitude sont requis." });
  }

  const nouvelId = pharmacies.length > 0 ? Math.max(...pharmacies.map(p => p.id)) + 1 : 1;

  const nouvellePharmacie = {
    id: nouvelId,
    nom,
    quartier,
    arrondissement,
    adresse: adresse || "",
    telephone: telephone || "",
    horaires: horaires || "08h00 - 20h00",
    deGarde: deGarde === true || deGarde === 'true',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    catalogue: []
  };

  pharmacies.push(nouvellePharmacie);

  res.status(201).json({
    message: "Pharmacie ajoutée avec succès.",
    pharmacie: nouvellePharmacie
  });
});

// route 6 : PUT /api/pharmacies/:id (Modifier une pharmacie) - Super Admin ou Pharmacien de cette pharmacie
router.put('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = pharmacies.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erreur: "Pharmacie introuvable." });
  }

  // Vérification des droits
  if (req.user.role === 'pharmacien' && req.user.pharmacyId !== id) {
    return res.status(403).json({ erreur: "Vous n'êtes pas autorisé à modifier cette pharmacie." });
  }

  const pharmacie = pharmacies[index];
  const { nom, quartier, arrondissement, adresse, telephone, horaires, deGarde, lat, lng } = req.body;

  // Si c'est le super-admin, il peut tout changer. Si c'est le pharmacien, il peut changer horaires, garde, téléphone, adresse.
  if (req.user.role === 'super-admin') {
    if (nom) pharmacie.nom = nom;
    if (quartier) pharmacie.quartier = quartier;
    if (arrondissement) pharmacie.arrondissement = arrondissement;
    if (lat !== undefined) pharmacie.lat = parseFloat(lat);
    if (lng !== undefined) pharmacie.lng = parseFloat(lng);
  }

  if (adresse !== undefined) pharmacie.adresse = adresse;
  if (telephone !== undefined) pharmacie.telephone = telephone;
  if (horaires !== undefined) pharmacie.horaires = horaires;
  if (deGarde !== undefined) pharmacie.deGarde = (deGarde === true || deGarde === 'true');

  res.json({
    message: "Pharmacie mise à jour avec succès.",
    pharmacie: pharmacie
  });
});

// route 7 : DELETE /api/pharmacies/:id (Supprimer une pharmacie) - Super Admin seulement
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ erreur: "Seul l'administrateur peut supprimer des pharmacies." });
  }

  const id = parseInt(req.params.id, 10);
  const index = pharmacies.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erreur: "Pharmacie introuvable." });
  }

  pharmacies.splice(index, 1);

  res.json({
    message: "Pharmacie supprimée avec succès."
  });
});

// route 8 : PUT /api/pharmacies/:id/catalogue (Mettre à jour le catalogue) - Pharmacien de la pharmacie ou Super Admin
router.put('/:id/catalogue', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = pharmacies.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erreur: "Pharmacie introuvable." });
  }

  // Vérification des droits
  if (req.user.role === 'pharmacien' && req.user.pharmacyId !== id) {
    return res.status(403).json({ erreur: "Vous n'êtes pas autorisé à modifier le catalogue de cette pharmacie." });
  }

  const { medicaments } = req.body;
  if (!Array.isArray(medicaments)) {
    return res.status(400).json({ erreur: "Le champ medicaments doit être un tableau." });
  }

  pharmacies[index].catalogue = medicaments;

  res.json({
    message: "Catalogue mis à jour avec succès.",
    total: pharmacies[index].catalogue.length,
    medicaments: pharmacies[index].catalogue
  });
});

// exportation du router pour pouvoir l'utiliser dans notre application Express principale (app.js)
module.exports = router;
