
# The Tip Top

Bienvenue dans le projet **"The Tip Top"**, une plateforme web d’analyse et de visualisation des données de performance et des alertes sur des applications. Ce projet repose sur une architecture microservices, conteneurisée avec Docker et orchestrée via Docker Compose v2. Il utilise des outils comme **Prometheus** et **Grafana** pour la surveillance, **SonarQube** pour l'analyse de la qualité du code, et **Jenkins** pour l'intégration continue et le déploiement.

Le déploiement est effectué sur une instance **EC2 AWS** afin de garantir des performances optimisées et une disponibilité élevée.

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

Le projet **The Tip Top** est une application de monitoring et d’analyse de performance des services. Il est composé de plusieurs services fonctionnant ensemble pour gérer et visualiser les métriques des applications déployées. Les principaux outils de ce projet sont :

- **Prometheus** : collecte les métriques et les enregistre.
- **Grafana** : affiche les métriques collectées via Prometheus.
- **SonarQube** : analyse la qualité du code.
- **Jenkins** : gère l’intégration continue (CI/CD).
- **Traefik** : proxy inverse pour le routage des requêtes et le SSL.

L'infrastructure est déployée sur une instance **EC2 AWS** avec Docker et Docker Compose, facilitant le déploiement et la gestion des services.

## Technologies utilisées

| Technologie        | Utilité                                | Justification                                                                                      |
|--------------------|----------------------------------------|----------------------------------------------------------------------------------------------------|
| **Docker**         | Conteneurisation                       | Permet d’isoler les services et assure leur portabilité entre différents environnements.           |
| **Docker Compose** | Orchestration des services             | Simplifie la gestion de multiples conteneurs et la gestion de leurs dépendances.                   |
| **Prometheus**     | Collecte de métriques                  | Outil de monitoring pour collecter les métriques de performance des différents services.            |
| **Grafana**        | Visualisation des métriques            | Interface graphique pour visualiser les métriques collectées par Prometheus.                       |
| **SonarQube**      | Analyse de la qualité du code          | Permet de suivre la qualité du code source et détecter les vulnérabilités et problèmes.             |
| **Jenkins**        | CI/CD                                  | Permet d’automatiser le processus de test, build et déploiement des applications.                   |
| **Traefik**        | Proxy inverse et Load Balancer         | Gère le routage des requêtes entrantes et distribue la charge entre les services.                   |
| **PostgreSQL**     | Base de données                        | Base de données pour stocker les données liées à SonarQube (analyse de la qualité du code) et les autres services métiers. |

## Architecture du projet

Le projet utilise une architecture **microservices** où chaque composant fonctionne de manière isolée dans des conteneurs Docker. **Docker Compose** permet de gérer et orchestrer ces conteneurs de manière simple et fluide.

### Architecture simplifiée :
```
+------------------+    +------------------+    +---------------------+
|   Frontend (Next.js)   |<-->|  Backend (NestJS)  |<-->|   PostgreSQL (DB)   |
+------------------+    +------------------+    +---------------------+
         |                      |                         |
         |                      |                         |
    +--------------------------+                         |
    |   Traefik (Proxy Inverse) |<------------------------+
    +--------------------------+
         |
+-----------------------+
|   SonarQube (Analyse)  |
+-----------------------+
         |
+-----------------------+
|   Jenkins (CI/CD)      |
+-----------------------+
         |
+-----------------------+
|   Prometheus (Metrics) |
+-----------------------+
         |
+-----------------------+
|   Grafana (Monitoring) |
+-----------------------+
```

### Description des composants principaux :

- **Frontend (Next.js)** : Application web qui interagit avec le backend.
- **Backend (NestJS)** : API RESTful pour gérer les données et interagir avec la base de données.
- **PostgreSQL** : Base de données relationnelle utilisée pour stocker les données d'application et de SonarQube.
- **SonarQube** : Outil d'analyse statique pour vérifier la qualité du code source.
- **Prometheus & Grafana** : Collecte des métriques et visualisation de la performance du système.
- **Jenkins** : Automatisation du pipeline CI/CD pour l’intégration et le déploiement.
- **Traefik** : Proxy inverse qui gère les requêtes et assure la distribution de charge et la gestion du SSL.

