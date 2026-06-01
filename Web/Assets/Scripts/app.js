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
  const garde = data.pharmacies.filter(p => p.deGarde).length;
  document.getElementById('header-badge').innerHTML = `
    <span class="badge__dot"></span>
    ${garde} de garde sur ${data.pharmacies.length}
  `;

  console.log(`<i class="fa-solid fa-check"></i> ${data.total} pharmacies chargées — ${data.garde} de garde`);
});
