//pour des demande de  la géolocalisation au démarrage
function requestGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // pour stocker la localisation de l'utilisateur dans localStorage
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
            },
            (error) => {
                console.warn('Géolocalisation refusée ou indisponible:', error);
                // On continue même sans géolocalisation
            }
        );
    }
}

// Demander la géolocalisation puis charger l'app
requestGeolocation();

// Charger app.js qui gérera la redirection vers la page appropriée
import('./app.js').catch(err => {
    console.error('Erreur lors du chargement:', err);
});
