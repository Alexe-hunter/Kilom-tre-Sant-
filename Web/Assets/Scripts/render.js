// mon systeme de rendu est séparé du reste pour garder une bonne organisation du code


/** pour l'affichage de la liste des pharmacies après un appel API
 * @param {Array}   pharmacies
 * @param {boolean} loading
 */
function renderPharmacies(pharmacies, loading = false) {

  const grid = document.getElementById('cards-grid');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('results-count');

  if (loading) {
    grid.innerHTML = `
      <div class="loader" style="grid-column: 1/-1">
        <div class="loader__spinner"></div>
        <p class="loader__text">Chargement des pharmacies...</p>
      </div>
    `;
    return;
  }

  if (pharmacies.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.add('visible');
    countEl.innerHTML = '<strong>0</strong> résultat';
    return;
  }

  emptyState.classList.remove('visible');

  const garde = pharmacies.filter(p => p.deGarde).length;
  countEl.innerHTML = `
    <strong>${pharmacies.length}</strong> pharmacie${pharmacies.length > 1 ? 's' : ''}
    &nbsp;·&nbsp;
    <span style="color:var(--c-garde)"><strong>${garde}</strong> de garde</span>
  `;

  grid.innerHTML = pharmacies.map(p => createPharmacyCard(p)).join('');

  if (typeof applyFavoriteStates === 'function') applyFavoriteStates();
}


/**
 * @param {Object} p
 * @returns {string}
 */
function createPharmacyCard(p) {

  const statut = p.deGarde ? 'garde' : 'fermee';
  const badgeTexte = p.deGarde ? 'De Garde' : 'Fermée';

  return `
    <article
      class="pharmacy-card pharmacy-card--${statut}"
      data-id="${p.id}"
      role="listitem"
    >
      <div class="card__header">
        <h2 class="card__name">${p.nom}</h2>
        <span class="card__badge card__badge--${statut}">${badgeTexte}</span>
      </div>

      <div class="card__info">
        <div class="card__info-item">
          <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
          <span>${p.quartier} — ${p.arrondissement}</span>
        </div>
        <div class="card__info-item">
          <i class="fas fa-clock" aria-hidden="true"></i>
          <span>${p.horaires}</span>
        </div>
        <div class="card__info-item">
          <i class="fas fa-phone" aria-hidden="true"></i>
          <span>${p.telephone}</span>
        </div>
      </div>

      <div class="card__footer">
        <!--
          data-id est l'attribut HTML personnalisé qu'on lit en JS
          via element.dataset.id pour savoir sur quelle pharmacie
          l'utilisateur a cliqué.
        -->
        <button class="btn-detail" data-id="${p.id}" data-action="detail">
          <i class="fas fa-list-alt" aria-hidden="true"></i>
          Voir détail & catalogue
        </button>
        <button class="btn-itineraire" data-id="${p.id}" data-action="itineraire"
          data-lat="${p.lat}" data-lng="${p.lng}" data-nom="${p.nom}">
          <i class="fas fa-route" aria-hidden="true"></i>
          Itinéraire
        </button>
        <button class="btn-fav" data-id="${p.id}">
          <i class="fas fa-heart" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `;
}


/**
 * @param {number} id
 */
async function renderDetailPanel(id) {

  const overlay = document.getElementById('detail-overlay');
  const panel = document.getElementById('detail-panel');

  overlay.classList.add('active');
  panel.classList.add('active');

  document.getElementById('detail-name').textContent = 'Chargement...';
  document.getElementById('detail-infos').innerHTML = '';
  document.getElementById('detail-actions').innerHTML = '';
  document.getElementById('catalogue-section').innerHTML = `
    <div class="loader">
      <div class="loader__spinner"></div>
      <p class="loader__text">Chargement du catalogue...</p>
    </div>
  `;

  const pharmacie = await fetchPharmacieDetail(id);

  if (!pharmacie) {
    document.getElementById('detail-name').textContent = 'Erreur de chargement';
    return;
  }

  const statut = pharmacie.deGarde ? 'garde' : 'fermee';
  const badgeTexte = pharmacie.deGarde ? 'De Garde' : 'Fermée';

  document.getElementById('detail-name').innerHTML = `
    ${pharmacie.nom}
    <span class="card__badge card__badge--${statut}" style="font-size:var(--t-sm);vertical-align:middle;margin-left:8px">${badgeTexte}</span>
  `;

  document.getElementById('detail-infos').innerHTML = `
    <div class="detail-info-item">
      <i class="fas fa-map-marker-alt"></i>
      <span>${pharmacie.adresse}</span>
    </div>
    <div class="detail-info-item">
      <i class="fas fa-city"></i>
      <span>${pharmacie.quartier} — ${pharmacie.arrondissement}</span>
    </div>
    <div class="detail-info-item">
      <i class="fas fa-clock"></i>
      <span>${pharmacie.horaires}</span>
    </div>
  `;

  document.getElementById('detail-actions').innerHTML = `
    <a href="tel:${pharmacie.telephone.replace(/\s/g, '')}" class="btn-appel">
      <i class="fas fa-phone"></i> Appeler
    </a>
    <button class="btn-itineraire-detail"
      data-lat="${pharmacie.lat}" data-lng="${pharmacie.lng}"
      data-nom="${pharmacie.nom}" data-action="itineraire">
      <i class="fas fa-route"></i> Itinéraire
    </button>
  `;

  const catalogueSection = document.getElementById('catalogue-section');
  catalogueSection.dataset.catalogue = JSON.stringify(pharmacie.catalogue);

  renderCatalogue(pharmacie.catalogue);
}


