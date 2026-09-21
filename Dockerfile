FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=25s --retries=5 \
  CMD wget -qO- http://localhost:4000/health >/dev/null 2>&1 || exit 1

CMD ["npm", "start"]
