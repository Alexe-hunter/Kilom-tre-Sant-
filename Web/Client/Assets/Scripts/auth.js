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

    const registerForm = document.getElementById("register-form");
    const registerNameInput = document.getElementById("register-name");
    const registerEmailInput = document.getElementById("register-email");
    const registerPasswordInput = document.getElementById("register-password");
    const registerPasswordConfirmInput = document.getElementById("register-password-confirm");
    const registerPharmacyNameInput = document.getElementById("register-pharmacy-name");
    const registerQuartierInput = document.getElementById("register-quartier");
    const registerArrondissementInput = document.getElementById("register-arrondissement");
    const registerAddressInput = document.getElementById("register-address");
    const registerTelephoneInput = document.getElementById("register-telephone");
    const showRegisterBtn = document.getElementById("show-register");
    const showLoginBtn = document.getElementById("show-login");
    const btnRegister = document.getElementById("btn-register");

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => {
            toggleForm(true);
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            toggleForm(false);
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideError();

            const nom = registerNameInput.value.trim();
            const email = registerEmailInput.value.trim();
            const password = registerPasswordInput.value;
            const passwordConfirm = registerPasswordConfirmInput.value;
            const pharmacyName = registerPharmacyNameInput.value.trim();
            const quartier = registerQuartierInput.value.trim();
            const arrondissement = registerArrondissementInput.value.trim();
            const adresse = registerAddressInput.value.trim();
            const telephone = registerTelephoneInput.value.trim();

            if (!nom || !email || !password || !passwordConfirm || !pharmacyName || !quartier || !arrondissement || !adresse) {
                showError("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            if (password !== passwordConfirm) {
                showError("Les mots de passe ne correspondent pas.");
                return;
            }

            setLoading(true, btnRegister);

            try {
                const userLocation = await getCurrentPosition();

                const payload = {
                    nom,
                    email,
                    password,
                    pharmacyName,
                    quartier,
                    arrondissement,
                    adresse,
                    telephone,
                    lat: userLocation?.lat || null,
                    lng: userLocation?.lng || null
                };

                const response = await fetch(`${API_URL}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.erreur || data.message || "Une erreur est survenue lors de l'inscription.");
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("nom", data.nom);
                localStorage.setItem("email", data.email);
                localStorage.setItem("pharmacyId", data.pharmacyId);

                window.location.href = "/Client/Index.html";
            } catch (error) {
                console.error("Inscription échouée :", error);
                showError(error.message);
                setLoading(false, btnRegister);
            }
        });
    }

    function toggleForm(showRegister) {
        if (loginForm) loginForm.classList.toggle("hidden", showRegister);
        if (registerForm) registerForm.classList.toggle("hidden", !showRegister);
        hideError();
    }

    function getCurrentPosition() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                return resolve(null);
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0
                }
            );
        });
    }

    function setLoading(isLoading, button = btnSubmit) {
        if (button) {
            if (isLoading) {
                button.classList.add("loading");
                button.disabled = true;
            } else {
                button.classList.remove("loading");
                button.disabled = false;
            }
        }
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
});
