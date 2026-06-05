// dashPharma.js - Gestionnaire dynamique du Dashboard Pharmacien
import {
    logout,
    apiFetchPharmacieDetail,
    apiUpdatePharmacy,
    apiUpdateCatalogue
} from "./api.js";

document.addEventListener('DOMContentLoaded', async () => {
    // securisation de la page token et role et pharmacyId sont requis pour acceder a ce dashboard
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const pharmacyIdStr = localStorage.getItem("pharmacyId");
    const username = localStorage.getItem("nom");

    if (!token || role !== "pharmacien" || !pharmacyIdStr) {
        console.warn("Accès interdit : Authentification requise en tant que Pharmacien");
        window.location.href = "/Client/Index.html";
        return;
    }

    const pharmacyId = parseInt(pharmacyIdStr, 10);
    let pharmacyData = null;

    // dom elements
    const headerTitle = document.querySelector(".main-header__title");
    const headerSubtitle = document.querySelector(".main-header__subtitle");
    const btnLogout = document.querySelector(".sidebar__link--logout");
    
    // Stats cards
    const cardValueMed = document.querySelectorAll(".stat-card__value")[0]; // Total Médicaments
    const cardValueDispo = document.querySelectorAll(".stat-card__value")[1]; // Disponibles
    const cardValueRupture = document.querySelectorAll(".stat-card__value")[2]; // Ruptures
    const cardValueGarde = document.querySelectorAll(".stat-card__value")[3]; // De Garde

    // Sidebar Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Section Activités
    const activityList = document.querySelector(".activity-list");

    // toggle mobile menu
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    //iniitialisation du dashboard
    await loadPharmacyData();

    async function loadPharmacyData() {
        pharmacyData = await apiFetchPharmacieDetail(pharmacyId);
        
        if (!pharmacyData) {
            alert("Impossible de charger les données de votre pharmacie.");
            return;
        }

        if (headerTitle) headerTitle.textContent = pharmacyData.nom;
        if (headerSubtitle) headerSubtitle.textContent = `Bienvenue, Espace Pharmacien — ${pharmacyData.quartier}`;

        updateKPIs();
        renderCatalogueTab();
    }

    // mise a jour des KPIs
    function updateKPIs() {
        const catalogue = pharmacyData.catalogue || [];
        const total = catalogue.length;
        const dispo = catalogue.filter(m => m.disponible).length;
        const rupture = total - dispo;

        if (cardValueMed) cardValueMed.textContent = total;
        if (cardValueDispo) cardValueDispo.textContent = dispo;
        if (cardValueRupture) cardValueRupture.textContent = rupture;
        if (cardValueGarde) {
            cardValueGarde.textContent = pharmacyData.deGarde ? "Oui" : "Non";
            const iconCard = cardValueGarde.closest(".stat-card").querySelector(".stat-card__icon");
            if (pharmacyData.deGarde) {
                iconCard.style.background = "#E8F5E9";
                iconCard.style.color = "#00C853";
            } else {
                iconCard.style.background = "#FFEBEE";
                iconCard.style.color = "#E53935";
            }
        }
    }

    // j'injecte mon catalogue dynamique dans la section activité
    function renderCatalogueTab() {
        const activitySection = document.querySelector(".activity-section");
        if (!activitySection) return;

        const catalogue = pharmacyData.catalogue || [];

        activitySection.innerHTML = `
            <h2 class="section-title">Gestion du Catalogue & Stock</h2>
            <div style="background: white; border: 1px solid var(--c-border); border-radius: var(--r-md); padding: 1.5rem; overflow-x: auto; margin-top: 1rem;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--c-border); color: var(--c-muted); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px;">
                            <th style="padding: 0.75rem 0.5rem;">Médicament</th>
                            <th style="padding: 0.75rem 0.5rem;">Catégorie</th>
                            <th style="padding: 0.75rem 0.5rem;">Prix (FCFA)</th>
                            <th style="padding: 0.75rem 0.5rem;">Statut</th>
                            <th style="padding: 0.75rem 0.5rem; text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="catalogue-table-body">
                        ${catalogue.length === 0 ? `
                            <tr><td colspan="5" style="padding: 2rem; text-align: center; color: var(--c-muted);">Aucun médicament dans votre catalogue. Cliquez sur "Ajouter médicament" pour commencer.</td></tr>
                        ` : catalogue.map(med => `
                            <tr style="border-bottom: 1px solid var(--c-border);">
                                <td style="padding: 0.75rem 0.5rem; font-weight: 700; color: var(--c-text);">${escapeHtml(med.nom)}</td>
                                <td style="padding: 0.75rem 0.5rem; color: var(--c-muted);">${escapeHtml(med.categorie)}</td>
                                <td style="padding: 0.75rem 0.5rem; font-weight: 500;">${med.prix} F</td>
                                <td style="padding: 0.75rem 0.5rem;">
                                    <span style="display: inline-block; padding: 2px 8px; border-radius: var(--r-full); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; background: ${med.disponible ? '#E8F5E9' : '#FFEBEE'}; color: ${med.disponible ? '#00C853' : '#E53935'};">
                                        ${med.disponible ? 'Disponible' : 'Rupture'}
                                    </span>
                                </td>
                                <td style="padding: 0.75rem 0.5rem; text-align: center;">
                                    <button class="btn-toggle-stock" data-med-id="${med.id}" style="background: none; border: 1px solid var(--c-border); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; color: ${med.disponible ? '#E53935' : '#00C853'}; transition: all 0.2s;">
                                        ${med.disponible ? 'Mettre en rupture' : 'Rendre disponible'}
                                    </button>
                                    <button class="btn-delete-med" data-med-id="${med.id}" style="background: none; border: 1px solid var(--c-border); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; color: var(--c-fav); margin-left: 8px;">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        attachCatalogueEvents();
    }

    function attachCatalogueEvents() {
        // Toggle Disponibilité
        document.querySelectorAll(".btn-toggle-stock").forEach(btn => {
            btn.addEventListener("click", async () => {
                const medId = btn.dataset.medId;
                const index = pharmacyData.catalogue.findIndex(m => m.id === medId);
                
                if (index !== -1) {
                    pharmacyData.catalogue[index].disponible = !pharmacyData.catalogue[index].disponible;
                    
                    try {
                        await apiUpdateCatalogue(pharmacyId, pharmacyData.catalogue);
                        logActivity(`Stock modifié : ${pharmacyData.catalogue[index].nom} est maintenant ${pharmacyData.catalogue[index].disponible ? 'disponible' : 'en rupture'}`);
                        updateKPIs();
                        renderCatalogueTab();
                    } catch (err) {
                        alert("Erreur lors de la mise à jour du stock : " + err.message);
                    }
                }
            });
        });

        // Supprimer médicament
        document.querySelectorAll(".btn-delete-med").forEach(btn => {
            btn.addEventListener("click", async () => {
                const medId = btn.dataset.medId;
                const med = pharmacyData.catalogue.find(m => m.id === medId);

                if (med && confirm(`Voulez-vous supprimer "${med.nom}" du catalogue ?`)) {
                    pharmacyData.catalogue = pharmacyData.catalogue.filter(m => m.id !== medId);
                    
                    try {
                        await apiUpdateCatalogue(pharmacyId, pharmacyData.catalogue);
                        logActivity(`Médicament supprimé : ${med.nom}`);
                        updateKPIs();
                        renderCatalogueTab();
                    } catch (err) {
                        alert("Erreur lors de la suppression : " + err.message);
                    }
                }
            });
        });
    }

    // action rapids
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', async () => {
            const label = card.querySelector('span').textContent.trim();

            if (label === "Ajouter médicament") {
                const nom = prompt("Nom du médicament :");
                if (!nom) return;
                const categorie = prompt("Catégorie (ex: Antalgique, Antibiotique) :");
                if (!categorie) return;
                const prixStr = prompt("Prix (FCFA) :");
                const prix = parseInt(prixStr, 10);
                if (isNaN(prix)) {
                    alert("Prix invalide");
                    return;
                }

                const nouvelId = "med_" + Date.now();
                const nouveauMedicament = {
                    id: nouvelId,
                    nom,
                    categorie,
                    prix,
                    disponible: true
                };

                pharmacyData.catalogue.push(nouveauMedicament);

                try {
                    await apiUpdateCatalogue(pharmacyId, pharmacyData.catalogue);
                    logActivity(`Médicament ajouté : ${nom}`);
                    updateKPIs();
                    renderCatalogueTab();
                } catch (err) {
                    alert("Erreur lors de l'ajout : " + err.message);
                }

            } else if (label === "Gérer garde") {
                const newGarde = !pharmacyData.deGarde;
                try {
                    await apiUpdatePharmacy(pharmacyId, { deGarde: newGarde });
                    pharmacyData.deGarde = newGarde;
                    logActivity(`Garde modifiée : ${newGarde ? 'Garde activée' : 'Garde désactivée'}`);
                    updateKPIs();
                } catch (err) {
                    alert("Erreur lors de la modification de la garde : " + err.message);
                }

            } else if (label === "Modifier horaires") {
                const actuels = pharmacyData.horaires || "08h00 - 20h00";
                const nouveaux = prompt("Nouveaux horaires :", actuels);
                if (nouveaux && nouveaux.trim() !== actuels) {
                    try {
                        await apiUpdatePharmacy(pharmacyId, { horaires: nouveaux.trim() });
                        pharmacyData.horaires = nouveaux.trim();
                        logActivity(`Horaires modifiés : ${nouveaux.trim()}`);
                    } catch (err) {
                        alert("Erreur lors de la modification des horaires : " + err.message);
                    }
                }
            } else if (label === "Modifier stock") {
                // focus auto sur la section catalogue
                const activitySection = document.querySelector(".activity-section");
                if (activitySection) {
                    activitySection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    //gestion de la deconnexion
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }

    function logActivity(text) {
        console.log("Activité : " + text);
    }

    function escapeHtml(text) {
        if (!text) return "";
        return text
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});