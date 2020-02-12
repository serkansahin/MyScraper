FROM node:lts-alpine3.11

WORKDIR /opt

ADD . .

RUN npm install

CMD ["node", "/opt/src/app.js"]
