// Données locales des pharmacies - utilisé comme fallback quand l'API n'est pas accessible
const localPharmacies = [
  {
    id: 1,
    nom: 'Pharmacie de la Poste',
    quartier: 'Centre-ville',
    arrondissement: 'Lumumba',
    adresse: 'Avenue Charles de Gaulle, face à La Poste',
    telephone: '+242 06 660 00 01',
    horaires: '07h30 – 21h00',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.774,
    lng: 11.8637
  },
  {
    id: 2,
    nom: 'Pharmacie Centrale',
    quartier: 'Centre-ville',
    arrondissement: 'Lumumba',
    adresse: 'Boulevard Marien Ngouabi, centre commercial',
    telephone: '+242 06 660 00 02',
    horaires: '07h00 – 22h00',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.776,
    lng: 11.865
  },
  {
    id: 3,
    nom: 'Pharmacie du Port',
    quartier: 'Centre-ville',
    arrondissement: 'Lumumba',
    adresse: 'Rue du Commerce, quartier port',
    telephone: '+242 06 660 00 03',
    horaires: '08h00 – 20h00',
    de_garde: false,
    deGarde: false,
    approved: true,
    lat: -4.772,
    lng: 11.861
  },
  {
    id: 4,
    nom: 'Pharmacie Lumumba',
    quartier: 'Lumumba',
    arrondissement: 'Mvou-Mvou',
    adresse: 'Rue Patrice Lumumba, carrefour principal',
    telephone: '+242 06 660 00 04',
    horaires: '07h30 – 21h30',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.78,
    lng: 11.858
  },
  {
    id: 5,
    nom: 'Pharmacie Mavré',
    quartier: 'Tié-Tié',
    arrondissement: 'Tié-Tié',
    adresse: 'Avenue de Tié-Tié, face au marché',
    telephone: '+242 06 660 00 06',
    horaires: '08h00 – 22h00',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.788,
    lng: 11.87
  },
  {
    id: 6,
    nom: 'Pharmacie Loandjili',
    quartier: 'Loandjili',
    arrondissement: 'Loandjili',
    adresse: 'Avenue du Littoral, face à l\'église Saint-Pierre',
    telephone: '+242 06 660 00 12',
    horaires: '08h00 – 22h00',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.7955,
    lng: 11.846
  },
  {
    id: 7,
    nom: 'Pharmacie Espace Santé',
    quartier: 'Mongo-Mpoukou',
    arrondissement: 'Mongo-Mpoukou',
    adresse: 'Avenue de la République, près du marché',
    telephone: '+242 06 660 00 13',
    horaires: '08h00 – 21h30',
    de_garde: false,
    deGarde: false,
    approved: true,
    lat: -4.803,
    lng: 11.877
  },
  {
    id: 8,
    nom: 'Pharmacie de la Corniche',
    quartier: 'Côte Sauvage',
    arrondissement: 'Ngoyo',
    adresse: 'Boulevard de la Corniche, proche hôtel',
    telephone: '+242 06 660 00 14',
    horaires: '07h00 – 22h00',
    de_garde: true,
    deGarde: true,
    approved: true,
    lat: -4.77,
    lng: 11.854
  }
];

const localProduits = [
  { id: 1, code: 'p001', nom: 'Paracétamol 500mg', categorie: 'Antalgique' },
  { id: 2, code: 'p002', nom: 'Amoxicilline 500mg', categorie: 'Antibiotique' },
  { id: 3, code: 'p003', nom: 'Ibuprofène 400mg', categorie: 'Anti-inflammatoire' },
  { id: 4, code: 'p004', nom: 'Artemether/Luméfantrine', categorie: 'Antipaludéen' },
  { id: 5, code: 'p005', nom: 'Oméprazole 20mg', categorie: 'Gastro-intestinal' },
  { id: 6, code: 'p006', nom: 'Metformine 850mg', categorie: 'Diabète' },
  { id: 7, code: 'p007', nom: 'Amlodipine 5mg', categorie: 'Cardiovasculaire' },
  { id: 8, code: 'p008', nom: 'Sérum physiologique', categorie: 'Soins' },
  { id: 9, code: 'p009', nom: 'Ciprofloxacine 500mg', categorie: 'Antibiotique' },
  { id: 10, code: 'p010', nom: 'Diazépam 5mg', categorie: 'Anxiolytique' },
  { id: 11, code: 'p011', nom: 'Vitamine C 500mg', categorie: 'Vitamines' },
  { id: 12, code: 'p012', nom: 'Loratadine 10mg', categorie: 'Antihistaminique' }
];

