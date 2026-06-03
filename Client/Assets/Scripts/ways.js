// mon systeme de navigation pour les différentes pages de l'application
const routes = {
    
    "login": "/auth/auth.html",
    "admin": "/super-admin/dashAdmin.html",
    "pharma": "/admin-pharmacien/dashPharma.html"
};

function navigate(route) {
    const path = routes[route];

    if (!path) {
        console.error("Route introuvable");
        return;
    }

    window.location.href = path;
}

export { navigate };