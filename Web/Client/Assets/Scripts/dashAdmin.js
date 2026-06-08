// dashAdmin.js - Logique du Tableau de bord Super-Admin
import {
    logout,
    apiFetchPharmacies,
    apiCreatePharmacy,
    apiUpdatePharmacy,
    apiDeletePharmacy,
    apiFetchPendingPharmacies,
    apiApprovePharmacy,
    apiCreateSchedule
} from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. ROUTE GUARD (Sécurité)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("nom");

    if (!token || role !== "super-admin") {
        console.warn("Accès interdit : Authentification requise en tant que Super-Admin");
        window.location.href = "/Client/Index.html";
        return;
    }

    // Afficher le nom de l'utilisateur connecté
    const userDisplayName = document.getElementById("user-display-name");
    if (userDisplayName && username) {
        userDisplayName.textContent = username;
    }

    // declaration du dom elements
    const tableBody = document.getElementById("table-body");
    const kpiTotal = document.getElementById("kpi-total");
    const kpiGarde = document.getElementById("kpi-garde");
    const kpiFerme = document.getElementById("kpi-ferme");

    const btnLogout = document.getElementById("btn-logout");
    const btnAddPharmacy = document.getElementById("btn-add-pharmacy");
    const btnSchedules = document.getElementById('btn-schedules');
    const sidebarLinks = document.querySelectorAll('.sidebar__link[data-tab]');
    const btnClosePanel = document.getElementById("btn-close-panel");
    const slideOverlay = document.getElementById("slide-overlay");
    const slidePanel = document.getElementById("slide-panel");
    const formTitle = document.getElementById("panel-form-title");
    const pharmacyForm = document.getElementById("pharmacy-form");
    
    // Champs du formulaire
    const formId = document.getElementById("form-pharmacy-id");
    const formNom = document.getElementById("form-nom");
    const formArrondissement = document.getElementById("form-arrondissement");
    const formQuartier = document.getElementById("form-quartier");
    const formAdresse = document.getElementById("form-adresse");
    const formTelephone = document.getElementById("form-telephone");
    const formHoraires = document.getElementById("form-horaires");
    const formLat = document.getElementById("form-lat");
    const formLng = document.getElementById("form-lng");
    const formDeGarde = document.getElementById("form-degarde");

    let pharmaciesList = [];

    // pour la recup des données et le rendu initial du tableau
    loadDashboardData();

    // handle sidebar tab clicks
    sidebarLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (tab === 'pharmacies') {
            document.getElementById('panel-title').textContent = 'Liste des pharmacies';
            loadDashboardData();
        } else if (tab === 'pending') {
            document.getElementById('panel-title').textContent = 'Demandes en attente';
            loadPending();
        }
    }));

    if (btnSchedules) {
        btnSchedules.addEventListener('click', async () => {
            const titre = prompt('Titre du planning (ex: Garde Nuit 2026-06-10)');
            if (!titre) return;
            const type = prompt('Type (nuit / dimanche / ferie / jour)');
            if (!type) return;
            const dateDebut = prompt('Date de début (YYYY-MM-DD HH:MM)');
            if (!dateDebut) return;
            const dateFin = prompt('Date de fin (YYYY-MM-DD HH:MM) - laisser vide si non');

            try {
                await apiCreateSchedule({ titre, type, date_debut: dateDebut, date_fin: dateFin || null, details: null });
                showToast('Planning créé et envoyé.', 'success');
            } catch (err) {
                showToast('Erreur création planning', 'error');
            }
        });
    }

    async function loadDashboardData() {
        showLoadingTable();
        const data = await apiFetchPharmacies();
        pharmaciesList = data.pharmacies || [];

        // mise a jpur des KPIs
        kpiTotal.textContent = data.total || 0;
        kpiGarde.textContent = data.garde || 0;
        kpiFerme.textContent = (data.total - data.garde) || 0;

        renderTable(pharmaciesList);
    }

    // rendu du tableau des pharmacies
    function renderTable(pharmacies) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (pharmacies.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Aucune pharmacie enregistrée.</td></tr>`;
            return;
        }

        pharmacies.forEach(p => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><strong>${escapeHtml(p.nom)}</strong><br><small style="color: var(--c-muted);">${escapeHtml(p.adresse || '')}</small></td>
                <td>${escapeHtml(p.quartier)}<br><small style="color: var(--c-muted);">${escapeHtml(p.arrondissement)}</small></td>
                <td>${escapeHtml(p.telephone || 'Non renseigné')}</td>
                <td>${escapeHtml(p.horaires)}</td>
                <td>
                    <span class="status-badge ${p.deGarde ? 'status-badge--garde' : 'status-badge--fermee'}">
                        ${p.deGarde ? 'De Garde' : 'Hors Garde'}
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="btn-action-icon btn-action-icon--toggle" title="Basculer la garde" data-id="${p.id}" data-garde="${p.deGarde}">
                        <i class="fas fa-power-off"></i>
                    </button>
                    <button class="btn-action-icon btn-action-icon--edit" title="Modifier" data-id="${p.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action-icon btn-action-icon--delete" title="Supprimer" data-id="${p.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        attachActionListeners();
    }

    // Charger et afficher les demandes en attente
    async function loadPending() {
        showLoadingTable();
        try {
            const data = await apiFetchPendingPharmacies();
            const pending = data.pharmacies || [];
            if (!tableBody) return;
            tableBody.innerHTML = '';
            if (pending.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Aucune demande en attente.</td></tr>`;
                return;
            }

            pending.forEach(p => {
                const tr = document.createElement('tr');
                const cert1 = p.cert_pharmacien ? `<a href="/uploads/${p.cert_pharmacien.split('/').pop()}" target="_blank">Voir</a>` : '—';
                const cert2 = p.cert_existence ? `<a href="/uploads/${p.cert_existence.split('/').pop()}" target="_blank">Voir</a>` : '—';

                tr.innerHTML = `
                    <td><strong>${escapeHtml(p.nom)}</strong></td>
                    <td>${escapeHtml(p.quartier)} / ${escapeHtml(p.arrondissement)}</td>
                    <td>${escapeHtml(p.telephone || '—')}</td>
                    <td>${escapeHtml(p.horaires || '—')}</td>
                    <td>${escapeHtml(p.verification_status || 'pending')}</td>
                    <td class="actions-cell">
                        <div style="display:flex;gap:8px;align-items:center;">
                            <div>Certifs: ${cert1} | ${cert2}</div>
                            <button class="btn-action-icon btn-action-icon--approve" data-id="${p.id}" title="Approuver"><i class="fas fa-check"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            // attach approve listeners
            document.querySelectorAll('.btn-action-icon--approve').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = parseInt(btn.dataset.id, 10);
                    if (!confirm('Approuver cette pharmacie et la rendre publique ?')) return;
                    try {
                        await apiApprovePharmacy(id);
                        showToast('Pharmacie approuvée.', 'success');
                        loadPending();
                    } catch (err) {
                        showToast('Erreur lors de l\'approbation', 'error');
                    }
                });
            });
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Erreur lors du chargement.</td></tr>`;
        }
    }

    function showLoadingTable() {
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Mise à jour en cours...</td></tr>`;
        }
    }

    //Booton d'action pour chaque ligne du tableau (toggle garde, edit, delete)
    function attachActionListeners() {
        // pour la garde
        document.querySelectorAll(".btn-action-icon--toggle").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = parseInt(btn.dataset.id, 10);
                const currentGarde = btn.dataset.garde === "true";
                
                try {
                    showLoadingTable();
                    await apiUpdatePharmacy(id, { deGarde: !currentGarde });
                    showToast("Statut de garde mis à jour !", "success");
                    loadDashboardData();
                } catch (err) {
                    showToast(err.message, "error");
                    loadDashboardData();
                }
            });
        });

        // pour deleted
        document.querySelectorAll(".btn-action-icon--delete").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = parseInt(btn.dataset.id, 10);
                const pharma = pharmaciesList.find(p => p.id === id);
                
                if (confirm(`Êtes-vous sûr de vouloir supprimer la pharmacie "${pharma.nom}" ?`)) {
                    try {
                        showLoadingTable();
                        await apiDeletePharmacy(id);
                        showToast("Pharmacie supprimée avec succès !", "success");
                        loadDashboardData();
                    } catch (err) {
                        showToast(err.message, "error");
                        loadDashboardData();
                    }
                }
            });
        });

        // l'ouverture et les modifs
        document.querySelectorAll(".btn-action-icon--edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id, 10);
                const pharma = pharmaciesList.find(p => p.id === id);
                if (pharma) {
                    openFormPanel(pharma);
                }
            });
        });
    }

    // gestionnaire du panneau de formulaire (ajout / édition)
    if (btnAddPharmacy) {
        btnAddPharmacy.addEventListener("click", () => openFormPanel(null));
    }

    if (btnClosePanel) btnClosePanel.addEventListener("click", closeFormPanel);
    if (slideOverlay) slideOverlay.addEventListener("click", closeFormPanel);

    function openFormPanel(pharmacie = null) {
        if (!slidePanel || !slideOverlay) return;

        if (pharmacie) {
            // Mode Édition
            formTitle.textContent = "Modifier la pharmacie";
            formId.value = pharmacie.id;
            formNom.value = pharmacie.nom;
            formArrondissement.value = pharmacie.arrondissement;
            formQuartier.value = pharmacie.quartier;
            formAdresse.value = pharmacie.adresse || "";
            formTelephone.value = pharmacie.telephone || "";
            formHoraires.value = pharmacie.horaires || "08h00 - 20h00";
            formLat.value = pharmacie.lat;
            formLng.value = pharmacie.lng;
            formDeGarde.checked = pharmacie.deGarde;
        } else {
            // Mode Ajout
            formTitle.textContent = "Ajouter une pharmacie";
            pharmacyForm.reset();
            formId.value = "";
        }

        slidePanel.classList.add("active");
        slideOverlay.classList.add("active");
    }

    function closeFormPanel() {
        if (!slidePanel || !slideOverlay) return;
        slidePanel.classList.remove("active");
        slideOverlay.classList.remove("active");
    }

    if (pharmacyForm) {
        pharmacyForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = formId.value;
            const payload = {
                nom: formNom.value.trim(),
                arrondissement: formArrondissement.value,
                quartier: formQuartier.value.trim(),
                adresse: formAdresse.value.trim(),
                telephone: formTelephone.value.trim(),
                horaires: formHoraires.value.trim() || "08h00 - 20h00",
                lat: parseFloat(formLat.value),
                lng: parseFloat(formLng.value),
                deGarde: formDeGarde.checked
            };

            try {
                if (id) {
                    // Update
                    await apiUpdatePharmacy(parseInt(id, 10), payload);
                    showToast("Pharmacie modifiée avec succès !", "success");
                } else {
                    // Create
                    await apiCreatePharmacy(payload);
                    showToast("Pharmacie ajoutée avec succès !", "success");
                }
                closeFormPanel();
                loadDashboardData();
            } catch (err) {
                showToast(err.message, "error");
            }
        });
    }

    // destion de la deconnexion
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }

    function showToast(message, type = "success") {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        // Disparaître après 3.5 secondes
        setTimeout(() => {
            toast.style.animation = "toast-enter 0.3s ease reverse";
            setTimeout(() => toast.remove(), 300);
        }, 3500);
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
