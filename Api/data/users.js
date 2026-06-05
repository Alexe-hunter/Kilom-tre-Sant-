// Base de données simulée des utilisateurs (Super-Admin et Pharmaciens)
const crypto = require('crypto');

// Fonction pour générer le hash SHA256 d'un mot de passe (simule le stockage sécurisé en BDD)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Liste des utilisateurs
const users = [
    {
        id: 1,
        email: "admin@kilometresante.cg",
        passwordHash: hashPassword("admin123"),
        role: "super-admin",
        nom: "Super Administrateur"
    },
    {
        id: 2,
        email: "poste@kilometresante.cg",
        passwordHash: hashPassword("poste123"),
        role: "pharmacien",
        nom: "Pharmacien - Poste",
        pharmacyId: 1
    },
    {
        id: 3,
        email: "centrale@kilometresante.cg",
        passwordHash: hashPassword("centrale123"),
        role: "pharmacien",
        nom: "Pharmacien - Centrale",
        pharmacyId: 2
    }
];

// Génération automatique de comptes pour les autres pharmacies 

for (let id = 3; id <= 13; id++) {
    // Si l'utilisateur n'existe pas déjà
    if (!users.some(u => u.pharmacyId === id)) {
        users.push({
            id: id + 10,
            email: `pharma${id}@kilometresante.cg`,
            passwordHash: hashPassword(`pharma${id}123`),
            role: "pharmacien",
            nom: `Pharmacien - Pharmacie ${id}`,
            pharmacyId: id
        });
    }
}

module.exports = {
    users,
    hashPassword,
    findByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
};
