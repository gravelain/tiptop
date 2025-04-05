### VARIABLES ###
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
DATE := $(shell date +%F)

DOCKER_COMPOSE_DEV = docker compose -f docker-compose.yaml -f docker-compose.dev.yaml
DOCKER_COMPOSE_PREPROD = docker compose -f docker-compose.yaml -f docker-compose.preprod.yaml
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.yaml -f docker-compose.prod.yaml

DOCKER_COMPOSE_DEV_LOCAL = docker compose -f docker-compose.yaml -f docker-compose.dev-local.yaml

BACKEND_CONTAINER = backend
FRONTEND_CONTAINER = frontend

### ALIASES POUR DÉMARRER LES ENVIRONNEMENTS ###
up-dev: ## Démarre l'environnement de développement
	$(DOCKER_COMPOSE_DEV) up -d --build

up-dev-local: ## Démarre l'environnement de développement
	$(DOCKER_COMPOSE_DEV_LOCAL) up -d --build

up-preprod: ## Démarre l'environnement de préproduction
	$(DOCKER_COMPOSE_PREPROD) up -d --build

up-prod: ## Démarre l'environnement de production
	$(DOCKER_COMPOSE_PROD) up -d --build

down-dev: ## Stoppe l'environnement de développement
	$(DOCKER_COMPOSE_DEV) down

down-preprod: ## Stoppe l'environnement de préproduction
	$(DOCKER_COMPOSE_PREPROD) down

down-prod: ## Stoppe l'environnement de production
	$(DOCKER_COMPOSE_PROD) down

restart-dev: ## Redémarre dev proprement
	make down-dev && make up-dev

restart-preprod: ## Redémarre préprod proprement
	make down-preprod && make up-preprod

restart-prod: ## Redémarre prod proprement
	make down-prod && make up-prod

logs-dev: ## Affiche les logs des conteneurs en dev
	$(DOCKER_COMPOSE_DEV) logs -f

logs-preprod: ## Affiche les logs en préprod
	$(DOCKER_COMPOSE_PREPROD) logs -f

logs-prod: ## Affiche les logs en prod
	$(DOCKER_COMPOSE_PROD) logs -f

### BUILD ###
build-dev: ## Build les conteneurs en dev
	$(DOCKER_COMPOSE_DEV) build

build-preprod: ## Build en préprod
	$(DOCKER_COMPOSE_PREPROD) build

build-prod: ## Build en prod
	$(DOCKER_COMPOSE_PROD) build

### TESTS ###
test-backend: ## Lance les tests backend
	docker exec -it $(BACKEND_CONTAINER) npm test --prefix /usr/src/app

test-frontend: ## Lance les tests frontend
	docker exec -it $(FRONTEND_CONTAINER) npm test --prefix /usr/src/app

### DÉPLOIEMENT ET BACKUP ###
deploy: ## Déploie le projet (script personnalisé)
	bash ./scripts/deploy.sh

backup: ## Sauvegarde de la base de données
	bash ./scripts/backup.sh

restore: ## Restaure une sauvegarde
	bash ./scripts/restore.sh

### DOCKER UTILITAIRE ###
docker-clean: ## Nettoie Docker (conteneurs, images, volumes)
	docker system prune -af --volumes

docker-cc: ## Nettoie le cache Docker
	docker builder prune

docker-login: ## Connexion à Docker Hub
	echo $$DOCKER_PASS | docker login -u $$DOCKER_USER --password-stdin

docker-pull: ## Récupère les images depuis Docker Hub
	docker pull thierrytemgoua98/mon-backend:latest
	docker pull thierrytemgoua98/mon-frontend:latest

### SONARQUBE ###
sonar: ## Analyse de code avec SonarQube
	npx sonar-scanner \
		-Dsonar.host.url=$$SONARQUBE_URL \
		-Dsonar.login=$$SONARQUBE_TOKEN

### INFO ###
help: ## Affiche cette aide
	@echo "Usage : make [target]"
	@echo "Exemples : make up-dev, make up-preprod, make up-prod"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
