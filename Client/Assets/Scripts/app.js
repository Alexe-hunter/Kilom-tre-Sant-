// point d'entrée de l'application, je vérifie si l'utilisateur est déjà connecté et je le redirige vers la page appropriée en fonction de son rôle
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
            navigate("login");
    }

});