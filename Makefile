### VARIABLES ###
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
DATE := $(shell date +%F)

### ALIASES ###
up:
	docker compose -f docker-compose.yaml up -d --build

down:
	docker compose -f docker-compose.yaml down

logs:
	docker compose logs -f

build:
	docker compose -f docker-compose.yaml build

start-dev:
	docker compose -f docker-compose.dev.yaml up --build

stop-dev:
	docker compose -f docker-compose.dev.yaml down

test-backend:
	docker exec -it backend npm test --prefix /usr/src/app

test-frontend:
	docker exec -it frontend npm test --prefix /usr/src/app

deploy:
	bash ./scripts/deploy.sh

backup:
	bash ./scripts/backup.sh

restore:
	bash ./scripts/restore.sh

### DOCKER ###
docker-clean:
	docker system prune -af --volumes

docker-login:
	echo $$DOCKER_PASS | docker login -u $$DOCKER_USER --password-stdin

docker-pull:
	docker pull thierrytemgoua98/mon-backend:latest
	docker pull thierrytemgoua98/mon-frontend:latest

### SONAR ###
sonar:
	npx sonar-scanner \
		-Dsonar.host.url=$$SONARQUBE_URL \
		-Dsonar.login=$$SONARQUBE_TOKEN

### INFO ###
help:
	@echo "Usage : make [target]"
	@echo "Targets :"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

