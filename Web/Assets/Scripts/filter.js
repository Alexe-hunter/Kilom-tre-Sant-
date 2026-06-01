// systeme de filtrage global pour la carte et la liste
const filterState = {
  mode:'pharmacie',  
  recherche:'',
  arrondissement: 'tous',
  gardeOnly:false
};

let debounceTimer = null;

async function applyFiltersAndRender() {

  renderPharmacies([], true);

  if (filterState.mode === 'medicament' && filterState.recherche.trim()) {
    const data = await rechercherMedicament(
      filterState.recherche,
      filterState.gardeOnly
    );
    renderMedicamentResults(data);

    if (data.resultats.length > 0) {
      const pharmaciesAvecMed = data.resultats.map(r => ({
        id: r.pharmacieId,
        nom: r.pharmacieNom,
        quartier: r.quartier,
        telephone: r.telephone,
        deGarde: r.deGarde,
        lat: r.lat,
        lng: r.lng
      }));
      updateMapMarkers(pharmaciesAvecMed);
    }

  } else {
    const data = await fetchPharmacies({
      gardeOnly:      filterState.gardeOnly,
      recherche:      filterState.recherche,
      arrondissement: filterState.arrondissement
    });

    renderPharmacies(data.pharmacies);
    updateMapMarkers(data.pharmacies);
  }
}

function initFilters() {

  const tabs = document.querySelectorAll('.search-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      filterState.mode= tab.dataset.tab;
      filterState.recherche = '';

      const input = document.getElementById('search-input');
      input.value = '';
      input.placeholder = filterState.mode === 'medicament'
        ? 'Chercher un médicament (ex: paracétamol)...'
        : 'Rechercher par nom ou quartier...';

      document.getElementById('search-clear').classList.remove('visible');
      applyFiltersAndRender();
    });
  });

// barre de recherche
  const searchInput = document.getElementById('search-input');
  const clearBtn    = document.getElementById('search-clear');

  searchInput.addEventListener('input', () => {
    filterState.recherche = searchInput.value;

    if (searchInput.value.length > 0) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyFiltersAndRender();
    }, 400);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value    = '';
    filterState.recherche = '';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    applyFiltersAndRender();
  });

  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.filter;

      if (action === 'garde') {
        filterState.gardeOnly = !filterState.gardeOnly;
        btn.classList.toggle('active--garde', filterState.gardeOnly);

      } else {
        filterState.arrondissement = action;
        filterBtns.forEach(b => {
          if (b.dataset.filter !== 'garde') b.classList.remove('active');
        });
        btn.classList.add('active');
      }

      applyFiltersAndRender();
    });
  });

// bouton de localisation
  const btnLoc = document.getElementById('btn-localisation');
  if (btnLoc) {
    btnLoc.addEventListener('click', () => {
      demanderPositionUtilisateur();
    });
  }
}


/** construction dynamique des filtres d'arrondissement en fonction des données récupérées
 * @param {Array} pharmacies 
 */
function buildArrondissementFilters(pharmacies) {
  const container = document.getElementById('filters-container');

  const arrondissements = [
    ...new Set(pharmacies.map(p => p.arrondissement))
  ].sort();

  const btnsHtml = arrondissements.map(arr => `
    <button class="filter-btn" data-filter="${arr}">${arr}</button>
  `).join('');

  container.insertAdjacentHTML('beforeend', btnsHtml);

  container.querySelectorAll('.filter-btn:not([data-initialized])').forEach(btn => {
    btn.dataset.initialized = 'true';
    btn.addEventListener('click', () => {
      filterState.arrondissement = btn.dataset.filter;
      container.querySelectorAll('.filter-btn').forEach(b => {
        if (b.dataset.filter !== 'garde') b.classList.remove('active');
      });
      btn.classList.add('active');
      applyFiltersAndRender();
    });
  });
}
