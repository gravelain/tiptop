# 🛠 Étape 1 : Construction de l'application
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances (inclut devDeps car on est encore en build)
RUN npm ci

# Copier le reste du code source
COPY . .

# Compiler le projet NestJS
RUN npm run build


# 🧼 Étape 2 : Image finale optimisée pour la production
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers construits depuis l'étape de build
COPY --from=build /app/dist ./dist

# Copier package.json et package-lock.json pour réinstaller les deps
COPY --from=build /app/package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Exposer le port (modifie-le si ton app Nest utilise un port différent)
EXPOSE 5000

# Commande de démarrage (via script dans package.json)
CMD ["npm", "run", "start:prod"]
