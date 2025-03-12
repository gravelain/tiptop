# Étape 1 : construction
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  

# Étape 2 : image finale
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/

RUN npm install --omit=dev

CMD ["node", "dist/index.js"]
