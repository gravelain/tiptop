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

Ce projet repose sur une architecture **microservices** où chaque composant (frontend, backend, base de données, monitoring) est conteneurisé dans un **Docker**. L’infrastructure utilise **Docker Compose** pour l’orchestration des services et **Traefik** comme proxy inverse. Le backend est développé avec **NestJS** et le frontend avec **Next.js**.

L'application s’appuie sur **SonarQube** pour l'analyse de la qualité du code et utilise des bases de données **PostgreSQL** pour SonarQube et **MySQL** pour les données métiers de l’application. **Prometheus** et **Grafana** sont utilisés pour la collecte et la visualisation des métriques de performance.

Le projet est déployé sur un **VPS** avec l'IP [95.111.240.167](http://95.111.240.167/).

## Technologies utilisées

| Technologie  | Utilité  | Justification  |
|--------------|---------|----------------|
| **NestJS**  | Backend | Framework modulaire et scalable basé sur Node.js avec support TypeScript, idéal pour des APIs performantes. |
| **Next.js**  | Frontend | Framework React optimisé pour le rendu côté serveur (SSR) et les performances SEO. |
| **PostgreSQL** | Base de données (SonarQube) | Base relationnelle robuste et performante, utilisée pour stocker les données de SonarQube. |
| **MySQL** | Base de données (Application) | Base de données SQL légère et rapide pour gérer les données métiers de l'application. |
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
my-project/
├── backend/                 # Code source du backend (NestJS)
│   ├── Dockerfile           # Dockerfile pour construire l'image du backend
│   ├── package.json         # Définition des dépendances et scripts NPM
│   ├── package-lock.json    # Verrouillage des versions des dépendances
│   └── src/                 # Code source de l'application NestJS
│       ├── main.ts          # Point d'entrée de l'application
│       ├── app.module.ts    # Module principal de l'application
│       ├── app.controller.ts# Exemple de contrôleur
│       └── app.service.ts   # Exemple de service
│       └── ...              # Autres modules, controllers, services, etc.
├── frontend/                # Code source du frontend (Next.js)
│   ├── Dockerfile           # Dockerfile pour construire l'image du frontend
│   ├── package.json         # Dépendances et scripts de l'application Next.js
│   ├── package-lock.json    # Verrouillage des versions
│   └── pages/               # Pages de l'application Next.js
│       ├── index.js         # Page d'accueil
│       ├── _app.js          # Configuration globale de Next.js
│       └── ...              # Autres pages et composants
├── grafana/                 # Configuration et dashboards Grafana
│   ├── dashboards/          # Fichiers JSON des dashboards personnalisés
│   └── grafana.ini          # Fichier de configuration de Grafana (optionnel)
├── jenkins/                 # Configuration de Jenkins pour CI/CD
│   ├── data/                # Volume de persistance (jobs, plugins, configuration)
│   └── Jenkinsfile          # Pipeline Jenkins définissant les étapes CI/CD
├── monitoring/              # Fichiers de configuration pour la surveillance
│   └── alerting/            # Scripts/fichiers pour la gestion des alertes (optionnel)
├── prometheus/              # Configuration de Prometheus
│   └── prometheus.yml       # Fichier principal de configuration de Prometheus
├── scripts/                 # Scripts utilitaires et de déploiement
│   ├── deploy.sh            # Script pour déployer l'infrastructure
│   └── backup.sh            # Script de sauvegarde des données (optionnel)
├── sonarqube/               # Configuration de SonarQube (personnalisable)
│   └── sonar.properties     # Fichier de configuration de SonarQube (optionnel)
├── traefik/                 # Configuration du reverse proxy Traefik
│   └── traefik.yml          # Fichier de configuration principal de Traefik
├── docker-compose.yml       # Configuration principale des services Docker (production)
├── docker-compose.dev.yml   # Configuration spécifique pour l'environnement de développement
├── docker-compose.preprod.yml # Configuration pour la préproduction
├── docker-compose.prod.yml  # Configuration pour l'environnement de production
└── .env.*                   # Fichiers d'environnement (ex: .env, .env.local, .env.production)

```

---


## Services et ports d’accès


| Service               | Conteneur         | Port Local | Port VPS (Accès Public) | Description                      |
|-----------------------|-------------------|------------|-------------------------|----------------------------------|
| **Frontend (Next.js)** | frontend          | 3000       | 95.111.240.167:3000      | Interface utilisateur           |
| **Backend (NestJS)**   | backend           | 4000       | 95.111.240.167:4000      | API RESTful du backend          |
| **Base de Données (MySQL)** | db_mysql        | 3306       | 95.111.240.167:3306      | Base de données MySQL pour l'application |
| **SonarQube**          | sonarqube         | 9000       | 95.111.240.167:9000      | Analyse de code et qualité du projet |
| **Base de Données (PostgreSQL pour SonarQube)** | db_postgresql  | 5432       | 95.111.240.167:5432      | Base de données PostgreSQL pour SonarQube |
| **Prometheus**         | prometheus        | 9090       | 95.111.240.167:9090      | Collecte des métriques          |
| **Grafana**            | grafana           | 3001       | 95.111.240.167:3001      | Visualisation des métriques     |
| **Jenkins**            | jenkins           | 8080, 50000| 95.111.240.167:8080      | CI/CD et gestion des pipelines  |
| **Traefik**            | traefik           | 80         | 95.111.240.167:80        | Proxy inverse et Load Balancer  |

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

