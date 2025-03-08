# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./

# On expose le port sur lequel Next.js va écouter
EXPOSE 3000

# Lancer Next.js avec SSR
CMD ["npm", "run", "start"]
