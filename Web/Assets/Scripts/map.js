// mon systeme de modules est un peu basique, donc on doit déclarer les variables globales ici

/* Variable globale pour la carte*/
let map;
let mapInitialized = false;
let pendingPharmacies = null;
// Objet pour stocker les marqueurs de pharmacie, clé = id pharmacie
let markers = {};
// Marqueur de la position de l'utilisateur
let userMarker = null;
// Marqueur de l'itinéraire tracé (ligne)
let routeLine = null;


function initMap() {
  if (mapInitialized) return;

  map = L.map('map', {
    center: [-4.7790, 11.8636],
    zoom: 13,
    zoomControl: false 
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<i class="fas fa-copyright"></i> <a href="https://openstreetmap.org">OpenStreetMap</a>'
  }).addTo(map);

  mapInitialized = true;

  if (pendingPharmacies) {
    updateMapMarkers(pendingPharmacies);
    pendingPharmacies = null;
  }
}


/** 
 * @param {Array} pharmacies 
 */
function updateMapMarkers(pharmacies) {
  if (!mapInitialized) {
    pendingPharmacies = pharmacies;
    return;
  }

  Object.values(markers).forEach(m => map.removeLayer(m));
  markers = {};

  pharmacies.forEach(p => {

    const iconeCouleur = p.deGarde ? '#00C853' : '#9E9E9E';
    const icone = L.divIcon({
      className: '',
      html: `
        <div style="
          background: ${iconeCouleur};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
        ">
          <i class="fas fa-plus" style="
            color:white;
            font-size:12px;
            transform:rotate(45deg);
          "></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -35]
    });

    const marker = L.marker([p.lat, p.lng], { icon: icone }).addTo(map);

    marker.bindPopup(createMapPopupHTML(p), {
      maxWidth: 240,
      className: 'ks-popup'
    });

    marker.on('popupopen', () => {
      setupPopupButtons(p);
    });

    markers[p.id] = marker;
  });
}


/**
 * @param {Object} p 
 * @returns {string} 
 */
function createMapPopupHTML(p) {
  const statut = p.deGarde ? 'garde' : 'fermee';
  const badge = p.deGarde ? 'De Garde' : 'Fermée';

  return `
    <div class="map-popup">
      <div class="map-popup__name">${p.nom}</div>
      <span class="map-popup__badge map-popup__badge--${statut}">${badge}</span>
      <div class="map-popup__info">
        <i class="fas fa-map-marker-alt"></i>${p.quartier}
      </div>
      <div class="map-popup__info">
        <i class="fas fa-clock"></i>${p.horaires}
      </div>
      <div class="map-popup__actions">
        <button class="popup-btn popup-btn--detail" data-popup-id="${p.id}">
          <i class="fas fa-list-alt"></i> Catalogue
        </button>
        <button class="popup-btn popup-btn--itineraire"
          data-popup-lat="${p.lat}" data-popup-lng="${p.lng}" data-popup-nom="${p.nom}">
          <i class="fas fa-route"></i> Itinéraire
        </button>
      </div>
    </div>
  `;
}


/**
 * @param {Object} p 
 */
function setupPopupButtons(p) {

  const btnDetail = document.querySelector(`[data-popup-id="${p.id}"]`);
  const btnItin = document.querySelector(`[data-popup-lat="${p.lat}"]`);

  if (btnDetail) {
    btnDetail.addEventListener('click', () => {
      map.closePopup();
      renderDetailPanel(p.id);
    });
  }

  if (btnItin) {
    btnItin.addEventListener('click', () => {
      map.closePopup();
      tracerItineraire(p.lat, p.lng, p.nom);
    });
  }
}


/**
 * @param {number} id 
 */
function ouvrirMarqueur(id) {
  const marker = markers[id];
  if (!marker) {
    if (!mapInitialized) {
      showMap();
      setTimeout(() => ouvrirMarqueur(id), 350);
    }
    return;
  }

  if (!mapInitialized) {
    showMap();
    setTimeout(() => ouvrirMarqueur(id), 350);
    return;
  }

  const mapPanel = document.getElementById('map-panel');
  if (mapPanel && !mapPanel.classList.contains('active')) {
    showMap();
    setTimeout(() => ouvrirMarqueur(id), 350);
    return;
  }

  map.setView(marker.getLatLng(), 16, { animate: true });
  marker.openPopup();

  document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showMap() {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  panel.classList.add('active');
  panel.setAttribute('aria-hidden', 'false');

  if (!mapInitialized) {
    initMap();
    return;
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 250);
}

function hideMap() {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  panel.classList.remove('active');
  panel.setAttribute('aria-hidden', 'true');
}

function toggleMap() {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  if (panel.classList.contains('active')) {
    hideMap();
  } else {
    showMap();
  }
}


/**
 * @param {number} destLat
 * @param {number} destLng 
 * @param {string} nomDest 
 */
function tracerItineraire(destLat, destLng, nomDest) {

  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }

  if (!userMarker) {
    demanderPositionUtilisateur(() => {
      tracerItineraire(destLat, destLng, nomDest);
    });
    return;
  }

  const userPos = userMarker.getLatLng();
  routeLine = L.polyline(
    [[userPos.lat, userPos.lng], [destLat, destLng]],
    {
      color: '#1565C0',
      weight: 4,
      dashArray: '10, 8',
      opacity: 0.8
    }
  ).addTo(map);

  map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

  const distanceMetres = map.distance(
    [userPos.lat, userPos.lng],
    [destLat, destLng]
  );

  const distanceAffichee = distanceMetres < 1000
    ? `${Math.round(distanceMetres)} m`
    : `${(distanceMetres / 1000).toFixed(1)} km`;

  showToast(`Itinéraire vers ${nomDest} — ${distanceAffichee} à vol d'oiseau`, 'info');
}


/**
 * @param {Function} callback
 */
function demanderPositionUtilisateur(callback) {

  if (!navigator.geolocation) {
    showToast('Géolocalisation non supportée par ce navigateur');
    return;
  }

  showToast('Localisation en cours...', 'info');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (userMarker) map.removeLayer(userMarker);

      const userIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: #1565C0;
            width: 16px; height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(21,101,192,0.6);
          "></div>
          <div style="
            background: rgba(21,101,192,0.2);
            width: 40px; height: 40px;
            border-radius: 50%;
            position:absolute;
            top:-15px;left:-15px;
            animation: blink 1.5s ease-in-out infinite;
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<i class="fas fa-map-marker-alt"></i> Vous êtes ici');

      map.setView([lat, lng], 14, { animate: true });
      showToast('Position trouvée !', 'success');

      if (callback) callback();
    },
    (error) => {
      const messages = {
        1: 'Accès à la localisation refusé',
        2: 'Position GPS indisponible',
        3: 'Délai de localisation dépassé'
      };
      showToast(messages[error.code] || 'Erreur de localisation');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
