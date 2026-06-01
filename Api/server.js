// mon serveur Express pour l'API Kilomètre-Santé
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  const heure = new Date().toLocaleString('fr-FR');
  console.log(`[${heure}] ${req.method} ${req.url}`);
  next();
});


const pharmaciesRouter = require('./routes/pharmacies');
app.use('/api/pharmacies', pharmaciesRouter);


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


app.use((req, res) => {
  res.status(404).json({
    erreur: `Route ${req.method} ${req.url} introuvable`
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log(`  Kilomètre-Santé API démarrée`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://localhost:${PORT}/api/pharmacies`);
  console.log('════════════════════════════════════════');
});
