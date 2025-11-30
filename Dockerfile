# ---------- Builder ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build TypeScript only (NO prisma generate here)
RUN npm run build


# ---------- Runner ----------
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma schema for runtime `prisma generate`
COPY prisma ./prisma

# Copy compiled JavaScript
COPY --from=builder /app/dist ./dist

# Generate Prisma client at runtime (env vars available here)
# DATABASE_URL now exists because docker-compose injects it
RUN npx prisma generate

CMD ["node", "dist/server.js"]
