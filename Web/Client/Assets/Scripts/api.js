// api.js - Service d'appel de l'API locale du projet

const API_URL = "http://localhost:3000/api";

// Helper pour obtenir les en-têtes avec authentification Bearer
function getHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

// Déconnexion
function logout() {
    localStorage.clear();
    window.location.href = "/Client/auth.html";
}

// 1. Récupérer toutes les pharmacies
async function apiFetchPharmacies() {
    try {
        const response = await fetch(`${API_URL}/pharmacies`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des pharmacies");
        return await response.json();
    } catch (error) {
        console.error(error);
        return { pharmacies: [], total: 0, garde: 0 };
    }
}

// 2. Récupérer le détail d'une pharmacie (avec catalogue)
async function apiFetchPharmacieDetail(id) {
    try {
        const response = await fetch(`${API_URL}/pharmacies/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(`Erreur lors de la récupération de la pharmacie ${id}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// 3. Créer une nouvelle pharmacie (Super-Admin)
async function apiCreatePharmacy(pharmacyData) {
    try {
        const response = await fetch(`${API_URL}/pharmacies`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(pharmacyData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || "Erreur lors de la création de la pharmacie");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 4. Modifier une pharmacie (Super-Admin / Pharmacien associé)
async function apiUpdatePharmacy(id, pharmacyData) {
    try {
        const response = await fetch(`${API_URL}/pharmacies/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(pharmacyData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || "Erreur lors de la modification de la pharmacie");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 5. Supprimer une pharmacie (Super-Admin)
async function apiDeletePharmacy(id) {
    try {
        const response = await fetch(`${API_URL}/pharmacies/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || "Erreur lors de la suppression de la pharmacie");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 6. Mettre à jour le catalogue de médicaments (Super-Admin / Pharmacien)
async function apiUpdateCatalogue(id, medicaments) {
    try {
        const response = await fetch(`${API_URL}/pharmacies/${id}/catalogue`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ medicaments })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || "Erreur lors de la mise à jour du catalogue");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {
    logout,
    apiFetchPharmacies,
    apiFetchPharmacieDetail,
    apiCreatePharmacy,
    apiUpdatePharmacy,
    apiDeletePharmacy,
    apiUpdateCatalogue
};
// Admin specific API calls
async function apiFetchPendingPharmacies() {
    try {
        const response = await fetch(`${API_URL}/pharmacies/pending`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erreur lors de la récupération des demandes');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { pharmacies: [], total: 0 };
    }
}

async function apiApprovePharmacy(id) {
    try {
        const response = await fetch(`${API_URL}/pharmacies/${id}/approve`, { method: 'PUT', headers: getHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || 'Erreur lors de l\'approbation');
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function apiCreateSchedule(payload) {
    try {
        const response = await fetch(`${API_URL}/schedules`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.erreur || 'Erreur lors de la création du planning');
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function apiFetchSchedules() {
    try {
        const response = await fetch(`${API_URL}/schedules`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erreur lors de la récupération des plannings');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { schedules: [], total: 0 };
    }
}

export {
    apiFetchPendingPharmacies,
    apiApprovePharmacy,
    apiCreateSchedule,
    apiFetchSchedules
};
