// point d'entrée de l'application (Gatekeeper)
// Vérifie si l'utilisateur est connecté et le redirige vers le dashboard approprié
import { navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        navigate("login");
        return;
    }

    switch (role) {
        case "super-admin":
            navigate("admin");
            break;

        case "pharmacien":
            navigate("pharma");
            break;

        default:
            console.warn("Rôle inconnu, nettoyage de la session");
            localStorage.clear();
            navigate("login");
    }
});