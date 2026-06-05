// Routes d'authentification pour notre API
const express = require('express');
const router = express.Router();
const usersDb = require('../data/users');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ erreur: "L'adresse email et le mot de passe sont requis." });
    }

    const user = usersDb.findByEmail(email);

    if (!user) {
        return res.status(401).json({ erreur: "Adresse email ou mot de passe incorrect." });
    }

    // Hashage du mot de passe fourni pour comparaison
    const inputHash = usersDb.hashPassword(password);

    if (inputHash !== user.passwordHash) {
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
    if (user.role === 'pharmacien') {
        tokenPayload.pharmacyId = user.pharmacyId;
    }

    const token = generateToken(tokenPayload);

    // Retourne le jeton de connexion et les détails de l'utilisateur
    res.json({
        message: "Connexion réussie.",
        token: token,
        role: user.role,
        nom: user.nom,
        email: user.email,
        pharmacyId: user.pharmacyId || null
    });
});

module.exports = router;
