// Charger app.js qui gérera la redirection vers la page appropriée
import('./app.js').catch(err => {
    console.error('Erreur lors du chargement:', err);
});
