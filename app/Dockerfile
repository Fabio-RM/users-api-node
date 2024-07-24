# Usar uma imagem base do Node.js
FROM node:22.5-alpine

WORKDIR /srv/app

COPY package*.json ./
RUN npm install

COPY . .

# Compilar o TypeScript
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]