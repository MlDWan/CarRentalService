FROM node:12.13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm run build