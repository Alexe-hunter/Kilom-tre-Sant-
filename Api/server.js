// initiation sur mon serveur node

//importation d'express
const express = require('express');

//création de l'app
const app = express();

//definition des routes
app.get('/', (req, res) => {
    res.json({message: 'Serveur open'});
});


//je le démar sur le port 4000
app.listen(4000, () => {
    console.log('Serveur open sur le port 4000, link : http://localhost:4000');
});
