// auth.js - Gestionnaire de la page de connexion Espace Pro

const API_URL = (window.location.protocol === "file:" || window.location.hostname === "" || window.location.hostname === "localhost")
    ? "http://localhost:3000/api"
    : "https://kilom-tre-sant.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const errorBox = document.getElementById("error-box");
    const errorMessage = document.getElementById("error-message");
    const btnSubmit = document.getElementById("btn-submit");

    //bouton afficher/masquer le mot de passe
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            
            // Toggle icône eye / eye-slash
            const icon = togglePasswordBtn.querySelector("i");
            if (type === "text") {
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    }

    // 2. Gestion de la soumission du formulaire
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Réinitialiser les erreurs
            hideError();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validation simple
            if (!email || !password) {
                showError("Veuillez remplir tous les champs.");
                return;
            }

            // Activer l'état de chargement
            setLoading(true);

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.erreur || "Une erreur est survenue lors de la connexion.");
                }

                // Sauvegarder les informations de connexion dans localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("nom", data.nom);
                localStorage.setItem("email", data.email);
                
                if (data.pharmacyId) {
                    localStorage.setItem("pharmacyId", data.pharmacyId);
                } else {
                    localStorage.removeItem("pharmacyId");
                }

                // Rediriger vers l'aiguilleur Gatekeeper
                window.location.href = "/Client/Index.html";

            } catch (error) {
                console.error("Connexion échouée :", error);
                showError(error.message);
                setLoading(false);
            }
        });
    }

    // Fonction pour afficher une erreur
    function showError(msg) {
        if (errorBox && errorMessage) {
            errorMessage.textContent = msg;
            errorBox.classList.add("visible");
        }
    }

    // Fonction pour masquer une erreur
    function hideError() {
        if (errorBox) {
            errorBox.classList.remove("visible");
        }
    }

    // Fonction pour basculer l'état de chargement
    function setLoading(isLoading) {
        if (btnSubmit) {
            if (isLoading) {
                btnSubmit.classList.add("loading");
                btnSubmit.disabled = true;
            } else {
                btnSubmit.classList.remove("loading");
                btnSubmit.disabled = false;
            }
        }
    }
});
