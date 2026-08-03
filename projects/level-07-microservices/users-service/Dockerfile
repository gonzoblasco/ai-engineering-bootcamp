# Build para users-service (puerto 3001)
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package.json ./
RUN npm install --production

# Copiar código (el event-bus compartido y el servicio)
COPY event-bus ./event-bus
COPY users-service ./users-service

WORKDIR /app/users-service

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "index.js"]
