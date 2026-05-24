// mon système de routage pour mon app

//dico d'objets pour mes routes
const routes = {
    "home": "/",
    "pharma": "/pharmacie",
    "about": "/about"
};

//fonction pour charger une page en fonction de la route
async function loadPage(route) {
    const path= routes[route] || routes["/"];
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById("app").innerHTML = html;
}

//écoute du changement de hash dans le link ou url 
window.addEventListener("hashchange", () => {
    loadPage(window.location.hash.substring(1));
});

//chargement de la page d'accueil
window.addEventListener("load", () => {
    loadPage("/");
});