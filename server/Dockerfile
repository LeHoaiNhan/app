FROM node:20-alpine

WORKDIR /app

# Install OS deps Prisma needs on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev && npx prisma generate

COPY src ./src

EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000

# Run migrations on boot, then start
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
