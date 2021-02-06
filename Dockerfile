FROM node:alpine

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

CMD [ "node", "index.js" ]