/**
 * @param {Array}  catalogue
 * @param {string} filtre
 */
function renderCatalogue(catalogue, filtre = '') {

  const section = document.getElementById('catalogue-section');

  let items = catalogue;
  if (filtre.trim()) {
    const t = filtre.toLowerCase();
    items = catalogue.filter(m =>
      m.nom.toLowerCase().includes(t) ||
      m.categorie.toLowerCase().includes(t)
    );
  }

  const dispo = items.filter(m => m.disponible).length;
  const indispo = items.filter(m => !m.disponible).length;

  section.innerHTML = `
    <!-- Barre de recherche dans le catalogue -->
    <div class="catalogue-search-wrapper">
      <i class="fas fa-search catalogue-search-icon"></i>
      <input
        type="search"
        class="catalogue-search"
        id="catalogue-search"
        placeholder="Chercher un médicament..."
        value="${filtre}"
        autocomplete="off"
      >
    </div>

    <!-- Titre avec compteurs -->
    <div class="catalogue-title">
      <i class="fas fa-pills" style="color:var(--c-accent)"></i>
      Catalogue
      <span class="catalogue-count">
        ${items.length} produit${items.length > 1 ? 's' : ''}
        &nbsp;·&nbsp;
        <span style="color:var(--c-dispo)">${dispo} dispo</span>
        &nbsp;·&nbsp;
        <span style="color:var(--c-indispo)">${indispo} indispo</span>
      </span>
    </div>

    <!-- Liste des médicaments -->
    <div class="medicaments-list">
      ${items.length === 0
      ? `<p style="text-align:center;color:var(--c-muted);padding:var(--s-8)">
             Aucun médicament trouvé pour "${filtre}"
           </p>`
      : items.map(m => createMedicamentItem(m)).join('')
    }
    </div>
  `;

  const searchInput = document.getElementById('catalogue-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const catalogueStocke = JSON.parse(section.dataset.catalogue || '[]');
      renderCatalogue(catalogueStocke, searchInput.value);
    });
    setTimeout(() => searchInput.focus(), 100);
  }
}


/**
 * @param {Object} m 
 * @returns {string}
 */
function createMedicamentItem(m) {
  const cls = m.disponible ? 'disponible' : 'indisponible';
  const txt = m.disponible ? 'Disponible' : 'Indisponible';
  const dcls = m.disponible ? 'ok' : 'non';

  return `
    <div class="medicament-item medicament-item--${cls}">
      <div class="medicament-info">
        <div class="medicament-nom">${m.nom}</div>
        <div class="medicament-categorie">${m.categorie}</div>
      </div>
      <div class="medicament-right">
        <span class="medicament-prix">${m.prix.toLocaleString('fr-FR')} FCFA</span>
        <span class="medicament-dispo medicament-dispo--${dcls}">${txt}</span>
      </div>
    </div>
  `;
}


/**
 * @param {Object} data - Réponse de l'API rechercherMedicament()
 */
function renderMedicamentResults(data) {

  const grid = document.getElementById('cards-grid');
  const countEl = document.getElementById('results-count');
  const emptyState = document.getElementById('empty-state');

  if (data.total === 0) {
    grid.innerHTML = '';
    emptyState.classList.add('visible');
    countEl.innerHTML = `Médicament "<strong>${data.terme}</strong>" introuvable`;
    return;
  }

  emptyState.classList.remove('visible');
  countEl.innerHTML = `
    Médicament "<strong>${data.terme}</strong>" trouvé dans
    <strong>${data.total}</strong> pharmacie${data.total > 1 ? 's' : ''}
  `;

  grid.innerHTML = data.resultats.map(r => {
    const statut = r.deGarde ? 'garde' : 'fermee';
    const badge = r.deGarde ? 'De Garde' : 'Fermée';

    const medsHtml = r.medicaments.map(m => `
      <div class="medicament-item medicament-item--${m.disponible ? 'disponible' : 'indisponible'}"
           style="margin-bottom:var(--s-2)">
        <div class="medicament-info">
          <div class="medicament-nom">${m.nom}</div>
          <div class="medicament-categorie">${m.categorie}</div>
        </div>
        <div class="medicament-right">
          <span class="medicament-prix">${m.prix.toLocaleString('fr-FR')} FCFA</span>
          <span class="medicament-dispo medicament-dispo--${m.disponible ? 'ok' : 'non'}">
            ${m.disponible ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>
    `).join('');

    return `
      <article class="pharmacy-card pharmacy-card--${statut}" data-id="${r.pharmacieId}" role="listitem">
        <div class="card__header">
          <h2 class="card__name">${r.pharmacieNom}</h2>
          <span class="card__badge card__badge--${statut}">${badge}</span>
        </div>
        <div class="card__info">
          <div class="card__info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${r.quartier}</span>
          </div>
          <div class="card__info-item">
            <i class="fas fa-phone"></i>
            <span>${r.telephone}</span>
          </div>
        </div>
        <!-- Médicaments trouvés inline dans la carte -->
        <div style="margin-bottom:var(--s-4)">${medsHtml}</div>
        <div class="card__footer">
          <button class="btn-detail" data-id="${r.pharmacieId}" data-action="detail">
            <i class="fas fa-list-alt"></i> Catalogue complet
          </button>
          <button class="btn-itineraire" data-id="${r.pharmacieId}" data-action="itineraire"
            data-lat="${r.lat}" data-lng="${r.lng}" data-nom="${r.pharmacieNom}">
            <i class="fas fa-route"></i> Itinéraire
          </button>
        </div>
      </article>
    `;
  }).join('');

  if (typeof applyFavoriteStates === 'function') applyFavoriteStates();
}
