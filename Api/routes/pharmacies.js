/*
  ============================================================
  routes/pharmacies.js — Les routes de l'API
  
  QU'EST-CE QU'UNE ROUTE ?
  Une route = une URL + une méthode HTTP + une action.
  
  Ex : GET /api/pharmacies
       ─── méthode HTTP (lecture)
           ─────────────── URL
  
  MÉTHODES HTTP :
  GET    → lire des données (pas de modification)
  POST   → créer une nouvelle ressource
  PATCH  → modifier partiellement une ressource existante
  DELETE → supprimer une ressource
  
  PARAMÈTRES D'URL :
  /api/pharmacies/:id   → :id est un paramètre dynamique
                          /api/pharmacies/6 → req.params.id = "6"
  
  QUERY STRINGS :
  /api/pharmacies?garde=true → req.query.garde = "true"
  /api/pharmacies?q=paracetamol → req.query.q = "paracetamol"
  ============================================================
*/

const express = require('express');

/*
  express.Router() crée un "mini-routeur" isolé.
  On définit les routes ici, puis on les "monte" dans server.js
  sous le préfixe /api.
  
  Avantage : si on veut changer /api en /v1, on change
  une seule ligne dans server.js.
*/
const router = express.Router();

/* Import des données (notre "base de données" en mémoire) */
const pharmacies = require('../data/pharmacies');


/* ═══════════════════════════════════════════════════
   ROUTE 1 : GET /api/pharmacies
   Retourne toutes les pharmacies, avec filtres optionnels
   
   Exemples d'appels :
   GET /api/pharmacies              → toutes les pharmacies
   GET /api/pharmacies?garde=true   → seulement celles de garde
   GET /api/pharmacies?q=mavré      → recherche par nom/quartier
   GET /api/pharmacies?arr=3        → filtre par arrondissement
═══════════════════════════════════════════════════ */
router.get('/', (req, res) => {

  /*
    On commence avec toutes les pharmacies.
    On va filtrer progressivement selon les query params reçus.
    
    [...pharmacies] crée une copie du tableau.
    Si on modifiait directement `pharmacies`, les filtres
    s'accumuleraient entre les requêtes → bug.
  */
  let resultats = [...pharmacies];

  /* Filtre 1 : seulement de garde */
  if (req.query.garde === 'true') {
    resultats = resultats.filter(p => p.deGarde === true);
  }

  /* Filtre 2 : recherche textuelle sur nom, quartier, arrondissement */
  if (req.query.q) {
    const terme = req.query.q.toLowerCase().trim();
    resultats = resultats.filter(p =>
      p.nom.toLowerCase().includes(terme)          ||
      p.quartier.toLowerCase().includes(terme)     ||
      p.arrondissement.toLowerCase().includes(terme)
    );
  }

  /* Filtre 3 : par arrondissement exact */
  if (req.query.arr) {
    resultats = resultats.filter(p =>
      p.arrondissement === req.query.arr
    );
  }

  /*
    On retourne les pharmacies SANS le catalogue pour alléger la réponse.
    Le catalogue complet sera chargé seulement quand l'utilisateur
    clique sur une pharmacie spécifique (route 2).
    
    map() crée un nouveau tableau en transformant chaque élément.
    On utilise la déstructuration : { catalogue, ...reste }
    catalogue reçoit le tableau de médicaments → on l'exclut
    ...reste reçoit toutes les autres propriétés → on les garde
  */
  const resultatsLegers = resultats.map(({ catalogue, ...reste }) => reste);

  /*
    res.json() sérialise l'objet en JSON et envoie la réponse HTTP.
    Express ajoute automatiquement le header Content-Type: application/json
  */
  res.json({
    total: resultatsLegers.length,
    garde: resultatsLegers.filter(p => p.deGarde).length,
    pharmacies: resultatsLegers
  });
});


