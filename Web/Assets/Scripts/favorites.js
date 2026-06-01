// systeme de favoris basé sur localStorage
const STORAGE_KEY = 'ks_favorites';

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('localStorage indisponible:', e);
  }
}

function toggleFavorite(id) {
  const favoris = loadFavorites();
  let nouveaux;

  if (favoris.includes(id)) {
    nouveaux = favoris.filter(fid => fid !== id);
    showToast('Retiré des favoris');
  } else {
    nouveaux = [...favoris, id];
    showToast('Ajouté aux favoris ❤', 'success');
  }

  saveFavorites(nouveaux);
  return nouveaux.includes(id);
}

function applyFavoriteStates() {
  const favoris = loadFavorites();
  document.querySelectorAll('.btn-fav').forEach(btn => {
    const id = parseInt(btn.dataset.id, 10);
    btn.classList.toggle('is-favorite', favoris.includes(id));
    btn.setAttribute('aria-label',
      favoris.includes(id) ? 'Retirer des favoris' : 'Ajouter aux favoris'
    );
  });
}

function initFavorites() {
  document.getElementById('cards-grid').addEventListener('click', e => {
    const btn = e.target.closest('.btn-fav');
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    const estFav = toggleFavorite(id);
    btn.classList.toggle('is-favorite', estFav);
  });
}
