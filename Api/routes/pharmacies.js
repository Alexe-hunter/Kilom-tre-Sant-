// mes routes liées aux pharmacies, regroupées dans ce fichier pour plus de clarté
const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// On crée un router Express pour définir nos routes liées aux pharmacies.
const router = express.Router();

// route 1 : GET /api/pharmacies
// retourne la liste des pharmacies, avec des filtres optionnels
router.get('/', async (req, res) => {
  try {
    // Par défaut, n'affiche que les pharmacies approuvées
    let query = 'SELECT id, nom, quartier, arrondissement, adresse, telephone, horaires, de_garde AS "deGarde", lat, lng FROM pharmacies WHERE approved = TRUE';
    const params = [];

    if (req.query.garde === 'true') {
      query += ' AND de_garde = TRUE';
    }

    if (req.query.q) {
      const terme = req.query.q.toLowerCase().trim();
      query += ` AND (LOWER(nom) LIKE $${params.length + 1} OR LOWER(quartier) LIKE $${params.length + 1} OR LOWER(arrondissement) LIKE $${params.length + 1})`;
      params.push(`%${terme}%`);
    }

    if (req.query.arr) {
      query += ` AND arrondissement = $${params.length + 1}`;
      params.push(req.query.arr);
    }

    query += ' ORDER BY nom';

    const result = await db.query(query, params);
    const pharmacies = result.rows;

    res.json({
      total: pharmacies.length,
      garde: pharmacies.filter(p => p.deGarde).length,
      pharmacies: pharmacies
    });
  } catch (err) {
    console.error('Erreur GET /api/pharmacies:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 2 : GET /api/pharmacies/:id
// retourne les détails d'une pharmacie, y compris son catalogue
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Récupérer la pharmacie
    const pharmaRes = await db.query(
      'SELECT id, nom, quartier, arrondissement, adresse, telephone, horaires, de_garde AS "deGarde", lat, lng FROM pharmacies WHERE id = $1',
      [id]
    );

    if (pharmaRes.rows.length === 0) {
      return res.status(404).json({
        erreur: `Pharmacie avec l'id ${id} introuvable`
      });
    }

    const pharmacie = pharmaRes.rows[0];

    // Récupérer le catalogue avec les médicaments
    const catalogRes = await db.query(
      `SELECT pm.produit_id as id, p.code, p.nom, p.categorie, pm.prix, pm.disponible
       FROM pharmacie_medicaments pm
       JOIN produits p ON pm.produit_id = p.id
       WHERE pm.pharmacie_id = $1
       ORDER BY p.nom`,
      [id]
    );

    pharmacie.catalogue = catalogRes.rows;

    res.json(pharmacie);
  } catch (err) {
    console.error('Erreur GET /api/pharmacies/:id:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 3 : GET /api/pharmacies/:id/catalogue
// retourne le catalogue d'une pharmacie, avec des filtres optionnels
router.get('/:id/catalogue', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Vérifier que la pharmacie existe
    const pharmaRes = await db.query('SELECT nom FROM pharmacies WHERE id = $1', [id]);
    if (pharmaRes.rows.length === 0) {
      return res.status(404).json({ erreur: 'Pharmacie introuvable' });
    }

    const pharmacieName = pharmaRes.rows[0].nom;

    // Récupérer le catalogue
    let catalogQuery = `SELECT pm.produit_id as id, p.code, p.nom, p.categorie, pm.prix, pm.disponible
                       FROM pharmacie_medicaments pm
                       JOIN produits p ON pm.produit_id = p.id
                       WHERE pm.pharmacie_id = $1`;
    const params = [id];

    if (req.query.q) {
      const terme = req.query.q.toLowerCase().trim();
      catalogQuery += ` AND (LOWER(p.nom) LIKE $${params.length + 1} OR LOWER(p.categorie) LIKE $${params.length + 1})`;
      params.push(`%${terme}%`);
    }

    if (req.query.disponible === 'true') {
      catalogQuery += ` AND pm.disponible = TRUE`;
    }

    catalogQuery += ' ORDER BY p.nom';

    const catalogRes = await db.query(catalogQuery, params);

    res.json({
      pharmacie: pharmacieName,
      total: catalogRes.rows.length,
      medicaments: catalogRes.rows
    });
  } catch (err) {
    console.error('Erreur GET /api/pharmacies/:id/catalogue:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 4 : GET /api/pharmacies/medicament/recherche?q=...
// recherche un médicament dans toutes les pharmacies, avec des filtres optionnels
router.get('/medicament/recherche', async (req, res) => {
  try {
    if (!req.query.q) {
      return res.status(400).json({ erreur: 'Paramètre q requis' });
    }

    const terme = req.query.q.toLowerCase().trim();

    let query = `SELECT pm.pharmacie_id, p.id, phar.nom AS pharmacie_nom, phar.quartier, phar.telephone, phar.de_garde, phar.lat, phar.lng,
                        p.code, p.nom, p.categorie, pm.prix, pm.disponible
                 FROM pharmacie_medicaments pm
                 JOIN produits p ON pm.produit_id = p.id
                 JOIN pharmacies phar ON pm.pharmacie_id = phar.id
                 WHERE (LOWER(p.nom) LIKE $1 OR LOWER(p.categorie) LIKE $1)`;
    const params = [`%${terme}%`];

    if (req.query.garde === 'true') {
      query += ` AND phar.de_garde = TRUE`;
    }

    query += ' ORDER BY phar.nom, p.nom';

    const result = await db.query(query, params);

    // Grouper les résultats par pharmacie
    const resultatsMap = new Map();
    result.rows.forEach(row => {
      const pharmacieId = row.pharmacie_id;
      if (!resultatsMap.has(pharmacieId)) {
        resultatsMap.set(pharmacieId, {
          pharmacieId: row.pharmacie_id,
          pharmacieNom: row.pharmacie_nom,
          quartier: row.quartier,
          telephone: row.telephone,
          deGarde: row.de_garde,
          lat: row.lat,
          lng: row.lng,
          medicaments: []
        });
      }
      resultatsMap.get(pharmacieId).medicaments.push({
        id: row.id,
        code: row.code,
        nom: row.nom,
        categorie: row.categorie,
        prix: row.prix,
        disponible: row.disponible
      });
    });

    const resultats = Array.from(resultatsMap.values());

    res.json({
      terme,
      total: resultats.length,
      resultats
    });
  } catch (err) {
    console.error('Erreur GET /api/pharmacies/medicament/recherche:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route admin : GET /api/pharmacies/pending - liste des pharmacies en attente d'approbation
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }

    const result = await db.query('SELECT id, nom, quartier, arrondissement, adresse, telephone, horaires, de_garde AS "deGarde", lat, lng, verification_status, cert_pharmacien, cert_existence FROM pharmacies WHERE approved = FALSE ORDER BY id');
    res.json({ total: result.rows.length, pharmacies: result.rows });
  } catch (err) {
    console.error('Erreur GET /api/pharmacies/pending:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route admin : PUT /api/pharmacies/:id/approve - approuver une pharmacie
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ erreur: 'Accès refusé' });
    }
    const id = parseInt(req.params.id, 10);

    const pharmaRes = await db.query('SELECT id FROM pharmacies WHERE id = $1', [id]);
    if (pharmaRes.rows.length === 0) {
      return res.status(404).json({ erreur: 'Pharmacie introuvable' });
    }

    await db.query('UPDATE pharmacies SET approved = TRUE, verification_status = $1 WHERE id = $2', ['approved', id]);

    res.json({ message: 'Pharmacie approuvée.' });
  } catch (err) {
    console.error('Erreur PUT /api/pharmacies/:id/approve', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 5 : POST /api/pharmacies (Ajouter une pharmacie) - Super Admin seulement
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ erreur: "Seul l'administrateur peut ajouter des pharmacies." });
    }

    const { nom, quartier, arrondissement, adresse, telephone, horaires, deGarde, lat, lng } = req.body;

    if (!nom || !quartier || !arrondissement || lat === undefined || lng === undefined) {
      return res.status(400).json({ erreur: "Les champs nom, quartier, arrondissement, latitude et longitude sont requis." });
    }

    const result = await db.query(
      `INSERT INTO pharmacies (nom, quartier, arrondissement, adresse, telephone, horaires, de_garde, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        nom,
        quartier,
        arrondissement,
        adresse || '',
        telephone || '',
        horaires || '08h00 - 20h00',
        deGarde === true || deGarde === 'true',
        parseFloat(lat),
        parseFloat(lng)
      ]
    );

    const nouvellePharmacie = result.rows[0];

    res.status(201).json({
      message: "Pharmacie ajoutée avec succès.",
      pharmacie: {
        id: nouvellePharmacie.id,
        nom: nouvellePharmacie.nom,
        quartier: nouvellePharmacie.quartier,
        arrondissement: nouvellePharmacie.arrondissement,
        adresse: nouvellePharmacie.adresse,
        telephone: nouvellePharmacie.telephone,
        horaires: nouvellePharmacie.horaires,
        deGarde: nouvellePharmacie.de_garde,
        lat: nouvellePharmacie.lat,
        lng: nouvellePharmacie.lng
      }
    });
  } catch (err) {
    console.error('Erreur POST /api/pharmacies:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 6 : PUT /api/pharmacies/:id (Modifier une pharmacie) - Super Admin ou Pharmacien de cette pharmacie
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Vérifier que la pharmacie existe
    const pharmaRes = await db.query('SELECT * FROM pharmacies WHERE id = $1', [id]);
    if (pharmaRes.rows.length === 0) {
      return res.status(404).json({ erreur: "Pharmacie introuvable." });
    }

    // Vérification des droits
    if (req.user.role === 'pharmacien' && req.user.pharmacyId !== id) {
      return res.status(403).json({ erreur: "Vous n'êtes pas autorisé à modifier cette pharmacie." });
    }

    const pharmacie = pharmaRes.rows[0];
    const { nom, quartier, arrondissement, adresse, telephone, horaires, deGarde, lat, lng } = req.body;

    // Construire la requête UPDATE dynamiquement
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (req.user.role === 'super-admin') {
      if (nom !== undefined) {
        updates.push(`nom = $${paramIndex}`);
        params.push(nom);
        paramIndex++;
      }
      if (quartier !== undefined) {
        updates.push(`quartier = $${paramIndex}`);
        params.push(quartier);
        paramIndex++;
      }
      if (arrondissement !== undefined) {
        updates.push(`arrondissement = $${paramIndex}`);
        params.push(arrondissement);
        paramIndex++;
      }
      if (lat !== undefined) {
        updates.push(`lat = $${paramIndex}`);
        params.push(parseFloat(lat));
        paramIndex++;
      }
      if (lng !== undefined) {
        updates.push(`lng = $${paramIndex}`);
        params.push(parseFloat(lng));
        paramIndex++;
      }
    }

    if (adresse !== undefined) {
      updates.push(`adresse = $${paramIndex}`);
      params.push(adresse);
      paramIndex++;
    }
    if (telephone !== undefined) {
      updates.push(`telephone = $${paramIndex}`);
      params.push(telephone);
      paramIndex++;
    }
    if (horaires !== undefined) {
      updates.push(`horaires = $${paramIndex}`);
      params.push(horaires);
      paramIndex++;
    }
    if (deGarde !== undefined) {
      updates.push(`de_garde = $${paramIndex}`);
      params.push(deGarde === true || deGarde === 'true');
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ erreur: "Aucun champ à mettre à jour." });
    }

    params.push(id);
    const updateQuery = `UPDATE pharmacies SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await db.query(updateQuery, params);

    res.json({
      message: "Pharmacie mise à jour avec succès.",
      pharmacie: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur PUT /api/pharmacies/:id:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 7 : DELETE /api/pharmacies/:id (Supprimer une pharmacie) - Super Admin seulement
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ erreur: "Seul l'administrateur peut supprimer des pharmacies." });
    }

    const id = parseInt(req.params.id, 10);

    const result = await db.query('DELETE FROM pharmacies WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erreur: "Pharmacie introuvable." });
    }

    res.json({
      message: "Pharmacie supprimée avec succès."
    });
  } catch (err) {
    console.error('Erreur DELETE /api/pharmacies/:id:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// route 8 : PUT /api/pharmacies/:id/catalogue (Mettre à jour le catalogue) - Pharmacien de la pharmacie ou Super Admin
router.put('/:id/catalogue', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Vérifier que la pharmacie existe
    const pharmaRes = await db.query('SELECT * FROM pharmacies WHERE id = $1', [id]);
    if (pharmaRes.rows.length === 0) {
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

    // Supprimer tous les médicaments existants pour cette pharmacie
    await db.query('DELETE FROM pharmacie_medicaments WHERE pharmacie_id = $1', [id]);

    // Insérer les nouveaux médicaments
    for (const med of medicaments) {
      await db.query(
        `INSERT INTO pharmacie_medicaments (pharmacie_id, produit_id, prix, disponible)
         VALUES ($1, $2, $3, $4)`,
        [id, med.produit_id || med.id, med.prix, med.disponible !== false]
      );
    }

    res.json({
      message: "Catalogue mis à jour avec succès.",
      total: medicaments.length,
      medicaments: medicaments
    });
  } catch (err) {
    console.error('Erreur PUT /api/pharmacies/:id/catalogue:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// exportation du router pour pouvoir l'utiliser dans notre application Express principale (app.js)
module.exports = router;