/* ═══════════════════════════════════════════════════
   ROUTE 2 : GET /api/pharmacies/:id
   Retourne UNE pharmacie avec son catalogue complet
   
   Exemple : GET /api/pharmacies/6
   → retourne la pharmacie id=6 avec tous ses médicaments
═══════════════════════════════════════════════════ */
router.get('/:id', (req, res) => {

  /*
    req.params.id est une CHAÎNE DE CARACTÈRES ("6").
    On doit convertir en nombre avec parseInt() pour comparer
    avec pharmacie.id qui est un nombre (6).
    
    Sans parseInt : "6" === 6 → false (types différents) → bug
    Avec parseInt  :  6  === 6 → true → ça marche
  */
  const id = parseInt(req.params.id, 10);

  /* find() retourne le premier élément qui satisfait la condition */
  const pharmacie = pharmacies.find(p => p.id === id);

  /* Si aucune pharmacie avec cet id, on retourne une erreur 404 */
  if (!pharmacie) {
    return res.status(404).json({
      erreur: `Pharmacie avec l'id ${id} introuvable`
    });
  }

  /* Ici on retourne TOUT, y compris le catalogue */
  res.json(pharmacie);
});


/* ═══════════════════════════════════════════════════
   ROUTE 3 : GET /api/pharmacies/:id/catalogue
   Recherche un médicament dans le catalogue d'une pharmacie
   
   Exemple : GET /api/pharmacies/6/catalogue?q=paracetamol
   → retourne les médicaments correspondants dans la pharmacie 6
═══════════════════════════════════════════════════ */
router.get('/:id/catalogue', (req, res) => {

  const id = parseInt(req.params.id, 10);
  const pharmacie = pharmacies.find(p => p.id === id);

  if (!pharmacie) {
    return res.status(404).json({ erreur: 'Pharmacie introuvable' });
  }

  let catalogue = [...pharmacie.catalogue];

  /* Filtre par nom de médicament */
  if (req.query.q) {
    const terme = req.query.q.toLowerCase().trim();
    catalogue = catalogue.filter(med =>
      med.nom.toLowerCase().includes(terme) ||
      med.categorie.toLowerCase().includes(terme)
    );
  }

  /* Filtre : seulement les disponibles */
  if (req.query.disponible === 'true') {
    catalogue = catalogue.filter(med => med.disponible);
  }

  res.json({
    pharmacie: pharmacie.nom,
    total: catalogue.length,
    medicaments: catalogue
  });
});


/* ═══════════════════════════════════════════════════
   ROUTE 4 : GET /api/recherche-medicament
   Cherche un médicament dans TOUTES les pharmacies
   
   Exemple : GET /api/recherche-medicament?q=artemether&garde=true
   → retourne toutes les pharmacies (de garde) qui ont ce médicament
═══════════════════════════════════════════════════ */
router.get('/medicament/recherche', (req, res) => {

  if (!req.query.q) {
    return res.status(400).json({ erreur: 'Paramètre q requis' });
  }

  const terme = req.query.q.toLowerCase().trim();
  let sources = pharmacies;

  /* Optionnellement filtrer par statut de garde */
  if (req.query.garde === 'true') {
    sources = sources.filter(p => p.deGarde);
  }

  /* Pour chaque pharmacie, cherche dans son catalogue */
  const resultats = sources
    .map(p => {
      const medicamentsTrouves = p.catalogue.filter(med =>
        med.nom.toLowerCase().includes(terme) ||
        med.categorie.toLowerCase().includes(terme)
      );

      /* Si aucun médicament trouvé dans cette pharmacie, on l'exclut */
      if (medicamentsTrouves.length === 0) return null;

      /* On retourne les infos de la pharmacie + les médicaments trouvés */
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
    /* .filter(Boolean) supprime les null (pharmacies sans résultat) */
    .filter(Boolean);

  res.json({
    terme,
    total: resultats.length,
    resultats
  });
});


/* Export du router pour server.js */
module.exports = router;