const localPharmacieMedicaments = [
  { pharmacie_id: 1, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 1, produit_id: 2, prix: 3500, disponible: true },
  { pharmacie_id: 1, produit_id: 3, prix: 1200, disponible: true },
  { pharmacie_id: 1, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 1, produit_id: 5, prix: 2000, disponible: false },
  { pharmacie_id: 1, produit_id: 6, prix: 1800, disponible: true },
  { pharmacie_id: 1, produit_id: 7, prix: 2500, disponible: true },
  { pharmacie_id: 1, produit_id: 8, prix: 800, disponible: true },
  { pharmacie_id: 2, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 2, produit_id: 9, prix: 4200, disponible: true },
  { pharmacie_id: 2, produit_id: 10, prix: 1500, disponible: false },
  { pharmacie_id: 2, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 2, produit_id: 11, prix: 600, disponible: true },
  { pharmacie_id: 2, produit_id: 12, prix: 1000, disponible: true },
  { pharmacie_id: 3, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 3, produit_id: 3, prix: 1200, disponible: true },
  { pharmacie_id: 3, produit_id: 11, prix: 700, disponible: true },
  { pharmacie_id: 3, produit_id: 8, prix: 1500, disponible: true },
  { pharmacie_id: 4, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 4, produit_id: 2, prix: 3500, disponible: true },
  { pharmacie_id: 4, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 4, produit_id: 12, prix: 1000, disponible: true },
  { pharmacie_id: 4, produit_id: 11, prix: 900, disponible: true },
  { pharmacie_id: 5, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 5, produit_id: 2, prix: 3500, disponible: true },
  { pharmacie_id: 5, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 5, produit_id: 11, prix: 600, disponible: true },
  { pharmacie_id: 6, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 6, produit_id: 2, prix: 3500, disponible: true },
  { pharmacie_id: 6, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 6, produit_id: 12, prix: 1000, disponible: true },
  { pharmacie_id: 6, produit_id: 8, prix: 1200, disponible: true },
  { pharmacie_id: 7, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 7, produit_id: 3, prix: 1200, disponible: true },
  { pharmacie_id: 7, produit_id: 6, prix: 1800, disponible: true },
  { pharmacie_id: 7, produit_id: 11, prix: 600, disponible: true },
  { pharmacie_id: 7, produit_id: 5, prix: 1200, disponible: true },
  { pharmacie_id: 8, produit_id: 1, prix: 500, disponible: true },
  { pharmacie_id: 8, produit_id: 2, prix: 3500, disponible: true },
  { pharmacie_id: 8, produit_id: 4, prix: 4500, disponible: true },
  { pharmacie_id: 8, produit_id: 9, prix: 4200, disponible: true },
  { pharmacie_id: 8, produit_id: 6, prix: 3000, disponible: true }
];

// Fonctions locales pour simuler l'API
function getLocalPharmacies(options = {}) {
  let filtered = [...localPharmacies];
  
  if (options.gardeOnly) {
    filtered = filtered.filter(p => p.de_garde === true);
  }
  
  if (options.recherche) {
    const q = options.recherche.toLowerCase();
    filtered = filtered.filter(p => 
      p.nom.toLowerCase().includes(q) || 
      p.quartier.toLowerCase().includes(q) ||
      p.arrondissement.toLowerCase().includes(q)
    );
  }
  
  if (options.arrondissement && options.arrondissement !== 'tous') {
    filtered = filtered.filter(p => p.arrondissement === options.arrondissement);
  }
  
  const garde = filtered.filter(p => p.de_garde).length;
  
  return {
    total: filtered.length,
    garde: garde,
    pharmacies: filtered
  };
}

function getLocalPharmacieDetail(id) {
  const pharmacy = localPharmacies.find(p => p.id === id);
  if (!pharmacy) return null;
  
  const medicaments = localPharmacieMedicaments
    .filter(pm => pm.pharmacie_id === id)
    .map(pm => {
      const produit = localProduits.find(p => p.id === pm.produit_id);
      return {
        id: pm.produit_id,
        code: produit ? produit.code : null,
        nom: produit ? produit.nom : null,
        categorie: produit ? produit.categorie : null,
        prix: pm.prix,
        disponible: pm.disponible
      };
    });
  
  return {
    ...pharmacy,
    catalogue: medicaments
  };
}

function rechercherMedicamentLocal(terme, gardeOnly = false) {
  const q = terme.toLowerCase();
  const grouped = new Map();
  
  localPharmacieMedicaments.forEach(entry => {
    const produit = localProduits.find(p => p.id === entry.produit_id);
    if (!produit) return;
    
    const nomMatch = produit.nom.toLowerCase().includes(q) || produit.categorie.toLowerCase().includes(q);
    if (!nomMatch) return;
    
    const pharma = localPharmacies.find(p => p.id === entry.pharmacie_id);
    if (!pharma) return;
    if (gardeOnly && !pharma.de_garde) return;
    
    if (!grouped.has(pharma.id)) {
      grouped.set(pharma.id, {
        pharmacie_id: pharma.id,
        pharmacie_nom: pharma.nom,
        quartier: pharma.quartier,
        telephone: pharma.telephone,
        de_garde: pharma.de_garde,
        lat: pharma.lat,
        lng: pharma.lng,
        medicaments: []
      });
    }
    
    grouped.get(pharma.id).medicaments.push({
      id: produit.id,
      code: produit.code,
      nom: produit.nom,
      categorie: produit.categorie,
      prix: entry.prix,
      disponible: entry.disponible
    });
  });
  
  return {
    terme: terme,
    total: grouped.size,
    resultats: [...grouped.values()]
  };
}

// Rendre les fonctions disponibles globalement pour api.js
window.getLocalPharmacies = getLocalPharmacies;
window.getLocalPharmacieDetail = getLocalPharmacieDetail;
window.rechercherMedicamentLocal = rechercherMedicamentLocal;
