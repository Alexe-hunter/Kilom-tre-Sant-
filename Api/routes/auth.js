// Routes d'authentification pour notre API
const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Fonction pour hasher les mots de passe (SHA256)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erreur: "L'adresse email et le mot de passe sont requis." });
    }

    // Rechercher l'utilisateur dans la base de données
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erreur: "Adresse email ou mot de passe incorrect." });
    }

    const user = result.rows[0];

    // Hasher le mot de passe fourni et comparer
    const inputHash = hashPassword(password);

    if (inputHash !== user.password_hash) {
      return res.status(401).json({ erreur: "Adresse email ou mot de passe incorrect." });
    }

    // Création du payload pour le token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom
    };

    // Si c'est un pharmacien, on associe sa pharmacie
    if (user.role === 'pharmacien' && user.pharmacy_id) {
      tokenPayload.pharmacyId = user.pharmacy_id;
    }

    const token = generateToken(tokenPayload);

    // Retourne le jeton de connexion et les détails de l'utilisateur
    res.json({
      message: "Connexion réussie.",
      token: token,
      role: user.role,
      nom: user.nom,
      email: user.email,
      pharmacyId: user.pharmacy_id || null
    });
  } catch (err) {
    console.error('Erreur POST /api/auth/login:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;

