// mon système de notification (toast) pour afficher des messages temporaires à l'utilisateur
/**
 * @param {string} message
 * @param {string} type
 * @param {number} duree 
 */
function showToast(message, type = 'default', duree = 3000) {

  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast${type !== 'default' ? ' toast--' + type : ''}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duree + 300);
}

function initDetailPanel() {

  const overlay = document.getElementById('detail-overlay');
  const panel   = document.getElementById('detail-panel');

  overlay.addEventListener('click', closeDetailPanel);

  document.getElementById('btn-close-detail').addEventListener('click', closeDetailPanel);

  document.getElementById('detail-actions').addEventListener('click', e => {
    const btn = e.target.closest('[data-action="itineraire"]');
    if (!btn) return;

    const lat = parseFloat(btn.dataset.lat);
    const lng = parseFloat(btn.dataset.lng);
    const nom = btn.dataset.nom;

    closeDetailPanel();
    setTimeout(() => tracerItineraire(lat, lng, nom), 350);
  });

  let touchStartY = 0;

  panel.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  panel.addEventListener('touchend', e => {
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (deltaY > 80) closeDetailPanel();
  }, { passive: true });
}

function closeDetailPanel() {
  document.getElementById('detail-overlay').classList.remove('active');
  document.getElementById('detail-panel').classList.remove('active');
}

function initCardActions() {

  const grid = document.getElementById('cards-grid');

  grid.addEventListener('click', e => {

    const btnDetail = e.target.closest('[data-action="detail"]');
    if (btnDetail) {
      const id = parseInt(btnDetail.dataset.id, 10);
      renderDetailPanel(id);
      return;
    }

    const btnItin = e.target.closest('[data-action="itineraire"]');
    if (btnItin) {
      const lat = parseFloat(btnItin.dataset.lat);
      const lng = parseFloat(btnItin.dataset.lng);
      const nom = btnItin.dataset.nom;
      ouvrirMarqueur(parseInt(btnItin.dataset.id, 10));
      tracerItineraire(lat, lng, nom);
      return;
    }

    const card = e.target.closest('.pharmacy-card');
    if (card && !e.target.closest('button') && !e.target.closest('a')) {
      const id = parseInt(card.dataset.id, 10);
      ouvrirMarqueur(id);
    }
  });
}
