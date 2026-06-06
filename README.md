# Kilomètre-Santé

> Application web pour trouver les pharmacies de garde à Pointe-Noire, Congo — Carte interactive + Catalogue des médicaments

---

## Présentation du projet

**Kilomètre-Santé** est une application web qui permet aux habitants de Pointe-Noire de trouver rapidement les pharmacies de garde et de vérifier la disponibilité des médicaments.

### Ce que fait l'application

Le code se divise en deux parties :

**Backend (API) - Dossier `Api/`**
- Serveur Node.js avec Express qui expose une API REST
- Gère les données de 13 pharmacies avec leurs catalogues de médicaments
- Fournit des endpoints pour rechercher des pharmacies, filtrer par garde, et trouver des médicaments
- Configure CORS pour permettre au frontend de communiquer avec l'API

**Frontend (Web) - Dossier `Web/`**
- Interface utilisateur en HTML/CSS/JavaScript vanilla
- Carte interactive Leaflet.js montrant les pharmacies avec marqueurs colorés (vert = garde, gris = fermé)
- Barre de recherche avec filtres (par nom, quartier, médicament)
- Système de favoris avec localStorage
- Panneau de détail slide-in pour voir le catalogue complet d'une pharmacie
- Design responsive mobile-first

---

## Comment démarrer le projet

### Prérequis

- Node.js installé sur votre ordinateur
- Un terminal (cmd, PowerShell, ou Git Bash)

### Depuis GitHub (clonage du projet)

1. **Clonez le dépôt**
```bash
git clone [votre-url-github]
cd Project Kil_Santé
```

2. **Installez les dépendances backend**
```bash
cd Api
npm install
```

3. **Démarrez le serveur backend**
```bash
npm run dev
```
Le backend sera disponible sur `http://localhost:3000`

4. **Ouvrez un deuxième terminal** pour le frontend
```bash
cd Web
npx serve .
```
Le frontend sera disponible sur `http://localhost:5500` (ou le port affiché)

5. **Ouvrez votre navigateur** sur l'URL du frontend

---

## Lien de démonstration

**Version en ligne :** [Lien Netlify à venir]

> Vous pouvez utiliser l'application directement sans rien installer en cliquant sur le lien ci-dessus.

---

## Routes API disponibles

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/pharmacies` | Toutes les pharmacies |
| GET | `/api/pharmacies?garde=true` | Seulement les pharmacies de garde |
| GET | `/api/pharmacies?q=mavré` | Recherche par nom ou quartier |
| GET | `/api/pharmacies/:id` | Détail d'une pharmacie + catalogue complet |
| GET | `/api/pharmacies/:id/catalogue?q=paracetamol` | Recherche dans le catalogue d'une pharmacie |
| GET | `/api/pharmacies/medicament/recherche?q=artemether` | Rechercher un médicament dans toutes les pharmacies |

---

## Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript ES6 (Vanilla, sans framework)
- **Carte interactive** : Leaflet.js + OpenStreetMap (gratuit, sans clé API requise)
- **Backend** : Node.js + Express.js
- **Icônes** : Font Awesome 6.5
- **Déploiement** : Netlify (frontend) + Render.com (backend)

---

## Suite du projet

Fonctionnalités prévues pour les prochaines versions :

### Dashboard Admin
- Interface d'administration pour gérer les pharmacies
- Ajout/modification/suppression de pharmacies
- Gestion des utilisateurs et des rôles
- Statistiques d'utilisation de l'application

### Dashboard Pharmacien
- Espace personnel pour chaque pharmacien
- Mise à jour en temps réel du catalogue de médicaments
- Gestion des horaires de garde
- Notification automatique en cas de garde assignée
- Historique des modifications

### Autres améliorations
- Authentification des utilisateurs
- Système de notifications push
- Intégration avec les systèmes de santé locaux
- Application mobile native (React Native)
- Paiement en ligne pour réservation de médicaments
- avis et notes des pharmacies par les utilisateurs

---

## Structure du projet

```
Project Kil_Santé/
├── Api/                          # Backend Node.js
│   ├── server.js                 # Point d'entrée du serveur
│   ├── package.json              # Dépendances backend
│   ├── routes/                   # Routes API
│   │   └── pharmacies.js         # Routes pharmacies
│   └── data/                     # Données
│       └── pharmacies.js         # 13 pharmacies + catalogues
│
└── Web/                          # Frontend
    ├── index.html                # Page principale
    ├── Assets/
    │   ├── Styles/               # CSS
    │   │   ├── variables.css     # Variables de design
    │   │   ├── reset.css         # Reset CSS
    │   │   └── style.css         # Styles principaux
    │   ├── Scripts/              # JavaScript
    │   │   ├── api.js            # Appels API
    │   │   ├── render.js         # Rendu HTML
    │   │   ├── map.js            # Carte Leaflet
    │   │   ├── filter.js         # Filtres et recherche
    │   │   ├── favorites.js      # Gestion favoris
    │   │   ├── ui.js             # Interface utilisateur
    │   │   └── app.js            # Point d'entrée
    │   ├── img/                  # Images
    │   └── Videos/               # Vidéos (hero video) 
