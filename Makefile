dev:
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d

preprod:
	docker compose -f docker-compose.yaml -f docker-compose.preprod.yaml up --build -d
	
prod:
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build -d

up:
	docker compose up --build -d
down:
	docker compose down
prune:
	docker system prune -a --volumes

