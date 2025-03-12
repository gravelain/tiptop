# Étape 1 : Construction
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm ci

# Copier tout le code source dans l'image
COPY . .

# Construire le projet NestJS
RUN npm run build

# Étape 2 : Image finale (Optimisée pour la production)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers construits depuis l'étape de build
COPY --from=build /app/dist /app/dist

# Copier package.json et package-lock.json
COPY --from=build /app/package*.json /app/

# Installer les dépendances de production
RUN npm ci --omit=dev

# Exposer le port de l'application
EXPOSE 5000

# Commande pour démarrer l'application NestJS
CMD ["node", "dist/main.js"]
