# Stage 1: Builder (установка всех deps, build для NestJS)
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (только prod-deps, копируем готовый билд)
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start:prod"]