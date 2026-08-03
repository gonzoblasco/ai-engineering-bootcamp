# Build para orders-service (puerto 3002)
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package.json ./
RUN npm install --production

# Copiar código (el event-bus compartido y el servicio)
COPY event-bus ./event-bus
COPY orders-service ./orders-service

WORKDIR /app/orders-service

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "index.js"]
