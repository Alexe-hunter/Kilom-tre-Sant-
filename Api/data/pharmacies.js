// mon systeme de données pour les pharmacies de Pointe-Noire
const pharmacies = [

  // donnée du premier arrondissement, centre-ville
  {
    id: 1,
    nom: "Pharmacie de la Poste",
    quartier: "Centre-ville",
    arrondissement: "Lumumba",
    adresse: "Avenue Charles de Gaulle, face à La Poste",
    telephone: "+242 06 660 00 01",
    horaires: "07h30 – 21h00",
    deGarde: true,

    // valeur pour les coordonnées vis à vis de leaflet
    lat: -4.7740,
    lng: 11.8637,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p003", nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", prix: 1200, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p005", nom: "Oméprazole 20mg", categorie: "Gastro-intestinal", prix: 2000, disponible: false },
      { id: "p006", nom: "Metformine 850mg", categorie: "Diabète", prix: 1800, disponible: true },
      { id: "p007", nom: "Amlodipine 5mg", categorie: "Cardiovasculaire", prix: 2500, disponible: true },
      { id: "p008", nom: "Sérum physiologique", categorie: "Soins", prix: 800, disponible: true }
    ]
  },

  {
    id: 2,
    nom: "Pharmacie Centrale",
    quartier: "Centre-ville",
    arrondissement: "Lumumba",
    adresse: "Boulevard Marien Ngouabi, centre commercial",
    telephone: "+242 06 660 00 02",
    horaires: "07h00 – 22h00",
    deGarde: true,
    lat: -4.7760,
    lng: 11.8650,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p009", nom: "Ciprofloxacine 500mg", categorie: "Antibiotique", prix: 4200, disponible: true },
      { id: "p010", nom: "Diazépam 5mg", categorie: "Anxiolytique", prix: 1500, disponible: false },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p011", nom: "Vitamine C 500mg", categorie: "Vitamines", prix: 600, disponible: true },
      { id: "p012", nom: "Loratadine 10mg", categorie: "Antihistaminique", prix: 1000, disponible: true }
    ]
  },

  {
    id: 3,
    nom: "Pharmacie du Port",
    quartier: "Centre-ville",
    arrondissement: "Lumumba",
    adresse: "Rue du Commerce, quartier port",
    telephone: "+242 06 660 00 03",
    horaires: "08h00 – 20h00",
    deGarde: false,
    lat: -4.7720,
    lng: 11.8610,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p003", nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", prix: 1200, disponible: true },
      { id: "p013", nom: "Zinc 20mg", categorie: "Vitamines", prix: 700, disponible: true },
      { id: "p014", nom: "Gel hydroalcoolique", categorie: "Hygiène", prix: 1500, disponible: true }
    ]
  },

  // donnée de deuxième arrandissemnet
  {
    id: 4,
    nom: "Pharmacie Lumumba",
    quartier: "Lumumba",
    arrondissement: "Mvou-Mvou",
    adresse: "Rue Patrice Lumumba, carrefour principal",
    telephone: "+242 06 660 00 04",
    horaires: "07h30 – 21h30",
    deGarde: true,
    lat: -4.7800,
    lng: 11.8580,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p015", nom: "Chloroquine 250mg", categorie: "Antipaludéen", prix: 2000, disponible: false },
      { id: "p016", nom: "Fer + Acide folique", categorie: "Vitamines", prix: 900, disponible: true },
      { id: "p017", nom: "Prednisolone 5mg", categorie: "Corticoïde", prix: 1800, disponible: true }
    ]
  },

  {
    id: 5,
    nom: "Pharmacie Mvou-Mvou",
    quartier: "Mvou-Mvou",
    arrondissement: "Mvou-Mvou",
    adresse: "Avenue de l'Indépendance, Mvou-Mvou",
    telephone: "+242 06 660 00 05",
    horaires: "08h00 – 20h00",
    deGarde: false,
    lat: -4.7820,
    lng: 11.8600,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p011", nom: "Vitamine C 500mg", categorie: "Vitamines", prix: 600, disponible: true },
      { id: "p018", nom: "Pommade Bétaméthasone", categorie: "Dermatologie", prix: 2200, disponible: true }
    ]
  },


  {
    id: 6,
    nom: "Pharmacie Mavré",
    quartier: "Tié-Tié",
    arrondissement: "Tié-Tié",
    adresse: "Avenue de Tié-Tié, face au marché",
    telephone: "+242 06 660 00 06",
    horaires: "08h00 – 22h00",
    deGarde: true,
    lat: -4.7880,
    lng: 11.8700,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p019", nom: "Metronidazole 250mg", categorie: "Antibiotique", prix: 1500, disponible: true },
      { id: "p020", nom: "Albendazole 400mg", categorie: "Antiparasitaire", prix: 1200, disponible: true },
      { id: "p021", nom: "Doxycycline 100mg", categorie: "Antibiotique", prix: 2800, disponible: false },
      { id: "p022", nom: "Sels de réhydratation", categorie: "Gastro-intestinal", prix: 400, disponible: true }
    ]
  },

  {
    id: 7,
    nom: "Pharmacie des Plateaux",
    quartier: "Les Plateaux",
    arrondissement: "Tié-Tié",
    adresse: "Quartier Les Plateaux, rue des jacarandas",
    telephone: "+242 06 660 00 07",
    horaires: "07h00 – 23h00",
    deGarde: true,
    lat: -4.7860,
    lng: 11.8720,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p003", nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", prix: 1200, disponible: true },
      { id: "p007", nom: "Amlodipine 5mg", categorie: "Cardiovasculaire", prix: 2500, disponible: true },
      { id: "p023", nom: "Insuline Glargine", categorie: "Diabète", prix: 15000, disponible: true },
      { id: "p024", nom: "Furosémide 40mg", categorie: "Cardiovasculaire", prix: 1000, disponible: true }
    ]
  },

  // donnée du quatrième arrondissement, Loandjili
  {
    id: 8,
    nom: "Pharmacie Saint-Joseph",
    quartier: "Loandjili",
    arrondissement: "Loandjili",
    adresse: "Rue de l'Hôpital, près CHU Loandjili",
    telephone: "+242 06 660 00 08",
    horaires: "07h00 – 22h00",
    deGarde: true,
    lat: -4.7950,
    lng: 11.8450,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p025", nom: "Morphine 10mg", categorie: "Antalgique fort", prix: 8000, disponible: true },
      { id: "p026", nom: "Héparine sodique", categorie: "Anticoagulant", prix: 12000, disponible: true },
      { id: "p027", nom: "Sérum glucosé 5%", categorie: "Perfusion", prix: 3000, disponible: true },
      { id: "p022", nom: "Sels de réhydratation", categorie: "Gastro-intestinal", prix: 400, disponible: true }
    ]
  },

  {
    id: 9,
    nom: "Pharmacie du CHU",
    quartier: "Zone Hospitalière",
    arrondissement: "Loandjili",
    adresse: "CHU de Pointe-Noire, aile principale",
    telephone: "+242 06 660 00 09",
    horaires: "24h/24 – 7j/7",
    deGarde: true,
    lat: -4.7970,
    lng: 11.8430,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p025", nom: "Morphine 10mg", categorie: "Antalgique fort", prix: 8000, disponible: true },
      { id: "p026", nom: "Héparine sodique", categorie: "Anticoagulant", prix: 12000, disponible: true },
      { id: "p028", nom: "Adrénaline 1mg/ml", categorie: "Urgence", prix: 5000, disponible: true },
      { id: "p029", nom: "Atropine 0.5mg", categorie: "Urgence", prix: 4000, disponible: true },
      { id: "p027", nom: "Sérum glucosé 5%", categorie: "Perfusion", prix: 3000, disponible: true },
      { id: "p030", nom: "Sérum salé 0.9%", categorie: "Perfusion", prix: 2800, disponible: true }
    ]
  },

