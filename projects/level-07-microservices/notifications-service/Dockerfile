# Build para notifications-service (sin HTTP, solo consume eventos)
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero
COPY package.json ./
RUN npm install --production

# Copiar código (event-bus compartido y el servicio)
COPY event-bus ./event-bus
COPY notifications-service ./notifications-service

WORKDIR /app/notifications-service

# Sin EXPOSE — no expone puertos HTTP

CMD ["node", "index.js"]