## Services et ports d’accès

| Service              | Conteneur                      | Port Local            | Port VPS (Accès Public)   | Description                                      |
|----------------------|--------------------------------|-----------------------|---------------------------|--------------------------------------------------|
| **Frontend (Next.js)**| frontend                       | 3000                  | 95.111.240.167:3000       | Interface utilisateur pour interagir avec l’application. |
| **Backend (NestJS)**  | backend                        | 3001                  | 95.111.240.167:3001       | API RESTful pour gérer les services métiers.     |
| **Base de Données (PostgreSQL)** | db_postgresql           | 5432                  | 95.111.240.167:5432       | Base de données pour stocker les données liées à SonarQube. |
| **SonarQube**         | sonarqube                      | 9000                  | 95.111.240.167:9000       | Analyse de la qualité du code.                   |
| **Prometheus**        | prometheus                     | 9090                  | 95.111.240.167:9090       | Collecte des métriques de performance.           |
| **Grafana**           | grafana                        | 3001                  | 95.111.240.167:3001       | Visualisation des métriques collectées par Prometheus. |
| **Jenkins**           | jenkins                        | 8080, 50000           | 95.111.240.167:8080       | Outil CI/CD pour automatiser les builds et les déploiements. |
| **Traefik**           | traefik                        | 80                    | 95.111.240.167:80         | Proxy inverse et Load Balancer.                  |

## Configuration de l’environnement

Avant de démarrer, vous devez configurer votre environnement en fonction de vos besoins (développement, préproduction, production).

### Variables d'environnement

Créez ou mettez à jour un fichier `.env` dans la racine du projet pour définir les variables spécifiques à votre environnement :

```bash
DATABASE_URL=postgres://admin:admin@db:5432/mydatabase
JWT_SECRET=mysecretkey
NODE_ENV=production
```

## Commandes utiles

Voici quelques commandes pour gérer l’infrastructure :

| Commande       | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `dcu`          | Démarre tous les services en arrière-plan                                    |
| `dcd`          | Arrête tous les services                                                     |
| `dcr`          | Redémarre les services                                                       |
| `dcl`          | Affiche les logs globaux                                                     |
| `dbackend`     | Démarre uniquement le service backend                                        |
| `dfrontend`    | Démarre uniquement le service frontend                                       |
| `dlogs_backend`| Affiche les logs du backend                                                  |
| `dlogs_frontend`| Affiche les logs du frontend                                                |
| `dbash`        | Ouvre un shell bash dans le conteneur backend                               |

## Démarrer les services

Pour démarrer l’ensemble des services, utilisez la commande suivante :

```bash
dcu
```

Pour démarrer un service spécifique, par exemple le backend :

```bash
dbackend
```

## Accéder aux conteneurs

Vous pouvez accéder à un conteneur en utilisant la commande suivante (exemple pour le backend) :

```bash
docker exec -it my-project-the-tiptop-backend-1 bash
```

Cela vous permettra de lancer des commandes directement dans le conteneur backend.

## Conclusion

Le projet **The Tip Top** fournit une architecture robuste et modulable pour le monitoring et la gestion des services à grande échelle. Il est conçu pour être facilement extensible et déployé dans différents environnements. Grâce à l’utilisation de Docker, Docker Compose, et des outils comme Jenkins, Prometheus, Grafana et SonarQube, vous avez une infrastructure solide pour collecter des métriques, surveiller la qualité du code et automatiser le déploiement de vos services.

---

**Let's Go! 🚀**

Si tu rencontres des problèmes ou as des questions, n’hésite pas à ouvrir un ticket ou à poser tes questions dans la section *Issues* du repository GitHub.

---
