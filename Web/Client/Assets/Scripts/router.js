// router.js - Système de navigation pour les différentes zones de l'application
const routes = {
    "login": "/auth.html",
    "admin": "/Client/super-admin/Admin.html",
    "pharma": "/Client/Pharmacien/Dash-Pharma.html",
    "gatekeeper": "/Client/Index.html",
    "home": "/index.html"
};

function navigate(route) {
    const path = routes[route];

    if (!path) {
        console.error("Route introuvable :", route);
        return;
    }

    window.location.href = path;
}

export { navigate };
