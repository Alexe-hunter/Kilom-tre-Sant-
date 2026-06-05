// coeur de mon app, système nerveux central, point d'entrée de mon code

document.addEventListener('DOMContentLoaded', async () => {

  console.log('<i class="fa-solid fa-info-circle"></i> Kilomètre-Santé v2 — démarrage');

  initMap();
  initDetailPanel();
  initCardActions();
  initFavorites();

  renderPharmacies([], true);

  const data = await fetchPharmacies();
  renderPharmacies(data.pharmacies);
  updateMapMarkers(data.pharmacies);
  buildArrondissementFilters(data.pharmacies);

  initFilters();
  const total = data.pharmacies.length;
  const garde = data.pharmacies.filter(p => p.deGarde).length;
  
  const statTotal = document.getElementById('stat-total');
  const statGarde = document.getElementById('stat-garde');
  if (statTotal) statTotal.textContent = total;
  if (statGarde) statGarde.textContent = garde;

  console.log(`<i class="fa-solid fa-check"></i> ${data.total} pharmacies chargées — ${data.garde} de garde`);
});
