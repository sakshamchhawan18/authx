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

# Generate prisma client (uses DATABASE_URL)
RUN npx prisma generate

# Railway will inject PORT. We listen on 0.0.0.0.
CMD ["node", "dist/server.js"]
