# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

# Build et suppression des dépendances inutiles
RUN npm run build && npm prune --omit=dev

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copier uniquement ce qui est nécessaire
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Sécurité : Droits et utilisateur
RUN chown -R node:node /app
USER node

# Exposer le port
EXPOSE 5000

# Utiliser un script d'entrée sécurisé
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]

