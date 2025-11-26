# =========================
# 1) Etapa de build (Node)
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos solo package.json y lock primero para cache
COPY package*.json ./

RUN npm ci

# Ahora el resto del código
COPY . .

# Build de producción
RUN npm run build

# =========================
# 2) Etapa de runtime (Nginx)
# =========================
FROM nginx:alpine

# Configuración personalizada para SPA Vue (history mode)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Archivos estáticos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
