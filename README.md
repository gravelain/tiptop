# My Project - The Tip Top

Bienvenue dans le projet **"My Project - The Tip Top"**, une plateforme web de jeu concours permettant aux utilisateurs de remporter des lots via un code de jeu obtenu sur leur ticket de caisse. Ce projet repose sur une architecture **microservices**, conteneurisée avec **Docker** et orchestrée via **Docker Compose v2**.

## Table des matières

1. [Introduction](#introduction)
2. [Technologies utilisées](#technologies-utilisées)
3. [Architecture du projet](#architecture-du-projet)
4. [Services et ports d’accès](#services-et-ports-daccès)
5. [Configuration de l’environnement](#configuration-de-lenvironnement)
6. [Commandes utiles](#commandes-utiles)
7. [Démarrer les services](#démarrer-les-services)
8. [Accéder aux conteneurs](#accéder-aux-conteneurs)
9. [Conclusion](#conclusion)

## Introduction

Ce projet repose sur une architecture **microservices** où chaque composant (frontend, backend, base de données, monitoring) est conteneurisé dans un **Docker**. L’infrastructure utilise **Docker Compose** pour l’orchestration des services et **Traefik** comme proxy inverse. Le backend est développé avec **php symfony** et le frontend avec **Angular**.

L'application s’appuie sur **SonarQube** pour l'analyse de la qualité du code et utilise des bases de données **PostgreSQL** pour SonarQube et **MySQL** pour les données métiers de l’application. **Prometheus** et **Grafana** sont utilisés pour la collecte et la visualisation des métriques de performance.

Le projet est déployé sur un **VPS** avec l'IP [95.111.240.167](http://95.111.240.167/).

## Technologies utilisées

| Technologie  | Utilité  | Justification  |
|--------------|---------|----------------|
| **php symfony**  | Backend | Framework modulaire et scalable, idéal pour des APIs performantes. |
| **Angular**  | Frontend | Framework React optimisé pour le rendu côté serveur (SSR) et les performances SEO. |
| **PostgreSQL** | Base de données (SonarQube) | Base relationnelle robuste et performante, utilisée pour stocker les données de SonarQube. |
| **Docker**  | Conteneurisation | Permet l’isolation des services et assure la portabilité entre les environnements. |
| **Docker Compose**  | Orchestration des services | Facilite la gestion de multiples conteneurs et leurs dépendances. |
| **Jenkins**  | CI/CD | Automatisation des tests, des builds, et des déploiements. |
| **Prometheus**  | Monitoring | Outil de collecte et de stockage de métriques pour surveiller l’application. |
| **Grafana**  | Visualisation | Interface graphique pour suivre les métriques collectées par Prometheus. |
| **SonarQube**  | Analyse de code | Outil pour analyser la qualité du code et détecter les vulnérabilités. |
| **Traefik**  | Proxy inverse et Load Balancer | Permet de gérer le routage du trafic et l'équilibrage de charge, avec des fonctionnalités SSL et de sécurité. |



---



## 📂 Structure du Projet


Voici la structure du projet détaillée :

```plaintext

# Projet TipTop

## Structure du projet


tiptop/
├── apps/                            # Applications métiers (mon_repo)
│   ├── backend/                     # Backend php symfony
│   │   ├── Dockerfile.dev           # Dockerfile pour l'environnement de développement
│   │   ├── Dockerfile.prod          # Dockerfile pour l'environnement de production
│   │   ├── .env                     # Variables d'environnement pour le développement
│   │   ├── .env.preprod             # Variables d'environnement pour la préproduction
│   │   ├── .env.prod                # Variables d'environnement pour la production
│   │   ├── package.json             # Dépendances et scripts du backend
│   │   ├── package-lock.json        # Verrouillage des versions des dépendances
│   │   └── src/                     # Code source du backend (php symfony)
│   │       ├── main.ts              # Point d'entrée de l'application
│   │       ├── app.module.ts        # Module principal de l'application
│   │       ├── app.controller.ts    # Exemple de contrôleur
│   │       └── app.service.ts       # Exemple de service
│   └── frontend/                    # Frontend Angular (avec SSR)
│       ├── Dockerfile.dev           # Dockerfile pour l'environnement de développement
│       ├── Dockerfile.prod          # Dockerfile pour l'environnement de production
│       ├── nginx.conf               # Configuration Nginx pour SSR
│       ├── .env                     # Variables d'environnement pour le développement
│       ├── .env.preprod             # Variables d'environnement pour la préproduction
│       ├── .env.prod                # Variables d'environnement pour la production
│       ├── package.json             # Dépendances et scripts du frontend
│       ├── package-lock.json        # Verrouillage des versions des dépendances
│       └── pages/                    # Pages du frontend (SSR)
│           ├── index.js             # Page d'accueil
│           ├── _app.js              # Configuration globale de l'application
│           └── ...                  # Autres pages et composants
├── infrastructure/                 # Infrastructure & outils divers
│   ├── monitoring/                 # Outils de monitoring (Grafana, Prometheus, Traefik)
│   │   ├── grafana/                # Dashboards Grafana personnalisés
│   │   │   ├── dashboards/         # Fichiers de dashboards personnalisés
│   │   │   └── grafana.ini         # Fichier de configuration Grafana
│   │   ├── prometheus/             # Configuration Prometheus
│   │   │   └── prometheus.yml      # Fichier principal de configuration Prometheus
│   │   └── traefik/                # Configuration de Traefik (Reverse Proxy)
│   │       └── traefik.yml         # Fichier de configuration de Traefik
│   ├── ci-cd/                      # CI/CD (Jenkins, SonarQube, etc.)
│   │   ├── jenkins/                # Configuration Jenkins
│   │   │   ├── data/               # Volume Jenkins (plugins, jobs, etc.)
│   │   │   └── Jenkinsfile         # Pipeline de déploiement Jenkins
│   │   └── sonarqube/              # Configuration SonarQube
│   │       └── sonar.properties    # Fichier de configuration de SonarQube
│   └── scripts/                    # Scripts utilitaires (déploiement, backup, etc.)
│       ├── deploy.sh               # Script de déploiement automatique (Dev/Preprod/Prod)
│       ├── backup.sh               # Sauvegarde manuelle
│       └── restore.sh              # Restauration
├── .scannerwork/                   # Résultats d'analyse Sonar (générés)
├── .gitignore
├── .dockerignore
├── Makefile                        # Commandes raccourcies (`make dev`, `make test`, etc.)
├── README.md                       # Documentation du projet
├── sonar-project.properties        # Config SonarScanner CLI
├── docker-compose.yaml             # Docker Compose principal (base commune)
├── docker-compose.dev.yaml         # Environnement de développement
├── docker-compose.preprod.yaml     # Préproduction (staging)
├── docker-compose.prod.yaml        # Production (live)
```

---


## Résumé des Ports par Environnement

| **Service**    | **Dev**      | **Preprod**  | **Prod**     |
|----------------|--------------|--------------|--------------|
| **Traefik**    | 80, 443      | 80, 443      | 80, 443      |
| **MySQL**      | 3307:3306    | 3308:3306    | 3308:3306    |
| **PostgreSQL** | 5434:5432    | 5435:5432    | 5436:5432    |
| **SonarQube**  | 9001:9000    | 9001:9000    | 9001:9000    |
| **Prometheus** | 9091:9090    | 9091:9090    | 9091:9090    |
| **Grafana**    | 3001:3000    | 3002:3000    | 3003:3000    |
| **Backend**    | 5001:5000    | 5002:5000    | 5003:5000    |
| **Frontend**   | 3001:3000    | 3002:3000    | 3003:3000    |


## Configuration de l’environnement

Commandes utiles
dcu : Démarre les services en arrière-plan
dcd : Arrêt des services
dcr : Redémarrage des services
dcl : Voir les logs globaux
dbackend : Démarrer uniquement le backend
dfrontend : Démarrer uniquement le frontend



---

## 🛠 Services Définis

### Base de Données (PostgreSQL)
- Image : `postgres:15-alpine`
- Port : `5432`
- Stockage persistant : `db-data:/var/lib/postgresql/data`

### Backend (NestJS)
- Construit depuis `./backend`
- Variables d'environnement :
  - `NODE_ENV`
  - `DATABASE_URL=postgres://admin:admin@db:5432/mydatabase`
  - `JWT_SECRET=mysecretkey`
- Port : `4000`

### Frontend (Next.js)
- Construit depuis `./frontend`
- Port : `3000`

### Monitoring (Prometheus & Grafana)
- **Prometheus** : `prom/prometheus:v2.45.0`, exposé sur `9090`
- **Grafana** : `grafana/grafana-oss:10.2.2`, exposé sur `3001`

### Analyse de Code (SonarQube)
- Image : `sonarqube:lts`
- Port : `9000`
- Base de données dédiée sur PostgreSQL

### Intégration Continue (Jenkins)
- Image : `jenkins/jenkins:lts-jdk17`
- Ports : `8080`, `50000`

### Proxy Inverse (Traefik)
- Image : `traefik:v2.5`
- Port : `80`
- Configuration : Activation du mode API et détection automatique des conteneurs Docker

---


## 🔄 CI/CD & Déploiement
L'intégration continue et le déploiement sont gérés avec **Jenkins** sur un **VPS**. Jenkins est configuré pour :
- Exécuter des tests automatisés (linting, unit tests, intégration...)
- Construire et pousser des images Docker
- Déployer l'application sur le serveur VPS

Grâce à cette infrastructure, les nouvelles versions du projet sont automatiquement testées et déployées en production de manière sécurisée et optimisée.


---

## 🚀 Utilisation avec Docker Compose

### 🌟 Définition de l'environnement

Ajoutez cette fonction à votre `.bashrc` ou `.zshrc` :

```bash
dcenv() {
  case "$1" in
    dev|preprod|prod)
      export ENV=$1
      export ENV_FILE=".env.$ENV"
      echo "✅ Environnement défini sur : $ENV"
      ;;
    *)
      echo "❌ Spécifie un environnement valide : dev, preprod ou prod"
      return 1
      ;;
  esac
}
```


### 🌟 Choisir son environnement

En fonction de si vous souhaitez travailler en dev, preprod ou prod, il faudrait selectionner son 
environnement de travail avant de démarrer les services : choisi ton env et tape la commande appropriée! 

```bash
dcenv dev  #  ✅ Environnement défini sur : dev
```

```bash
dcenv preprod  #  ✅ Environnement défini sur : preprod
```


```bash
dcenv prod  #  ✅ Environnement défini sur : prod
```


#### 🏗 Démarrer les services
```bash
dcu  # Up (démarrage des services en arrière-plan)
```

#### ❌ Arrêter les services
```bash
dcd  # Down (arrêt des services)
```

#### 🔄 Redémarrer les services
```bash
dcr  # Restart
```

#### 🔍 Voir les logs
```bash
dcl  # Logs globaux
```

#### 🎯 Démarrer un service spécifique
```bash
dbackend  # Backend
dfrontend # Frontend
ddb       # Base de données
```

#### 📜 Logs spécifiques
```bash
dlogs_backend  # Backend
dlogs_frontend # Frontend
dlogs_db       # Base de données
```

#### 🖥 Accéder aux conteneurs
```bash
dbash  # Ouvrir un shell bash dans le backend
dsh    # Ouvrir un shell sh dans le backend
dpsql  # Ouvrir PostgreSQL avec psql
```

---

## 📌 Remarque
Assurez-vous d'avoir Docker et Docker Compose v2 installés sur votre machine avant d'exécuter ces commandes. Vous pouvez vérifier les versions avec :

```bash
docker --version
docker compose version
```

Let's Go ! 🚀

## 📌 Attention : 
Ce projet est réalisé dans un cadre académique et donc fictif pour lequel aucun réel achat ou aucune réservation ne pourrait etre effectuée ! 

