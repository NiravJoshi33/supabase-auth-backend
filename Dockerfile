FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY src ./src

RUN npm install

RUN npm run build

# Remove dev dependencies
RUN npm prune --production 



EXPOSE 5051

CMD ["node", "dist/index.js"]