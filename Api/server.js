// mon serveur Express

const express = require('express');

const cors = require('cors');

// creation de mon app express
const app = express();

// configuration du port d'écoute (en prod, c'est souvent défini par l'hébergeur)
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  const heure = new Date().toLocaleString('fr-FR');
  console.log(`[${heure}] ${req.method} ${req.url}`);
  next();
});

// mes routes (endpoints) sont définies dans des fichiers séparés
const pharmaciesRouter = require('./routes/pharmacies');
const authRouter = require('./routes/auth');
app.use('/api/pharmacies', pharmaciesRouter);
app.use('/api/auth', authRouter);


// les routes racines ou d'autres routes spécifiques peuvent être définies ici
app.get('/', (req, res) => {
  res.json({
    message: 'API Kilomètre-Santé opérationnelle',
    version: '1.0.0',
    routes: [
      'GET /api/pharmacies',
      'GET /api/pharmacies?garde=true',
      'GET /api/pharmacies?q=mavré',
      'GET /api/pharmacies/:id',
      'GET /api/pharmacies/:id/catalogue',
      'GET /api/pharmacies/:id/catalogue?q=paracetamol',
      'GET /api/pharmacies/medicament/recherche?q=artemether'
    ]
  });
});


// gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({
    erreur: `Route ${req.method} ${req.url} introuvable`
  });
});


// et enfin le demarrage du serveur
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log(`  Kilomètre-Santé API démarrée`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://localhost:${PORT}/api/pharmacies`);
  console.log('════════════════════════════════════════');
});
