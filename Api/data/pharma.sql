-- Base de donnée PostegreSQL
--différentes tables créer : pharmacies, users, produits, pharmacie_medicaments

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
    password_hash VARCHAR(255) NOT NULL,
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


