-- Base de donnée PostegreSQL
-- Différentes Tables principales : pharmacies, users, produits, pharmacie_medicaments

DROP TABLE IF EXISTS pharmacie_medicaments CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS pharmacies CASCADE;

CREATE TABLE pharmacies (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    quartier VARCHAR(100) NOT NULL,
    arrondissement VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    telephone VARCHAR(30),
    horaires VARCHAR(80),
    de_garde BOOLEAN NOT NULL DEFAULT FALSE,
    lat NUMERIC(9,6),
    lng NUMERIC(9,6)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- j'utilise des mot passes hashés pour plus de sécurité
    nom VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('super-admin', 'pharmacien')),
    pharmacy_id INT REFERENCES pharmacies(id)
);

CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    categorie VARCHAR(100) NOT NULL
);

CREATE TABLE pharmacie_medicaments (
    pharmacie_id INT NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    produit_id INT NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
    prix NUMERIC(10,2) NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (pharmacie_id, produit_id)
);

-- Données d'exemple pour les pharmacies
INSERT INTO pharmacies (nom, quartier, arrondissement, adresse, telephone, horaires, de_garde, lat, lng) VALUES
('Pharmacie de la Poste', 'Centre-ville', 'Lumumba', 'Avenue Charles de Gaulle, face à La Poste', '+242 06 660 00 01', '07h30 – 21h00', TRUE, -4.774000, 11.863700),
('Pharmacie Centrale', 'Centre-ville', 'Lumumba', 'Boulevard Marien Ngouabi, centre commercial', '+242 06 660 00 02', '07h00 – 22h00', TRUE, -4.776000, 11.865000),
('Pharmacie du Port', 'Centre-ville', 'Lumumba', 'Rue du Commerce, quartier port', '+242 06 660 00 03', '08h00 – 20h00', FALSE, -4.772000, 11.861000),
('Pharmacie Lumumba', 'Lumumba', 'Mvou-Mvou', 'Rue Patrice Lumumba, carrefour principal', '+242 06 660 00 04', '07h30 – 21h30', TRUE, -4.780000, 11.858000),
('Pharmacie Mavré', 'Tié-Tié', 'Tié-Tié', 'Avenue de Tié-Tié, face au marché', '+242 06 660 00 06', '08h00 – 22h00', TRUE, -4.788000, 11.870000),
('Pharmacie Loandjili', 'Loandjili', 'Loandjili', 'Avenue du Littoral, face à l’église Saint-Pierre', '+242 06 660 00 12', '08h00 – 22h00', TRUE, -4.795500, 11.846000),
('Pharmacie Espace Santé', 'Mongo-Mpoukou', 'Mongo-Mpoukou', 'Avenue de la République, près du marché', '+242 06 660 00 13', '08h00 – 21h30', FALSE, -4.803000, 11.877000),
('Pharmacie de la Corniche', 'Côte Sauvage', 'Ngoyo', 'Boulevard de la Corniche, proche hôtel', '+242 06 660 00 14', '07h00 – 22h00', TRUE, -4.770000, 11.854000);

-- Produits // médicaments
INSERT INTO produits (code, nom, categorie) VALUES
('p001', 'Paracétamol 500mg', 'Antalgique'),
('p002', 'Amoxicilline 500mg', 'Antibiotique'),
('p003', 'Ibuprofène 400mg', 'Anti-inflammatoire'),
('p004', 'Artemether/Luméfantrine', 'Antipaludéen'),
('p005', 'Oméprazole 20mg', 'Gastro-intestinal'),
('p006', 'Metformine 850mg', 'Diabète'),
('p007', 'Amlodipine 5mg', 'Cardiovasculaire'),
('p008', 'Sérum physiologique', 'Soins'),
('p009', 'Ciprofloxacine 500mg', 'Antibiotique'),
('p010', 'Diazépam 5mg', 'Anxiolytique'),
('p011', 'Vitamine C 500mg', 'Vitamines'),
('p012', 'Loratadine 10mg', 'Antihistaminique');

-- Catalogue // stock des pharmacies
INSERT INTO pharmacie_medicaments (pharmacie_id, produit_id, prix, disponible) VALUES
(1, 1, 500.00, TRUE),
(1, 2, 3500.00, TRUE),
(1, 3, 1200.00, TRUE),
(1, 4, 4500.00, TRUE),
(1, 5, 2000.00, FALSE),
(1, 6, 1800.00, TRUE),
(1, 7, 2500.00, TRUE),
(1, 8, 800.00, TRUE),
(2, 1, 500.00, TRUE),
(2, 9, 4200.00, TRUE),
(2, 10, 1500.00, FALSE),
(2, 4, 4500.00, TRUE),
(2, 11, 600.00, TRUE),
(2, 12, 1000.00, TRUE),
(3, 1, 500.00, TRUE),
(3, 3, 1200.00, TRUE),
(3, 11, 700.00, TRUE),
(3, 8, 1500.00, TRUE),
(4, 1, 500.00, TRUE),
(4, 2, 3500.00, TRUE),
(4, 4, 4500.00, TRUE),
(4, 12, 1000.00, TRUE),
(4, 11, 900.00, TRUE),
(5, 1, 500.00, TRUE),
(5, 2, 3500.00, TRUE),
(5, 4, 4500.00, TRUE),
(5, 11, 600.00, TRUE),
(6, 1, 500.00, TRUE),
(6, 2, 3500.00, TRUE),
(6, 4, 4500.00, TRUE),
(6, 12, 1000.00, TRUE),
(6, 8, 1200.00, TRUE),
(7, 1, 500.00, TRUE),
(7, 3, 1200.00, TRUE),
(7, 6, 1800.00, TRUE),
(7, 11, 600.00, TRUE),
(7, 5, 1200.00, TRUE),
(8, 1, 500.00, TRUE),
(8, 2, 3500.00, TRUE),
(8, 4, 4500.00, TRUE),
(8, 9, 4200.00, TRUE),
(8, 6, 3000.00, TRUE);

-- Utilisateurs de l'application
INSERT INTO users (email, password_hash, nom, role, pharmacy_id) VALUES
('admin@kilometresante.cg', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Super Administrateur', 'super-admin', NULL),
('poste@kilometresante.cg', '1f3e47121e4fcee83c2c5f2bd014b7cad8dfe0d2b470ff25956054eee7ac5ce1', 'Pharmacien - Poste', 'pharmacien', 1),
('centrale@kilometresante.cg', '7f0bbf2d7470da8908d5295f53af32fac87ee2bf4f4fa59755ffeb6b8c5f97a0', 'Pharmacien - Centrale', 'pharmacien', 2);