```

---

## Espace Administration & Sécurité

L'Espace Professionnel et Administration a été restructuré et complété pour offrir un contrôle total et sécurisé de l'application en temps réel.

### Fonctionnement de l'Architecture & Routage
1. **Aiguillage Centralisé (Gatekeeper)** : Les pages d'administration sont regroupées sous le dossier `/Client/`. L'accès à ce dossier passe par `/Client/Index.html` qui sert de routeur-gardien. Il vérifie la validité du jeton d'authentification (`token`) et le rôle (`role`) de l'utilisateur stocké dans le `localStorage` et effectue l'aiguillage automatique.
2. **Page d'Authentification Unique** : Les pharmaciens et les super-administrateurs se connectent via `/auth.html`. Le backend authentifie l'utilisateur et retourne son rôle.
3. **Sécurité (Route Guards)** : Si un utilisateur tente d'accéder directement à un tableau de bord par son URL (ex: `/Client/Pharmacien/Dash-Pharma.html`) sans être connecté, les scripts d'initialisation détectent l'absence de droits et le redirigent instantanément vers l'aiguillage.

### Comptes de Test (Pré-configurés)
Pour tester les différents espaces de l'application, utilisez les identifiants suivants :

* **Super-Admin** (Gestion de tout le réseau, ajout/modification/suppression de pharmacies et statuts) :
  * **Email** : `admin@kilometresante.cg`
  * **Mot de passe** : `admin123`

* **Pharmacien de la Poste** (Gestion du stock et horaires de sa propre pharmacie uniquement) :
  * **Email** : `poste@kilometresante.cg`
  * **Mot de passe** : `poste123`

* **Pharmacien de la Centrale** :
  * **Email** : `centrale@kilometresante.cg`
  * **Mot de passe** : `centrale123`

* **Autres Pharmaciens** (ex: Pharmacie ID 4 - Lumumba, etc.) :
  * **Email** : `pharma4@kilometresante.cg` (incrémenter le numéro de 3 à 13)
  * **Mot de passe** : `pharma4123` (remplacer le numéro correspondant)

---

## Licence

Ce projet est développé dans le cadre de Kilomètre-Santé pour améliorer l'accès aux soins à Pointe-Noire.

---

## Équipe projet

### MOA (Maître d'Ouvrage)
- **Client** : Kilomètre-Santé
- **Porteur du projet** : Mr MITHOU Webster
- **Objectif** : Améliorer l'accès aux pharmacies de garde à Pointe-Noire

### MOE (Maître d'Œuvre)
- **Développeur** : TOKOBANZA Exaucé
- **Rôle** : Conception et développement de l'application
- **Technologies** : Node.js, Express, HTML/CSS/JavaScript, Leaflet.js
- **Assister IA** : Windsurf

dernière chose vidéo du hero non présente normal mon git push a été refusé
la plupart des commit sont fait en local due au refus 

### UI UX:
- **design**: encore non - fourni, esquice réalisé par Lovable depuis le debut du projet
- **flyer**: réalisé par votre hote, sur Canva à refaire sur photoshop pour plus de professionalisme
- **pub - youtube**: en cours ......
- **logo**: conçu par mes soins, que ce soit le logo client et le logo admin, conçu sur Affinity Studio

## Suite du projet:

Chargement .... Encore en cours de reflexion, la perfection tue donc stay cool mode activé.