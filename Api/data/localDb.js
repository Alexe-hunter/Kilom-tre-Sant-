const pharmacies = [
  {
    id: 1,
    nom: 'Pharmacie de la Poste',
    quartier: 'Centre-ville',
    arrondissement: 'Lumumba',
    adresse: 'Avenue Charles de Gaulle, face à La Poste',
    telephone: '+242 06 660 00 01',
    horaires: '07h30 – 21h00',
    de_garde: true,
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
    lat: -4.788,
    lng: 11.87
  },
  {
    id: 6,
    nom: 'Pharmacie Loandjili',
    quartier: 'Loandjili',
    arrondissement: 'Loandjili',
    adresse: 'Avenue du Littoral, face à l’église Saint-Pierre',
    telephone: '+242 06 660 00 12',
    horaires: '08h00 – 22h00',
    de_garde: true,
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
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
    approved: true,
    verification_status: 'approved',
    cert_pharmacien: null,
    cert_existence: null,
    lat: -4.77,
    lng: 11.854
  }
];

const produits = [
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

const pharmacieMedicaments = [
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

const users = [
  {
    id: 1,
    email: 'admin@kilometresante.cg',
    password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    nom: 'Super Administrateur',
    role: 'super-admin',
    pharmacy_id: null
  },
  {
    id: 2,
    email: 'poste@kilometresante.cg',
    password_hash: '1f3e47121e4fcee83c2c5f2bd014b7cad8dfe0d2b470ff25956054eee7ac5ce1',
    nom: 'Pharmacien - Poste',
    role: 'pharmacien',
    pharmacy_id: 1
  },
  {
    id: 3,
    email: 'centrale@kilometresante.cg',
    password_hash: '7f0bbf2d7470da8908d5295f53af32fac87ee2bf4f4fa59755ffeb6b8c5f97a0',
    nom: 'Pharmacien - Centrale',
    role: 'pharmacien',
    pharmacy_id: 2
  }
];

const schedules = [
  {
    id: 1,
    titre: 'Garde de nuit - Lumumba',
    type: 'nuit',
    date_debut: '2026-08-22T20:00:00.000Z',
    date_fin: '2026-08-23T08:00:00.000Z',
    details: { note: 'Pharmacie de la Poste et pharmacie Centrale' },
    created_by: 1,
    notified: false
  }
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizeValue(value) {
  if (value === undefined || value === null) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const upper = trimmed.toUpperCase();
    if (upper === 'TRUE') return true;
    if (upper === 'FALSE') return false;
    if (trimmed === '') return '';
    if (!Number.isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);
    return trimmed;
  }

  return value;
}

function applyTextFilter(rows, value) {
  const q = String(value || '').replace(/%/g, '').toLowerCase();
  if (!q) return rows;

  return rows.filter((row) => {
    const haystack = [
      row.nom,
      row.quartier,
      row.arrondissement,
      row.adresse,
      row.telephone,
      row.nom || '',
      row.categorie || '',
      row.code || ''
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

function makePharmacyRow(row) {
  return {
    id: row.id,
    nom: row.nom,
    quartier: row.quartier,
    arrondissement: row.arrondissement,
    adresse: row.adresse,
    telephone: row.telephone,
    horaires: row.horaires,
    de_garde: row.de_garde,
    deGarde: row.de_garde,
    approved: row.approved,
    verification_status: row.verification_status,
    cert_pharmacien: row.cert_pharmacien,
    cert_existence: row.cert_existence,
    lat: row.lat,
    lng: row.lng
  };
}

function parseAssignments(queryText) {
  const matches = [...queryText.matchAll(/([A-Za-z_]+)\s*=\s*\$\d+/g)];
  return matches.map((match) => match[1]);
}

function query(text, params = []) {
  const sql = String(text || '').trim();
  const upper = sql.toUpperCase();

  if (!sql) {
    return { rows: [] };
  }

  if (upper === 'BEGIN' || upper === 'COMMIT' || upper === 'ROLLBACK') {
    return { rows: [] };
  }

  if (upper.startsWith('SELECT 1') || upper.includes('SELECT COUNT(*)')) {
    return { rows: [{ count: 1 }] };
  }

  if (upper.includes('FROM USERS') && upper.includes('WHERE EMAIL')) {
    const email = String(params[0] || '').toLowerCase();
    return { rows: users.filter((user) => user.email.toLowerCase() === email) };
  }

  if (upper.includes('FROM PHARMACIES WHERE 1=1') || upper.includes('FROM PHARMACIES WHERE') || upper.includes('FROM PHARMACIES ORDER BY')) {
    const rows = clone(pharmacies);
    let filtered = rows;

    if (upper.includes('APPROVED = TRUE')) {
      filtered = filtered.filter((item) => item.approved === true);
    } else if (upper.includes('APPROVED = FALSE')) {
      filtered = filtered.filter((item) => item.approved === false);
    }

    if (upper.includes('DE_GARDE = TRUE')) {
      filtered = filtered.filter((item) => item.de_garde === true);
    }

    const hasSearch = upper.includes('LOWER(NOM) LIKE') || upper.includes('LOWER(QUARTIER) LIKE') || upper.includes('LOWER(ARRONDISSEMENT) LIKE');
    if (hasSearch) {
      const q = String(params[params.length - 1] || '').replace(/%/g, '').toLowerCase();
      filtered = applyTextFilter(filtered, q);
    }

    if (upper.includes('ARRONDISSEMENT =')) {
      const arrondissement = String(params[params.length - 1] || '');
      filtered = filtered.filter((item) => item.arrondissement === arrondissement);
    }

    if (upper.includes('ORDER BY NOM')) {
      filtered.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (upper.includes('ORDER BY ID')) {
      filtered.sort((a, b) => a.id - b.id);
    }

    return { rows: filtered.map(makePharmacyRow) };
  }

  if (upper.includes('FROM PHARMACIES WHERE ID')) {
    const id = Number(params[0]);
    const found = pharmacies.find((item) => item.id === id);
    return { rows: found ? [makePharmacyRow(found)] : [] };
  }

  if (upper.includes('FROM PHARMACIES') && upper.includes('APPROVED = FALSE')) {
    return {
      rows: pharmacies
        .filter((item) => item.approved === false)
        .map(makePharmacyRow)
    };
  }

  if (upper.includes('FROM PHARMACIE_MEDICAMENTS PM') && upper.includes('JOIN PRODUITS P')) {
    const pharmacieId = Number(params[0]);
    const rows = pharmacieMedicaments
      .filter((entry) => entry.pharmacie_id === pharmacieId)
      .map((entry) => {
        const produit = produits.find((item) => item.id === entry.produit_id);
        return {
          id: entry.produit_id,
          code: produit ? produit.code : null,
          nom: produit ? produit.nom : null,
          categorie: produit ? produit.categorie : null,
          prix: entry.prix,
          disponible: entry.disponible
        };
      });
    return { rows };
  }

  if (upper.includes('INSERT INTO PHARMACIES')) {
    const nextId = Math.max(...pharmacies.map((item) => item.id), 0) + 1;
    const item = {
      id: nextId,
      nom: normalizeValue(params[0]),
      quartier: normalizeValue(params[1]),
      arrondissement: normalizeValue(params[2]),
      adresse: normalizeValue(params[3]) || '',
      telephone: normalizeValue(params[4]) || '',
      horaires: normalizeValue(params[5]) || '08h00 - 20h00',
      de_garde: Boolean(normalizeValue(params[6])),
      approved: false,
      verification_status: 'pending',
      cert_pharmacien: null,
      cert_existence: null,
      lat: normalizeValue(params[7]),
      lng: normalizeValue(params[8])
    };
    pharmacies.push(item);
    return { rows: [makePharmacyRow(item)] };
  }

  if (upper.includes('UPDATE PHARMACIES SET')) {
    const rowId = Number(params[params.length - 1]);
    const assignmentNames = parseAssignments(sql);
    const pharmacy = pharmacies.find((item) => item.id === rowId);
    if (!pharmacy) return { rows: [] };

    assignmentNames.forEach((name, index) => {
      const value = normalizeValue(params[index]);
      const key = name.toLowerCase().replace(/\s+/g, '_');
      if (key === 'approved') pharmacy[key] = value === 'TRUE' || value === true;
      else if (key === 'de_garde') pharmacy[key] = value === 'TRUE' || value === true;
      else pharmacy[key] = value;
    });

    return { rows: [makePharmacyRow(pharmacy)] };
  }

  if (upper.includes('DELETE FROM PHARMACIES')) {
    const id = Number(params[0]);
    const index = pharmacies.findIndex((item) => item.id === id);
    if (index >= 0) {
      const [deleted] = pharmacies.splice(index, 1);
      return { rows: [{ id: deleted.id }] };
    }
    return { rows: [] };
  }

  if (upper.includes('INSERT INTO USERS')) {
    const nextId = Math.max(...users.map((item) => item.id), 0) + 1;
    const user = {
      id: nextId,
      email: normalizeValue(params[0]),
      password_hash: normalizeValue(params[1]),
      nom: normalizeValue(params[2]),
      role: normalizeValue(params[3]),
      pharmacy_id: normalizeValue(params[4]) || null
    };
    users.push(user);
    return {
      rows: [{
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        pharmacy_id: user.pharmacy_id
      }]
    };
  }

  if (upper.includes('INSERT INTO PHARMACIE_MEDICAMENTS')) {
    const entry = {
      pharmacie_id: Number(params[0]),
      produit_id: Number(params[1]),
      prix: Number(params[2]),
      disponible: normalizeValue(params[3]) !== false
    };
    pharmacieMedicaments.push(entry);
    return { rows: [] };
  }

  if (upper.includes('DELETE FROM PHARMACIE_MEDICAMENTS')) {
    const pharmacieId = Number(params[0]);
    for (let i = pharmacieMedicaments.length - 1; i >= 0; i -= 1) {
      if (pharmacieMedicaments[i].pharmacie_id === pharmacieId) {
        pharmacieMedicaments.splice(i, 1);
      }
    }
    return { rows: [] };
  }

  if (upper.includes('FROM SCHEDULES')) {
    return { rows: clone(schedules) };
  }

  if (upper.includes('INSERT INTO SCHEDULES')) {
    const nextId = Math.max(...schedules.map((item) => item.id), 0) + 1;
    const item = {
      id: nextId,
      titre: normalizeValue(params[0]),
      type: normalizeValue(params[1]),
      date_debut: normalizeValue(params[2]),
      date_fin: normalizeValue(params[3]) || null,
      details: normalizeValue(params[4]) || null,
      created_by: normalizeValue(params[5]) || null,
      notified: false
    };
    schedules.push(item);
    return { rows: [item] };
  }

  if (upper.includes('FROM PHARMACIES') && upper.includes('LOWER(P.NOM) LIKE')) {
    const terme = String(params[0] || '').replace(/%/g, '').toLowerCase();
    const grouped = new Map();

    pharmacieMedicaments.forEach((entry) => {
      const produit = produits.find((item) => item.id === entry.produit_id);
      if (!produit) return;

      const nomMatch = produit.nom.toLowerCase().includes(terme) || produit.categorie.toLowerCase().includes(terme);
      if (!nomMatch) return;

      const pharma = pharmacies.find((item) => item.id === entry.pharmacie_id);
      if (!pharma) return;
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

    return { rows: [...grouped.values()] };
  }

  return { rows: [] };
}

module.exports = { query };