// donnée du cinquième arrondissement, Mongo-Mpoukou
  {
    id: 10,
    nom: "Pharmacie Mongo-Mpoukou",
    quartier: "Mongo-Mpoukou",
    arrondissement: "mongo-Mpoukou",
    adresse: "Carrefour Mongo-Mpoukou, avenue principale",
    telephone: "+242 06 660 00 10",
    horaires: "08h00 – 21h00",
    deGarde: true,
    lat: -4.8020,
    lng: 11.8800,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p019", nom: "Metronidazole 250mg", categorie: "Antibiotique", prix: 1500, disponible: true },
      { id: "p020", nom: "Albendazole 400mg", categorie: "Antiparasitaire", prix: 1200, disponible: true },
      { id: "p016", nom: "Fer + Acide folique", categorie: "Vitamines", prix: 900, disponible: true }
    ]
  },

  {
    id: 11,
    nom: "Pharmacie Ngoyo",
    quartier: "Ngoyo",
    arrondissement: "Mongo-Mpoukou",
    adresse: "Cité Ngoyo, rue du stade",
    telephone: "+242 06 660 00 11",
    horaires: "08h00 – 22h30",
    deGarde: true,
    lat: -4.8050,
    lng: 11.8850,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p002", nom: "Amoxicilline 500mg", categorie: "Antibiotique", prix: 3500, disponible: true },
      { id: "p003", nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", prix: 1200, disponible: true },
      { id: "p004", nom: "Artemether/Luméfantrine", categorie: "Antipaludéen", prix: 4500, disponible: true },
      { id: "p031", nom: "Cotrimoxazole 480mg", categorie: "Antibiotique", prix: 1000, disponible: true },
      { id: "p032", nom: "Nystatine crème", categorie: "Antifongique", prix: 2500, disponible: true }
    ]
  },

  // donnée du sixième arrondissement, Côte Sauvage et Vindoulou
  {
    id: 12,
    nom: "Pharmacie de la Côte Sauvage",
    quartier: "Côte Sauvage",
    arrondissement: "Ngoyo",
    adresse: "Boulevard de la Corniche, bord de mer",
    telephone: "+242 06 660 00 12",
    horaires: "09h00 – 21h00",
    deGarde: true,
    lat: -4.7680,
    lng: 11.8550,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p012", nom: "Loratadine 10mg", categorie: "Antihistaminique", prix: 1000, disponible: true },
      { id: "p033", nom: "Crème solaire SPF50", categorie: "Dermatologie", prix: 4500, disponible: true },
      { id: "p034", nom: "Collyre Tobramycine", categorie: "Ophtalmologie", prix: 3000, disponible: true }
    ]
  },

  {
    id: 13,
    nom: "Pharmacie Vindoulou",
    quartier: "Vindoulou",
    arrondissement: "Ngoyo",
    adresse: "Avenue Vindoulou, carrefour école",
    telephone: "+242 06 660 00 13",
    horaires: "08h00 – 20h00",
    deGarde: false,
    lat: -4.7700,
    lng: 11.8520,
    catalogue: [
      { id: "p001", nom: "Paracétamol 500mg", categorie: "Antalgique", prix: 500, disponible: true },
      { id: "p011", nom: "Vitamine C 500mg", categorie: "Vitamines", prix: 600, disponible: true },
      { id: "p013", nom: "Zinc 20mg", categorie: "Vitamines", prix: 700, disponible: true },
      { id: "p018", nom: "Pommade Bétaméthasone", categorie: "Dermatologie", prix: 2200, disponible: false }
    ]
  }
];

// exportation du module pour pouvoir l'utiliser dans d'autres fichiers
module.exports = pharmacies;
