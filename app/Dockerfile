# Usar uma imagem base do Node.js
FROM node:22.5-alpine

WORKDIR /srv/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]