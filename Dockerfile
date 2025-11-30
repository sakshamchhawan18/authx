# rebuild-railway-001

# force rebuild 01
# ---------- Builder ----------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Runner ----------
FROM node:18-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
COPY --from=builder /app/dist ./dist

# Generate Prisma client
RUN npx prisma generate

# Start app + run migrations at runtime
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
